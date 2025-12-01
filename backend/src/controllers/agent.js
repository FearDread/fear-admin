const SecurityAgent = require('../libs/agent');

class AgentController {
  constructor() {
    this.agentInstance = null;
    this.isInitialized = false;
  }

  /**
   * Get or create agent instance (singleton pattern)
   */
  getInstance() {
    if (!this.agentInstance) {
      this.agentInstance = new SecurityAgent();
      this.isInitialized = false;
    }
    return this.agentInstance;
  }

  /**
   * Initialize the security agent
   */
  async initialize(req, res, handler, logger) {
    try {
      const agent = this.getInstance();
      
      if (this.isInitialized) {
        return res.status(200).json({
          success: true,
          message: 'Agent already initialized',
          initialized: true
        });
      }

      // Agent auto-loads modules in constructor
      this.isInitialized = true;

      logger.info('Agent initialized via API');
      
      return res.status(200).json({
        success: true,
        message: 'Agent initialized successfully',
        initialized: true,
        modulesLoaded: Object.keys(agent.modules).length,
        commandsRegistered: Object.keys(agent.commands).length
      });

    } catch (error) {
      logger.error('Agent initialization error:', error);
      return handler.error(res, error.message || 'Failed to initialize agent', 500);
    }
  }

  /**
   * Execute a single command
   */
  async executeCommand(req, res, handler, logger) {
    try {
      const { command, args } = req.body;

      if (!command) {
        return handler.error(res, 'Command is required', 400);
      }

      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        this.isInitialized = true;
      }

      // Check if command exists
      if (!agent.commands[command]) {
        return handler.error(res, `Unknown command: ${command}`, 400);
      }

      // Parse args
      const parsedArgs = Array.isArray(args) ? args : (args ? [args] : []);

      // Execute command and capture output
      const output = await this.captureCommandOutput(
        () => agent.commands[command](parsedArgs)
      );

      logger.info(`Agent command executed: ${command}`);
      
      return handler.success(res, {
        success: true,
        command,
        output,
        executedAt: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Agent command execution error:', error);
      return handler.error(res, error.message || 'Command execution failed', 500);
    }
  }

  /**
   * Execute multiple commands in sequence
   */
  async executeBatch(req, res, handler, logger) {
    try {
      const { commands } = req.body;

      if (!Array.isArray(commands) || commands.length === 0) {
        return handler.error(res, 'Commands array is required', 400);
      }

      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        this.isInitialized = true;
      }

      const results = [];

      for (const cmdConfig of commands) {
        const { command, args } = cmdConfig;
        
        if (!command) {
          results.push({
            success: false,
            error: 'Command name is required'
          });
          continue;
        }

        if (!agent.commands[command]) {
          results.push({
            success: false,
            command,
            error: `Unknown command: ${command}`
          });
          continue;
        }

        try {
          const parsedArgs = Array.isArray(args) ? args : (args ? [args] : []);
          const output = await this.captureCommandOutput(
            () => agent.commands[command](parsedArgs)
          );

          results.push({
            success: true,
            command,
            output
          });
        } catch (error) {
          results.push({
            success: false,
            command,
            error: error.message
          });
        }
      }

      logger.info(`Agent batch execution: ${commands.length} commands`);
      
      return handler.success(res, {
        success: true,
        totalCommands: commands.length,
        results,
        executedAt: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Agent batch execution error:', error);
      return handler.error(res, error.message || 'Batch execution failed', 500);
    }
  }

  /**
   * Get all available commands
   */
  async getCommands(req, res, handler, logger) {
    try {
      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        this.isInitialized = true;
      }

      const commands = {};
      
      // Build command list with descriptions
      Object.entries(agent.mappings).forEach(([cmd, config]) => {
        commands[cmd] = {
          description: config.description,
          module: config.module,
          method: config.method
        };
      });

      // Add built-in commands
      const builtInCommands = {
        'help': { description: 'Show help information', module: 'core', method: 'showHelp' },
        'status': { description: 'Show system status', module: 'core', method: 'showStatus' },
        'history': { description: 'Show command history', module: 'core', method: 'showHistory' },
        'clear': { description: 'Clear screen', module: 'core', method: 'clearScreen' },
        'banner': { description: 'Show banner', module: 'core', method: 'showBanner' },
        'version': { description: 'Show version info', module: 'core', method: 'showVersion' },
        'tips': { description: 'Show tips and tricks', module: 'core', method: 'showTips' },
        'exit': { description: 'Exit agent', module: 'core', method: 'exit' }
      };

      Object.assign(commands, builtInCommands);

      return handler.success(res, {
        success: true,
        totalCommands: Object.keys(commands).length,
        commands
      });

    } catch (error) {
      logger.error('Error fetching commands:', error);
      return handler.error(res, 'Failed to fetch commands', 500);
    }
  }

  /**
   * Check if a specific command exists
   */
  async checkCommand(req, res, handler, logger) {
    try {
      const { command } = req.params;
      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        this.isInitialized = true;
      }

      const exists = !!agent.commands[command];
      const config = agent.mappings[command];

      return handler.success(res, {
        success: true,
        command,
        exists,
        details: config || null
      });

    } catch (error) {
      logger.error('Error checking command:', error);
      return handler.error(res, 'Failed to check command', 500);
    }
  }

