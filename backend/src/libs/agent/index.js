// agent.js - Enhanced with separate chat sessions and background services
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const colorizer = require('./modules/utils/colorizer');

const SecurityAgent = function () {
  this.modules = {};
  this.commands = {};
  this.commandHistory = [];
  this.historyIndex = 0;
  this.maxHistory = 100;
  this.backgroundServices = new Map();
  this.serviceStatus = new Map();

  // Module definitions with metadata
  this.definitions = [
    // Security
    { name: 'scanner', file: './modules/security/scanner', displayName: 'Security Scanner' },
    { name: 'webScraper', file: './modules/security/web', displayName: 'Web Scraper' },
    { name: 'vulnAssessment', file: './modules/security/vulnerability', displayName: 'Vuln Assessment' },
    { name: 'trafficMonitor', file: './modules/security/monitor', displayName: 'Traffic Monitor' },
    { name: 'cveDatabase', file: './modules/security/cve', displayName: 'CVE Database' },
    // AI
    { name: 'aiAnalyzer', file: './modules/ai/ai', displayName: 'AI Analyzer' },
    { name: 'aiChat', file: './modules/ai/chat', displayName: 'AI Chat Session' },
    { name: 'codeAnalyzer', file: './modules/code/analyzer', displayName: 'Code Analyzer' },
    // Analysis
    { name: 'googleDorks', file: './modules/analyze/dorks', displayName: 'Google Dorks' },
    { name: 'apiTester', file: './modules/analyze/api', displayName: 'API Tester' },
    // Coding
    { name: 'codeRefactor', file: './modules/code/refactor', displayName: 'Code Refactor' },
    { name: 'htmlToReact', file: './modules/code/react', displayName: 'HTML to React' },
    { name: 'JQueryToReact', file: './modules/code/jquery', displayName: 'jQuery to React' },
    // CC / Bin validation
    { name: 'cardValidator', file: './modules/ccard/validator', displayName: 'Card Validator' },
    { name: 'cardStatusChecker', file: './modules/ccard/checker', displayName: 'Card Payment Checker' },
    { name: 'cryptoChecker', file: './modules/crypto/exchange', displayName: 'Crypto Exchange' },
    // Utils Services
    { name: 'fileBrowser', file: './modules/utils/browser', displayName: 'File Browser' },
    { name: 'proxyManager', file: './modules/network/proxy', displayName: 'Proxy Manager' },
    { name: 'serviceManager', file: './modules/utils/manager', displayName: 'Service Manager' }
  ];

  // Command to module mappings
  this.mappings = {
    // File browser commands
    'ls': { module: 'fileBrowser', method: 'list', description: 'List files and directories' },
    'cd': { module: 'fileBrowser', method: 'cd', description: 'Change directory' },
    'pwd': { module: 'fileBrowser', method: 'pwd', description: 'Show current directory' },
    'cat': { module: 'fileBrowser', method: 'cat', description: 'Display file contents' },
    'less': { module: 'fileBrowser', method: 'less', description: 'View file (paginated)' },
    'find': { module: 'fileBrowser', method: 'find', description: 'Search for files' },
    'file-info': { module: 'fileBrowser', method: 'info', description: 'Show file information' },
    'tree': { module: 'fileBrowser', method: 'tree', description: 'Display directory tree' },
    'bookmark': { module: 'fileBrowser', method: 'bookmark', description: 'Manage bookmarks' },
    'browse-help': { module: 'fileBrowser', method: 'showHelp', description: 'File browser help' },

    // Scanner commands
    'scan-ports': { module: 'scanner', method: 'scanPorts', description: 'Scan network ports' },
    'check-deps': { module: 'scanner', method: 'checkDependencies', description: 'Check dependencies' },
    'network-info': { module: 'scanner', method: 'getNetworkInfo', description: 'Show network info' },
    'security-audit': { module: 'scanner', method: 'securityAudit', description: 'Run security audit' },

    // Code analyzer commands
    'analyze-code': { module: 'codeAnalyzer', method: 'analyzeCode', description: 'Analyze code file' },
    'analyze-project': { module: 'codeAnalyzer', method: 'analyzeProject', description: 'Analyze project' },

    // Traffic monitor commands
    'monitor-traffic': { module: 'trafficMonitor', method: 'startMonitoring', description: 'Start traffic monitoring' },
    'stop-monitor': { module: 'trafficMonitor', method: 'stopMonitoring', description: 'Stop monitoring' },
    'traffic-stats': { module: 'trafficMonitor', method: 'showStats', description: 'Show traffic stats' },
    'export-traffic': { module: 'trafficMonitor', method: 'exportData', description: 'Export traffic data' },

    // AI analyzer commands - EXPANDED
    'ai-setup': { module: 'aiAnalyzer', method: 'setup', description: 'Configure AI provider' },
    'ai-provider': { module: 'aiAnalyzer', method: 'setProvider', description: 'Switch AI provider' },
    'ai-status': { module: 'aiAnalyzer', method: 'status', description: 'Show AI module status' },
    'ai-help': { module: 'aiAnalyzer', method: 'help', description: 'Show AI commands help' },
    'ai-analyze': { module: 'aiAnalyzer', method: 'analyzeCode', description: 'AI security analysis' },
    'ai-batch': { module: 'aiAnalyzer', method: 'analyzeBatch', description: 'Batch analyze files' },
    'ai-compare': { module: 'aiAnalyzer', method: 'compareCodeVersions', description: 'Compare code versions' },
    'ai-threat': { module: 'aiAnalyzer', method: 'threatAssessment', description: 'Threat assessment' },
    'ai-explain': { module: 'aiAnalyzer', method: 'explainVulnerability', description: 'Explain vulnerability' },
    'ai-generate': { module: 'aiAnalyzer', method: 'generateNodeCode', description: 'Generate Node.js code' },
    'ai-improve': { module: 'aiAnalyzer', method: 'suggestImprovements', description: 'Security recommendations' },
    'ai-scan': { module: 'aiAnalyzer', method: 'quickScan', description: 'Quick security scan' },
    'ai-ask': { module: 'aiAnalyzer', method: 'quickChat', description: 'Quick AI question' },

    // AI Chat Session commands (separate from main AI)
    'chat': { module: 'aiChat', method: 'startSession', description: 'Start interactive chat session' },
    'chat-quick': { module: 'aiChat', method: 'quickQuery', description: 'Quick chat query' },
    'chat-history': { module: 'aiChat', method: 'showHistory', description: 'Show chat history' },
    'chat-save': { module: 'aiChat', method: 'saveSession', description: 'Save chat session' },
    'chat-load': { module: 'aiChat', method: 'loadSession', description: 'Load chat session' },
    'chat-clear': { module: 'aiChat', method: 'clearHistory', description: 'Clear chat history' },
    'chat-export': { module: 'aiChat', method: 'exportChat', description: 'Export chat to file' },

    // Background Services commands
    'service-start': { module: 'serviceManager', method: 'startService', description: 'Start background service' },
    'service-stop': { module: 'serviceManager', method: 'stopService', description: 'Stop background service' },
    'service-status': { module: 'serviceManager', method: 'serviceStatus', description: 'Show service status' },
    'service-list': { module: 'serviceManager', method: 'listServices', description: 'List all services' },
    'service-logs': { module: 'serviceManager', method: 'showLogs', description: 'Show service logs' },
    'service-restart': { module: 'serviceManager', method: 'restartService', description: 'Restart service' },

    // CVE database commands
    'search-cve': { module: 'cveDatabase', method: 'searchCVE', description: 'Search CVE database' },
    'check-cwe': { module: 'cveDatabase', method: 'checkCWE', description: 'Check CWE details' },
    'check-package': { module: 'cveDatabase', method: 'checkPackage', description: 'Check package vulnerabilities' },
    'check-exploits': { module: 'cveDatabase', method: 'checkExploits', description: 'Search exploits' },
    'scan-deps': { module: 'cveDatabase', method: 'scanDependencies', description: 'Scan dependencies for CVEs' },
    'export-cve': { module: 'cveDatabase', method: 'exportCVEReport', description: 'Export CVE report' },

    // API tester commands
    'test-endpoint': { module: 'apiTester', method: 'testEndpoint', description: 'Test API endpoint' },
    'test-collection': { module: 'apiTester', method: 'testCollection', description: 'Test API collection' },
    'export-report': { module: 'apiTester', method: 'exportReport', description: 'Export test report' },

    // Code refactor commands
    'refactor-file': { module: 'codeRefactor', method: 'refactorFile', description: 'Refactor JavaScript file' },
    'refactor-project': { module: 'codeRefactor', method: 'refactorProject', description: 'Refactor project' },
    'analyze-refactor': { module: 'codeRefactor', method: 'analyzeCode', description: 'Analyze for refactoring' },
    'compare-refactor': { module: 'codeRefactor', method: 'compareVersions', description: 'Compare versions' },
    // Web scraper commands
    'scrape': { module: 'webScraper', method: 'scrape', description: 'Scrape webpage' },
    'scrape-links': { module: 'webScraper', method: 'scrapeLinks', description: 'Extract links' },
    'scrape-images': { module: 'webScraper', method: 'scrapeImages', description: 'Extract images' },
    'export-scrape': { module: 'webScraper', method: 'exportScrape', description: 'Export scraped data' },
    'analyze-headers': { module: 'webScraper', method: 'analyzeSecurityHeaders', description: 'Analyze security headers' },
    // Vulnerability assessment commands
    'vuln-assess': { module: 'vulnAssessment', method: 'assess', description: 'Run vulnerability assessment' },
    'export-vuln': { module: 'vulnAssessment', method: 'exportResults', description: 'Export vulnerability results' },
    // Proxy Manager commands
    'check-ip': { module: 'proxyManager', method: 'checkPublicIp', description: 'Check current public IP' },
    'configure-proxifly': { module: 'proxyManager', method: 'configureProxifly', description: 'Configure Proxifly API' },
    'configure-proxy5': { module: 'proxyManager', method: 'configureProxy5', description: 'Configure Proxy5 credentials' },
    'fetch-proxies': { module: 'proxyManager', method: 'fetchProxies', description: 'Fetch proxies from Proxifly' },
    'add-proxy5': { module: 'proxyManager', method: 'addProxy5Proxies', description: 'Add Proxy5 proxies' },
    'list-proxies': { module: 'proxyManager', method: 'displayProxyList', description: 'List available proxies' },
    'select-proxy': { module: 'proxyManager', method: 'selectProxy', description: 'Select and activate proxy' },
    'test-proxy': { module: 'proxyManager', method: 'testProxy', description: 'Test current proxy' },
    'clear-proxy': { module: 'proxyManager', method: 'clearProxy', description: 'Clear active proxy' },
    'proxy-status': { module: 'proxyManager', method: 'showStatus', description: 'Show proxy status' },
    'proxy-help': { module: 'proxyManager', method: 'showHelp', description: 'Proxy manager help' },
    // HTML to React commands
    'html-to-react': { module: 'htmlToReact', method: 'convert', description: 'Convert HTML to React' },
    'batch-convert': { module: 'htmlToReact', method: 'convertBatch', description: 'Batch convert HTML files' },
    'analyze-html': { module: 'htmlToReact', method: 'analyzeHTML', description: 'Analyze HTML structure' },

    // jQuery to React commands
    'jquery-to-react': { module: 'JQueryToReact', method: 'convert', description: 'Convert jQuery to React' },
    'jq-batch-convert': { module: 'JQueryToReact', method: 'convertBatch', description: 'Batch convert jQuery files' },
    'analyze-jquery': { module: 'JQueryToReact', method: 'analyzeBatch', description: 'Analyze jQuery structure' },

    // CC and BIN validation
    'validate-card': { module: 'cardValidator', method: 'validateCard', description: 'Validate card number format' },
    'validate-batch': { module: 'cardValidator', method: 'validateBatch', description: 'Batch validate cards' },
    'analyze-bin': { module: 'cardValidator', method: 'analyzeBIN', description: 'Analyze BIN number' },
    'show-test-cards': { module: 'cardValidator', method: 'showTestCards', description: 'Show official test cards' },
    'explain-algorithm': { module: 'cardValidator', method: 'explainAlgorithm', description: 'Explain validation algorithms' },
    'card-security-report': { module: 'cardValidator', method: 'securityReport', description: 'Generate security report' },

    'check-card-status': { module: 'cardStatusChecker', method: 'checkCardStatus', description: 'Check single card' },
    'check-card-batch': { module: 'cardStatusChecker', method: 'checkCardBatch', description: 'Check card batch' },
    'configure-card-checker': { module: 'cardStatusChecker', method: 'configure', description: 'Configure card checker' },
    'card-checker-help': { module: 'cardStatusChecker', method: 'showHelp', description: 'Show help menu' },

    'compare-rates': { module: 'cryptoChecker', method: 'compareRates', description: 'Compare crypto rates' },
    'crypto-price': { module: 'cryptoChecker', method: 'getPrice', description: 'Get cryptocurrency price' },
    'track-portfolio': { module: 'cryptoChecker', method: 'trackPortfolio', description: 'Track cryptos' },
    'crypto-convert': { module: 'cryptoChecker', method: 'convert', description: 'Convert cryptocurrencies' },
    'market-summary': { module: 'cryptoChecker', method: 'marketSummary', description: 'Market summary' },
    'export-rates': { module: 'cryptoChecker', method: 'exportRates', description: 'Export rates' },
    'crypto-help': { module: 'cryptoChecker', method: 'showHelp', description: 'Crypto help' },

    // Google Dorks commands
    'list-dorks': { module: 'googleDorks', method: 'listDorks', description: 'List dork templates' },
    'generate-dork': { module: 'googleDorks', method: 'generateDork', description: 'Generate dorks' },
    'custom-dork': { module: 'googleDorks', method: 'customDork', description: 'Create custom dork' },
    'dork-categories': { module: 'googleDorks', method: 'showCategories', description: 'Show categories' },
    'save-dorks': { module: 'googleDorks', method: 'saveDorks', description: 'Save dorks' },
    'load-custom-dorks': { module: 'googleDorks', method: 'loadCustomDorks', description: 'Load custom dorks' },
    'advanced-dorks': { module: 'googleDorks', method: 'generateAdvancedDorks', description: 'Advanced dorks' },
    'dork-help': { module: 'googleDorks', method: 'showHelp', description: 'Dorks help' },
  };

  this.loadModules();
  this.registerCommands();

  this.logo = `
                                        
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@   
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  
@@!       @@!       @@!  @@@  @@!  @@@  
!@!       !@!       !@!  @!@  !@!  @!@  
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!   
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!    
!!:       !!:       !!:  !!!  !!: :!!   
:!:       :!:       :!:  !:!  :!:  !:!  
 ::        :: ::::  ::   :::  ::   :::  
 :        : :: ::    :   : :   :   : :                                                                                                                                                          
`;

}

