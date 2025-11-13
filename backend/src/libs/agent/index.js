// libs/agentService.js - Service layer for Security Agent
const SecurityAgent = require('../agent');

class AgentService {
  constructor() {
    this.agent = null;
    this.isInitialized = false;
    this.commandQueue = [];
    this.isProcessing = false;
  }

  /**
   * Initialize the security agent
   */
  initialize() {
    if (this.isInitialized) {
      return { success: true, message: 'Agent already initialized' };
    }

    try {
      this.agent = new SecurityAgent();
      this.isInitialized = true;
      return { 
        success: true, 
        message: 'Agent initialized successfully',
        modules: this.getModuleStatus()
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to initialize agent',
        error: error.message 
      };
    }
  }

  /**
   * Execute a command through the agent
   */
  async executeCommand(command, args = []) {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    
    return new Promise((resolve, reject) => {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      let output = [];
      let errors = [];

      console.log = (...args) => {
        output.push(args.map(a => String(a)).join(' '));
        originalLog.apply(console, args);
      };

      console.error = (...args) => {
        errors.push(args.map(a => String(a)).join(' '));
        originalError.apply(console, args);
      };

      try {
        this.agent.executeCommand(fullCommand)
          .then(() => {
            console.log = originalLog;
            console.error = originalError;
            
            resolve({
              success: true,
              command: fullCommand,
              output: output.join('\n'),
              errors: errors.length > 0 ? errors.join('\n') : null
            });
          })
          .catch(err => {
            console.log = originalLog;
            console.error = originalError;
            
            reject({
              success: false,
              command: fullCommand,
              error: err.message,
              output: output.join('\n')
            });
          });
      } catch (err) {
        console.log = originalLog;
        console.error = originalError;
        
        reject({
          success: false,
          command: fullCommand,
          error: err.message
        });
      }
    });
  }

  /**
   * Get available commands
   */
  getAvailableCommands() {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized');
    }

    const commands = {};
    
    Object.entries(this.agent.mappings).forEach(([cmd, config]) => {
      const category = this.getCategoryForCommand(cmd);
      
      if (!commands[category]) {
        commands[category] = [];
      }
      
      commands[category].push({
        command: cmd,
        description: config.description,
        module: config.module,
        method: config.method
      });
    });

    // Add system commands
    commands['System'] = [
      { command: 'help', description: 'Show available commands' },
      { command: 'status', description: 'Show system status' },
      { command: 'history', description: 'Show command history' },
      { command: 'version', description: 'Show version information' },
      { command: 'clear', description: 'Clear screen' }
    ];

    return commands;
  }

  /**
   * Get module status
   */
  getModuleStatus() {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized');
    }

    const status = {};
    
    this.agent.definitions.forEach(moduleDef => {
      const module = this.agent.modules[moduleDef.name];
      
      status[moduleDef.name] = {
        displayName: moduleDef.displayName,
        loaded: !!module,
        configured: this.isModuleConfigured(moduleDef.name, module)
      };
    });

    return status;
  }

  /**
   * Get command history
   */
  getCommandHistory(limit = 20) {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized');
    }

    const history = this.agent.commandHistory.slice(-limit);
    return history.map((cmd, idx) => ({
      index: this.agent.commandHistory.length - history.length + idx + 1,
      command: cmd,
      timestamp: new Date().toISOString() // Note: Original doesn't track timestamps
    }));
  }

  /**
   * Check if a command exists
   */
  commandExists(command) {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized');
    }

    return !!this.agent.commands[command];
  }

  /**
   * Get agent version info
   */
  getVersionInfo() {
    return {
      agentVersion: '2.3.0',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      moduleCount: this.isInitialized ? Object.keys(this.agent.modules).length : 0,
      commandCount: this.isInitialized ? Object.keys(this.agent.commands).length : 0
    };
  }

  /**
   * Batch execute commands
   */
  async executeBatch(commands) {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized');
    }

    const results = [];
    
    for (const cmdConfig of commands) {
      try {
        const result = await this.executeCommand(cmdConfig.command, cmdConfig.args || []);
        results.push({
          ...result,
          index: results.length
        });
      } catch (error) {
        results.push({
          success: false,
          command: cmdConfig.command,
          error: error.message || error,
          index: results.length
        });
      }
    }

    return {
      success: true,
      total: commands.length,
      results
    };
  }

  /**
   * Shutdown the agent
   */
  shutdown() {
    if (!this.isInitialized) {
      return { success: false, message: 'Agent not initialized' };
    }

    try {
      // Cleanup traffic monitor if running
      if (this.agent.modules.trafficMonitor && 
          this.agent.modules.trafficMonitor.stopMonitoring) {
        this.agent.modules.trafficMonitor.stopMonitoring();
      }

      this.agent = null;
      this.isInitialized = false;
      this.commandQueue = [];

      return { success: true, message: 'Agent shutdown successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error during shutdown',
        error: error.message 
      };
    }
  }

  // Private helper methods
  getCategoryForCommand(cmd) {
    if (cmd.includes('scan') || cmd.includes('network') || cmd.includes('check-deps') || cmd.includes('security-audit')) {
      return 'Network Scanning';
    }
    if (cmd.includes('analyze-code') || cmd.includes('analyze-project')) {
      return 'Code Analysis';
    }
    if (cmd.includes('monitor') || cmd.includes('traffic')) {
      return 'Traffic Monitoring';
    }
    if (cmd.includes('ai-')) {
      return 'AI Features';
    }
    if (cmd.includes('cve') || cmd.includes('cwe') || cmd.includes('exploit') || cmd.includes('scan-deps')) {
      return 'CVE & Security';
    }
    if (cmd.includes('test-')) {
      return 'API Testing';
    }
    if (cmd.includes('refactor')) {
      return 'Code Refactoring';
    }
    if (cmd.includes('scrape')) {
      return 'Web Scraping';
    }
    if (cmd.includes('vuln')) {
      return 'Vulnerability Assessment';
    }
    return 'Other';
  }

  isModuleConfigured(moduleName, module) {
    if (!module) return false;
    
    if (moduleName === 'aiAnalyzer') {
      return module.isConfigured && module.isConfigured();
    }
    
    return true;
  }
}

// Singleton instance
let agentServiceInstance = null;

module.exports = {
  getInstance: () => {
    if (!agentServiceInstance) {
      agentServiceInstance = new AgentService();
    }
    return agentServiceInstance;
  },
  AgentService
};