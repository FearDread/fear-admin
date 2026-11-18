'use strict';

/**
 * Static registry for the agent loader (index.js): which modules exist and which command maps to which
 * module method. Data only, nothing is required or run here.
 */

const definitions = [
    // Security
    { name: 'scanner', file: './modules/security/scanner', displayName: 'Security Scanner' },
    { name: 'webScraper', file: './modules/security/web', displayName: 'Web Scraper' },
    { name: 'vulnAssessment', file: './modules/security/vulnerability', displayName: 'Vuln Assessment' },
    { name: 'trafficMonitor', file: './modules/security/monitor', displayName: 'Traffic Monitor' },
    { name: 'cveDatabase', file: './modules/security/cve', displayName: 'CVE Database' },
    // AI
    { name: 'aiAnalyzer', file: './modules/ai/ai', displayName: 'AI Analyzer' },
    { name: 'aiChat', file: './modules/ai/chat', displayName: 'AI Chat (Ollama)' },
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
    { name: 'proxyManager', file: './modules/net/proxy', displayName: 'Proxy Manager' },
    { name: 'serviceManager', file: './modules/utils/manager', displayName: 'Service Manager' }
];

const mappings = {
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
    'chat-status': { module: 'aiChat', method: 'status', description: 'Show chat model (Ollama) status' },
    'chat-model': { module: 'aiChat', method: 'setModel', description: 'Show or switch the installed Ollama chat model' },

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

module.exports = { definitions, mappings };