  /**
   * Get agent and module status
   */
  async getStatus(req, res, handler, logger) {
    try {
      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        return handler.success(res, {
          success: true,
          initialized: false,
          message: 'Agent not initialized'
        });
      }

      // Get module status
      const modules = {};
      agent.definitions.forEach(moduleDef => {
        const module = agent.modules[moduleDef.name];
        modules[moduleDef.name] = {
          displayName: moduleDef.displayName,
          loaded: !!module,
          status: module ? 'ready' : 'unavailable'
        };

        // Special handling for AI modules
        if (moduleDef.name === 'aiAnalyzer' && module) {
          modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
          modules[moduleDef.name].provider = module.getProviderName ? module.getProviderName() : null;
        }
        if (moduleDef.name === 'aiChat' && module) {
          modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
        }
      });

      // Get background services status
      const services = {};
      agent.backgroundServices.forEach((service, name) => {
        services[name] = agent.serviceStatus.get(name) || 'stopped';
      });

      const version = this.getVersionInfo(agent);

      return handler.success(res, {
        success: true,
        initialized: true,
        version,
        modules,
        services,
        stats: {
          modulesLoaded: Object.keys(agent.modules).length,
          commandsAvailable: Object.keys(agent.commands).length,
          servicesRunning: Array.from(agent.serviceStatus.values()).filter(s => s === 'running').length,
          commandHistory: agent.commandHistory.length
        }
      });

    } catch (error) {
      logger.error('Error fetching agent status:', error);
      return handler.error(res, 'Failed to fetch status', 500);
    }
  }

  /**
   * Get command history
   */
  async getHistory(req, res, handler, logger) {
    try {
      const { limit } = req.query;
      const agent = this.getInstance();
      
      if (!this.isInitialized) {
        return handler.success(res, {
          success: true,
          history: [],
          message: 'Agent not initialized'
        });
      }

      const limitNum = limit ? parseInt(limit) : 20;
      const history = agent.commandHistory.slice(-limitNum);

      return handler.success(res, {
        success: true,
        total: agent.commandHistory.length,
        limit: limitNum,
        history
      });

    } catch (error) {
      logger.error('Error fetching history:', error);
      return handler.error(res, 'Failed to fetch history', 500);
    }
  }

  /**
   * Get agent version information
   */
  async getVersion(req, res, handler, logger) {
    try {
      const agent = this.getInstance();
      const version = this.getVersionInfo(agent);

      return handler.success(res, {
        success: true,
        ...version
      });

    } catch (error) {
      logger.error('Error fetching version:', error);
      return handler.error(res, 'Failed to fetch version', 500);
    }
  }

  /**
   * Shutdown the agent
   */
  async shutdown(req, res, handler, logger) {
    try {
      const agent = this.getInstance();

      // Stop all background services
      const stoppedServices = [];
      agent.backgroundServices.forEach((service, name) => {
        if (agent.serviceStatus.get(name) === 'running') {
          agent.stopService(name);
          stoppedServices.push(name);
        }
      });

      // Cleanup modules
      if (agent.modules.trafficMonitor && agent.modules.trafficMonitor.stopMonitoring) {
        agent.modules.trafficMonitor.stopMonitoring();
      }

      this.isInitialized = false;
      this.agentInstance = null;

      logger.info('Agent shutdown via API');
      
      return handler.success(res, {
        success: true,
        message: 'Agent shutdown successfully',
        servicesStopped: stoppedServices
      });

    } catch (error) {
      logger.error('Agent shutdown error:', error);
      return handler.error(res, 'Failed to shutdown agent', 500);
    }
  }

  /**
   * Helper: Capture command output
   */
  async captureCommandOutput(commandFn) {
    const originalLog = console.log;
    const output = [];

    console.log = (...args) => {
      output.push(args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' '));
    };

    try {
      await commandFn();
      return output.join('\n');
    } finally {
      console.log = originalLog;
    }
  }

  /**
   * Helper: Get version info
   */
  getVersionInfo(agent) {
    return {
      version: '2.4.0',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      modulesLoaded: Object.keys(agent.modules).length,
      commandsAvailable: Object.keys(agent.commands).length
    };
  }
}

// Export singleton instance
module.exports = new AgentController();
