// modules/ai/ai.js - Enhanced Main AI Module
const AIConfig = require('./config');
const AIOperations = require('./operations');
const colorizer = require('../utils/colorizer');

const AiAnalyzer = function() {
  // Initialize configuration
  this.config = new AIConfig();
  
  // Initialize operations with config reference
  this.operations = new AIOperations(this.config);
  
  // Track initialization status
  this.initialized = false;
  
  console.log(colorizer.dim('\n🤖 AI Module Loading...'));
  this.initialize();
};

AiAnalyzer.prototype = {
  initialize() {
    // Check if any provider is configured
    const configured = this.config.isConfigured();
    
    if (configured) {
      console.log(colorizer.success('✓ AI Module Ready'));
      console.log(colorizer.dim(`  Active Provider: ${this.config.getProviderName()}`));
      console.log(colorizer.dim(`  Model: ${this.config.getModel()}`));
      this.initialized = true;
    } else {
      console.log(colorizer.warning('⚠ AI Module: No provider configured'));
      console.log(colorizer.dim('  Run "ai-setup" to configure a provider'));
    }
    console.log();
  },

  // Configuration methods
  setup(args) {
    return this.config.setup(args)
      .then(result => {
        if (result) {
          this.initialized = true;
        }
        return result;
      });
  },

  setProvider(args) {
    return this.config.setProvider(args)
      .then(() => {
        if (this.config.isConfigured()) {
          this.initialized = true;
        }
      });
  },

  isConfigured() {
    return this.config.isConfigured();
  },

  getProviderName() {
    return this.config.getProviderName();
  },

  getProvider() {
    return this.config.getProvider();
  },

  getModel() {
    return this.config.getModel();
  },

  // Operation methods - Code Analysis
  analyzeCode(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.analyzeCode(args);
  },

  analyzeBatch(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.analyzeBatch(args);
  },

  compareCodeVersions(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.compareCodeVersions(args);
  },

  // Operation methods - Security Analysis
  threatAssessment(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.threatAssessment(args);
  },

  explainVulnerability(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.explainVulnerability(args);
  },

  analyzeTrafficPattern(trafficData) {
    if (!this.ensureConfigured()) return Promise.resolve(null);
    return this.operations.analyzeTrafficPattern(trafficData);
  },

  // Operation methods - Code Generation
  generateNodeCode(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.generateNodeCode(args);
  },

  // Operation methods - Recommendations
  suggestImprovements(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.suggestImprovements(args);
  },

  // Operation methods - Chat
  chat(args) {
    if (!this.ensureConfigured()) return Promise.resolve();
    return this.operations.chat(args);
  },

  clearChatHistory() {
    this.operations.clearHistory();
    console.log(colorizer.success('Chat history cleared.\n'));
  },

  // Utility methods
  ensureConfigured() {
    if (!this.initialized || !this.config.isConfigured()) {
      console.log(colorizer.error('AI not configured. Please run "ai-setup <provider> <key>" first.\n'));
      console.log(colorizer.info('Supported providers:'));
      console.log(colorizer.dim(' * anthropic (Claude)'));
      console.log(colorizer.dim(' * openai (GPT)'));
      console.log(colorizer.dim(' * google (Gemini)\n'));
      return false;
    }
    return true;
  },

  // Status and info methods
  status() {
    console.log(colorizer.header('AI Module Status'));
    console.log(colorizer.separator());
    
    console.log(colorizer.section('Configuration'));
    console.log(colorizer.cyan('  Status: ') + 
      (this.initialized ? colorizer.green('✓ Initialized') : colorizer.red('✗ Not initialized')));
    
    if (this.config.isConfigured()) {
      console.log(colorizer.cyan('  Provider: ') + colorizer.bright(this.config.getProviderName()));
      console.log(colorizer.cyan('  Model: ') + colorizer.dim(this.config.getModel()));
    }
    
    console.log();
    console.log(colorizer.section('Available Providers'));
    
    const providers = [
      { name: 'Anthropic Claude', key: 'anthropic', available: !!this.config.anthropic },
      { name: 'OpenAI GPT', key: 'openai', available: !!this.config.openai },
      { name: 'Google Gemini', key: 'google', available: !!this.config.googleAi }
    ];
    
    providers.forEach(p => {
      const status = p.available ? colorizer.green('✓ Available') : colorizer.red('✗ Not configured');
      const model = p.available ? colorizer.dim(` (${this.config.models[p.key]})`) : '';
      console.log(`  ${p.name}: ${status}${model}`);
    });
    
    console.log();
    console.log(colorizer.section('Available Commands'));
    console.log(colorizer.bullet('ai-setup <provider> <key> - Configure AI provider'));
    console.log(colorizer.bullet('ai-provider <name> - Switch provider'));
    console.log(colorizer.bullet('ai-analyze <file> - Analyze code security'));
    console.log(colorizer.bullet('ai-batch <dir> [ext] - Batch analyze files'));
    console.log(colorizer.bullet('ai-compare <file1> <file2> - Compare versions'));
    console.log(colorizer.bullet('ai-threat <description> - Threat assessment'));
    console.log(colorizer.bullet('ai-explain <vulnerability> - Explain concept'));
    console.log(colorizer.bullet('ai-generate <description> - Generate code'));
    console.log(colorizer.bullet('ai-improve [path] - Suggest improvements'));
    console.log(colorizer.bullet('ai-chat [query] - Interactive chat'));
    console.log();
    
    if (this.operations.conversationHistory.length > 0) {
      console.log(colorizer.section('Chat History'));
      console.log(colorizer.cyan('  Messages: ') + this.operations.conversationHistory.length);
      console.log(colorizer.dim('  Use "ai-chat /history" to view'));
      console.log();
    }
    
    return Promise.resolve();
  },

  help() {
    console.log(colorizer.header('AI Module Help'));
    console.log(colorizer.separator());
    
    console.log(colorizer.section('Setup & Configuration'));
    console.log(colorizer.cyan('  ai-setup <provider> <key>'));
    console.log(colorizer.dim('    Configure an AI provider (anthropic, openai, google)'));
    console.log(colorizer.dim('    Example: ai-setup openai sk-your-key-here'));
    console.log();
    console.log(colorizer.cyan('  ai-provider <name>'));
    console.log(colorizer.dim('    Switch between configured providers'));
    console.log(colorizer.dim('    Example: ai-provider google'));
    console.log();
    
    console.log(colorizer.section('Code Analysis'));
    console.log(colorizer.cyan('  ai-analyze <file-path>'));
    console.log(colorizer.dim('    Perform security analysis on a code file'));
    console.log(colorizer.dim('    Example: ai-analyze ./src/auth.js'));
    console.log();
    console.log(colorizer.cyan('  ai-batch <directory> [extension]'));
    console.log(colorizer.dim('    Analyze multiple files in a directory'));
    console.log(colorizer.dim('    Example: ai-batch ./src .js'));
    console.log();
    console.log(colorizer.cyan('  ai-compare <file1> <file2>'));
    console.log(colorizer.dim('    Compare security between two code versions'));
    console.log(colorizer.dim('    Example: ai-compare old.js new.js'));
    console.log();
    
    console.log(colorizer.section('Security Intelligence'));
    console.log(colorizer.cyan('  ai-threat <description>'));
    console.log(colorizer.dim('    Get comprehensive threat assessment'));
    console.log(colorizer.dim('    Example: ai-threat SQL injection vulnerability'));
    console.log();
    console.log(colorizer.cyan('  ai-explain <vulnerability>'));
    console.log(colorizer.dim('    Get detailed explanation of security concepts'));
    console.log(colorizer.dim('    Example: ai-explain CWE-79'));
    console.log();
    
    console.log(colorizer.section('Code Generation'));
    console.log(colorizer.cyan('  ai-generate <description>'));
    console.log(colorizer.dim('    Generate secure Node.js code'));
    console.log(colorizer.dim('    Example: ai-generate JWT authentication middleware'));
    console.log();
    
    console.log(colorizer.section('Project Improvement'));
    console.log(colorizer.cyan('  ai-improve [project-path]'));
    console.log(colorizer.dim('    Get security recommendations for your project'));
    console.log(colorizer.dim('    Example: ai-improve ./my-app'));
    console.log();
    
    console.log(colorizer.section('Interactive Chat'));
    console.log(colorizer.cyan('  ai-chat [query]'));
    console.log(colorizer.dim('    Chat with AI assistant'));
    console.log(colorizer.dim('    • With query: Single question mode'));
    console.log(colorizer.dim('    • Without query: Interactive conversation mode'));
    console.log(colorizer.dim('    Example: ai-chat How to prevent XSS attacks?'));
    console.log();
    console.log(colorizer.dim('  Chat Commands (interactive mode):'));
    console.log(colorizer.dim('    /exit, /quit - Exit chat'));
    console.log(colorizer.dim('    /clear - Clear conversation history'));
    console.log(colorizer.dim('    /history - Show conversation'));
    console.log(colorizer.dim('    /save <file> - Save conversation'));
    console.log(colorizer.dim('    /stream - Toggle streaming (Gemini)'));
    console.log();
    
    console.log(colorizer.section('Tips'));
    console.log(colorizer.dim('  • Set AI_PROVIDER env variable to auto-select provider'));
    console.log(colorizer.dim('  • Use environment variables for API keys'));
    console.log(colorizer.dim('  • Google Gemini supports streaming responses'));
    console.log(colorizer.dim('  • Chat maintains context for follow-up questions'));
    console.log(colorizer.dim('  • Batch analysis works on entire directories'));
    console.log();
    
    return Promise.resolve();
  },

  // Quick access to commonly used features
  quickScan(filePath) {
    console.log(colorizer.info('Quick Security Scan'));
    return this.analyzeCode([filePath]);
  },

  quickChat(query) {
    if (!query) {
      console.log(colorizer.error('Please provide a query for quick chat\n'));
      return Promise.resolve();
    }
    return this.chat([query]);
  }
};

module.exports = AiAnalyzer;