SecurityAgent.prototype = {

  loadModules() {
    console.log(colorizer.dim('Loading modules...'));

    this.definitions.forEach(moduleDef => {
      try {
        const ModuleClass = require(moduleDef.file);
        this.modules[moduleDef.name] = new ModuleClass(this);
        console.log(colorizer.dim('  [OK] ' + moduleDef.displayName));
      } catch (err) {
        console.log(colorizer.warning('  [SKIP] ' + moduleDef.displayName + ' - ' + err.message));
      }
    });

    console.log();
  },

  registerCommands() {
    Object.entries(this.mappings).forEach(([cmd, config]) => {
      const module = this.modules[config.module];
      if (module && typeof module[config.method] === 'function') {
        this.commands[cmd] = args => module[config.method](args);
      }
    });

    // Add built-in commands
    this.commands['help'] = () => this.showHelp();
    this.commands['status'] = () => this.showStatus();
    this.commands['history'] = () => this.showHistory();
    this.commands['clear'] = () => this.clearScreen();
    this.commands['banner'] = () => this.showBanner();
    this.commands['version'] = () => this.showVersion();
    this.commands['tips'] = () => this.showTips();
    this.commands['exit'] = () => this.exit();
  },

  start() {
    this.showBanner();
    this.showStatus();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.getPrompt(),
      completer: line => this.autocomplete(line)
    });

    rl.prompt();

    rl.on('line', input => {
      const trimmed = input.trim();

      if (trimmed) {
        this.addToHistory(trimmed);
        this.executeCommand(trimmed)
          .then(() => rl.prompt())
          .catch(() => rl.prompt());
      } else {
        rl.prompt();
      }
    });

    rl.on('close', () => {
      this.exit();
    });

    return Promise.resolve();
  },

  showBanner() {
    const banner = [
      '=============================================================',
      '║                                                           ║',
      '║           SECURITY AI AGENT v2.4                          ║',
      '║           Advanced Security Testing Framework             ║',
      '║                                                           ║',
      '=============================================================',
    ];

    console.log(colorizer.header(this.logo));
    console.log(colorizer.bright(colorizer.cyan(banner.join('\n'))));
    console.log();
  },

  showStatus() {
    console.log(colorizer.section('System Status'));

    this.definitions.forEach(moduleDef => {
      const module = this.modules[moduleDef.name];
      const status = module ? colorizer.green('[READY]') : colorizer.red('[UNAVAILABLE]');

      // Special status for AI modules
      if (moduleDef.name === 'aiAnalyzer' && module) {
        const configured = module.isConfigured && module.isConfigured();
        const provider = module.getProviderName && module.getProviderName();
        const aiStatus = configured ?
          colorizer.green('[READY - ' + provider + ']') :
          colorizer.yellow('[NOT CONFIGURED]');
        console.log(colorizer.cyan('  ' + moduleDef.displayName.padEnd(20)) + aiStatus);
      } else if (moduleDef.name === 'aiChat' && module) {
        const configured = module.isConfigured && module.isConfigured();
        const chatStatus = configured ?
          colorizer.green('[READY]') :
          colorizer.yellow('[NOT CONFIGURED]');
        console.log(colorizer.cyan('  ' + moduleDef.displayName.padEnd(20)) + chatStatus);
      } else {
        console.log(colorizer.cyan('  ' + moduleDef.displayName.padEnd(20)) + status);
      }
    });

    // Show background services status
    if (this.backgroundServices.size > 0) {
      console.log();
      console.log(colorizer.section('Background Services'));
      this.backgroundServices.forEach((service, name) => {
        const status = this.serviceStatus.get(name);
        const statusText = status === 'running' ?
          colorizer.green('[RUNNING]') :
          colorizer.dim('[STOPPED]');
        console.log(colorizer.cyan('  ' + name.padEnd(20)) + statusText);
      });
    }

    console.log();
    console.log(colorizer.magenta('Type "help" for commands, "chat" for AI chat, "exit" to quit'));
    console.log();
  },

  getPrompt() {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    let prompt = colorizer.bright(colorizer.cyan('[' + timestamp + '] '));

    if (this.modules.fileBrowser && this.modules.fileBrowser.currentPath) {
      const cwd = path.basename(this.modules.fileBrowser.currentPath);
      prompt += colorizer.dim('(' + cwd + ') ');
    }

    // Show active services count
    const activeServices = Array.from(this.serviceStatus.values())
      .filter(status => status === 'running').length;
    if (activeServices > 0) {
      prompt += colorizer.yellow(`[${activeServices} services] `);
    }

    prompt += colorizer.bright(colorizer.green('FEAR >> '));
    return prompt;
  },

  executeCommand(input) {
    const [cmd, ...args] = input.split(' ');

    if (this.commands[cmd]) {
      return Promise.resolve()
        .then(() => this.commands[cmd](args))
        .catch(err => {
          console.log(colorizer.error(err.message));
          if (err.stack && process.env.DEBUG) {
            console.log(colorizer.dim(err.stack));
          }
        });
    } else {
      console.log(colorizer.error('Unknown command: ' + cmd));
      console.log(colorizer.info('Type "help" for available commands'));
      return Promise.resolve();
    }
  },

  autocomplete(line) {
    const completions = Object.keys(this.commands);
    const hits = completions.filter(c => c.startsWith(line));
    return [hits.length ? hits : completions, line];
  },

  addToHistory(cmd) {
    this.commandHistory.push(cmd);
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }
  },

  showHistory() {
    console.log(colorizer.section('Command History'));

    if (this.commandHistory.length === 0) {
      console.log(colorizer.dim('  No commands in history'));
    } else {
      const recent = this.commandHistory.slice(-20);
      recent.forEach((cmd, i) => {
        const num = this.commandHistory.length - recent.length + i + 1;
        console.log(colorizer.numbered(num, cmd));
      });
    }
    console.log();
    return Promise.resolve();
  },

  showVersion() {
    console.log(colorizer.section('Version Information'));
    console.log(colorizer.cyan('  Agent Version: ') + colorizer.bright('2.4.0'));
    console.log(colorizer.cyan('  Node Version: ') + colorizer.bright(process.version));
    console.log(colorizer.cyan('  Platform: ') + colorizer.bright(process.platform));
    console.log(colorizer.cyan('  Architecture: ') + colorizer.bright(process.arch));

    const moduleCount = Object.keys(this.modules).length;
    const commandCount = Object.keys(this.commands).length;

    console.log(colorizer.cyan('  Loaded Modules: ') + colorizer.bright(moduleCount));
    console.log(colorizer.cyan('  Available Commands: ') + colorizer.bright(commandCount));
    console.log();
    return Promise.resolve();
  },

  clearScreen() {
    console.clear();
    process.stdout.write('\x1Bc');
  },

  showHelp() {
    console.log(colorizer.box('Security AI Agent - Command Reference'));

    const categories = {
      'File Browser': [
        'ls', 'cd', 'pwd', 'cat', 'less', 'find', 'file-info', 'tree', 'bookmark', 'browse-help'
      ],
      'AI Analysis (Main)': [
        'ai-setup', 'ai-provider', 'ai-status', 'ai-help', 'ai-analyze', 'ai-batch',
        'ai-compare', 'ai-threat', 'ai-explain', 'ai-generate', 'ai-improve', 'ai-scan', 'ai-ask'
      ],
      'AI Chat (Separate Session)': [
        'chat', 'chat-quick', 'chat-history', 'chat-save', 'chat-load', 'chat-clear', 'chat-export'
      ],
      'Background Services': [
        'service-start', 'service-stop', 'service-status', 'service-list', 'service-logs', 'service-restart'
      ],
      'Network Scanning': [
        'scan-ports', 'network-info', 'check-deps', 'security-audit'
      ],
      'Code Analysis': [
        'analyze-code', 'analyze-project'
      ],
      'Traffic Monitoring': [
        'monitor-traffic', 'stop-monitor', 'traffic-stats', 'export-traffic'
      ],
      'CVE & Security': [
        'search-cve', 'check-cwe', 'check-package', 'check-exploits', 'scan-deps', 'export-cve'
      ],
      'Proxy Management': [
        'check-ip', 'configure-proxifly', 'configure-proxy5', 'fetch-proxies',
        'add-proxy5', 'list-proxies', 'select-proxy', 'test-proxy', 'clear-proxy',
        'proxy-status', 'proxy-help'
      ],
      'System': [
        'help', 'status', 'history', 'banner', 'version', 'tips', 'clear', 'exit'
      ]
    };

    Object.entries(categories).forEach(([category, commands]) => {
      console.log(colorizer.section(category.toUpperCase()));
      commands.forEach(cmd => {
        const config = this.mappings[cmd];
        const desc = config ? config.description : 'Show ' + cmd.replace('-', ' ');
        console.log(colorizer.bullet(cmd.padEnd(25) + ' - ' + colorizer.dim(desc)));
      });
      console.log();
    });

    console.log(colorizer.info('Quick Start:'));
    console.log(colorizer.dim('  • Run "chat" to start AI conversation (separate from analysis)'));
    console.log(colorizer.dim('  • Run "service-list" to see available background services'));
    console.log(colorizer.dim('  • Run "ai-setup" to configure AI analysis tools'));
    console.log();

    return Promise.resolve();
  },

  showTips() {
    console.log(colorizer.section('💡 Tips & Tricks'));
    console.log();

    console.log(colorizer.cyan('New Features:'));
    console.log(colorizer.dim('  • Separate AI Chat: Use "chat" for conversational AI'));
    console.log(colorizer.dim('  • Background Services: Run tasks in the background'));
    console.log(colorizer.dim('  • Service Management: Start/stop/monitor services'));
    console.log();

    console.log(colorizer.cyan('Chat vs AI Commands:'));
    console.log(colorizer.dim('  • "chat" - Conversational AI with context retention'));
    console.log(colorizer.dim('  • "ai-analyze" - Security-focused code analysis'));
    console.log(colorizer.dim('  • "ai-ask" - Quick single questions'));
    console.log();

    console.log(colorizer.cyan('Background Services:'));
    console.log(colorizer.dim('  • Auto-monitoring: Continuous security scanning'));
    console.log(colorizer.dim('  • Scheduled tasks: Run operations on schedule'));
    console.log(colorizer.dim('  • Log aggregation: Collect and analyze logs'));
    console.log();

    return Promise.resolve();
  },

  // Background service management
  registerService(name, service) {
    this.backgroundServices.set(name, service);
    this.serviceStatus.set(name, 'stopped');
  },

  startService(name) {
    const service = this.backgroundServices.get(name);
    if (service && service.start) {
      service.start();
      this.serviceStatus.set(name, 'running');
      return true;
    }
    return false;
  },

  stopService(name) {
    const service = this.backgroundServices.get(name);
    if (service && service.stop) {
      service.stop();
      this.serviceStatus.set(name, 'stopped');
      return true;
    }
    return false;
  },

  exit() {
    console.log(colorizer.cyan('\nShutting down...'));

    // Stop all background services
    this.backgroundServices.forEach((service, name) => {
      if (this.serviceStatus.get(name) === 'running') {
        console.log(colorizer.dim(`  Stopping ${name}...`));
        this.stopService(name);
      }
    });

    // Cleanup modules
    if (this.modules.trafficMonitor && this.modules.trafficMonitor.stopMonitoring) {
      this.modules.trafficMonitor.stopMonitoring();
    }

    console.log(colorizer.bright(colorizer.cyan('Goodbye!\n')));
    process.exit(0);
  }
};

module.exports = SecurityAgent;