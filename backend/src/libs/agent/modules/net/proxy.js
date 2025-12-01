const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const colorizer = require('../utils/colorizer');

const ProxyManager = function() {
  constructor() {
    this.currentProxy = null;
    this.proxyList = [];
    this.proxiflyApiKey = process.env.PROXIFLY_API_KEY || null;
    this.proxy5Credentials = {
      username: process.env.PROXY5_USERNAME || null,
      password: process.env.PROXY5_PASSWORD || null
    };
    this.publicIp = null;
    this.lastChecked = null;
  }
}

ProxyManager.prototype = {
  /**
   * Check current public IP address
   */
  async checkPublicIp(useProxy = false) {
    try {
      console.log(colorizer.section('Checking Public IP Address'));
      
      const config = {};
      
      if (useProxy && this.currentProxy) {
        console.log(colorizer.info(`Using proxy: ${this.currentProxy.host}:${this.currentProxy.port}`));
        const proxyUrl = this.formatProxyUrl(this.currentProxy);
        config.httpsAgent = new HttpsProxyAgent(proxyUrl);
        config.timeout = 10000;
      }

      const response = await axios.get('https://api.ipify.org?format=json', config);
      this.publicIp = response.data.ip;
      this.lastChecked = new Date();

      console.log(colorizer.success(`✓ Public IP: ${this.publicIp}`));
      
      // Get additional IP info
      await this.getIpInfo(this.publicIp, useProxy);
      
      return this.publicIp;
    } catch (error) {
      console.log(colorizer.error(`✗ Failed to check IP: ${error.message}`));
      throw error;
    }
  },

  /**
   * Get detailed IP information
   */
  async getIpInfo(ip, useProxy = false) {
    try {
      const config = {};
      
      if (useProxy && this.currentProxy) {
        const proxyUrl = this.formatProxyUrl(this.currentProxy);
        config.httpsAgent = new HttpsProxyAgent(proxyUrl);
        config.timeout = 10000;
      }

      const response = await axios.get(`http://ip-api.com/json/${ip}`, config);
      const data = response.data;

      if (data.status === 'success') {
        console.log(colorizer.cyan('\nIP Information:'));
        console.log(colorizer.dim(`  Country: ${data.country} (${data.countryCode})`));
        console.log(colorizer.dim(`  Region: ${data.regionName}`));
        console.log(colorizer.dim(`  City: ${data.city}`));
        console.log(colorizer.dim(`  ISP: ${data.isp}`));
        console.log(colorizer.dim(`  Timezone: ${data.timezone}`));
        console.log(colorizer.dim(`  Coordinates: ${data.lat}, ${data.lon}`));
      }
      console.log();
    } catch (error) {
      console.log(colorizer.warning(`Could not fetch IP details: ${error.message}`));
    }
  },

  /**
   * Configure Proxifly API
   */
  async configureProxifly(args) {
    if (!args || args.length === 0) {
      console.log(colorizer.section('Proxifly Configuration'));
      console.log(colorizer.cyan('Usage: configure-proxifly <api_key>'));
      console.log(colorizer.dim('\nExample:'));
      console.log(colorizer.dim('  configure-proxifly your_api_key_here'));
      console.log();
      console.log(colorizer.info('Or set environment variable:'));
      console.log(colorizer.dim('  export PROXIFLY_API_KEY=your_api_key_here'));
      console.log();
      
      if (this.proxiflyApiKey) {
        console.log(colorizer.success('✓ Proxifly is currently configured'));
      } else {
        console.log(colorizer.warning('⚠ Proxifly is not configured'));
      }
      return;
    }

    this.proxiflyApiKey = args[0];
    console.log(colorizer.success('✓ Proxifly API key configured'));
    console.log(colorizer.info('Run "fetch-proxies" to get proxy list'));
    console.log();
  },

  /**
   * Configure Proxy5 credentials
   */
  async configureProxy5(args) {
    if (!args || args.length < 2) {
      console.log(colorizer.section('Proxy5 Configuration'));
      console.log(colorizer.cyan('Usage: configure-proxy5 <username> <password>'));
      console.log(colorizer.dim('\nExample:'));
      console.log(colorizer.dim('  configure-proxy5 myuser mypass'));
      console.log();
      console.log(colorizer.info('Or set environment variables:'));
      console.log(colorizer.dim('  export PROXY5_USERNAME=myuser'));
      console.log(colorizer.dim('  export PROXY5_PASSWORD=mypass'));
      console.log();
      
      if (this.proxy5Credentials.username && this.proxy5Credentials.password) {
        console.log(colorizer.success('✓ Proxy5 credentials are configured'));
      } else {
        console.log(colorizer.warning('⚠ Proxy5 credentials are not configured'));
      }
      return;
    }

    this.proxy5Credentials.username = args[0];
    this.proxy5Credentials.password = args[1];
    console.log(colorizer.success('✓ Proxy5 credentials configured'));
    console.log();
  },

  /**
   * Fetch proxies from Proxifly
   */
  async fetchProxies(args) {
    if (!this.proxiflyApiKey) {
      console.log(colorizer.error('Proxifly API key not configured'));
      console.log(colorizer.info('Run "configure-proxifly <api_key>" first'));
      return;
    }

    try {
      console.log(colorizer.section('Fetching Proxies from Proxifly'));
      
      // Parse options
      const options = {
        protocol: 'http',
        country: null,
        limit: 10
      };

      args.forEach((arg, i) => {
        if (arg === '--protocol' && args[i + 1]) options.protocol = args[i + 1];
        if (arg === '--country' && args[i + 1]) options.country = args[i + 1];
        if (arg === '--limit' && args[i + 1]) options.limit = parseInt(args[i + 1]);
      });

      // Proxifly API endpoint (adjust based on actual API)
      const url = `https://api.proxifly.dev/get-proxies`;
      const params = {
        api_key: this.proxiflyApiKey,
        protocol: options.protocol,
        limit: options.limit
      };

      if (options.country) {
        params.country = options.country;
      }

      console.log(colorizer.info(`Fetching ${options.limit} ${options.protocol} proxies...`));

      const response = await axios.get(url, { params, timeout: 15000 });
      
      if (response.data && response.data.proxies) {
        this.proxyList = response.data.proxies.map(proxy => ({
          host: proxy.ip || proxy.host,
          port: proxy.port,
          protocol: proxy.protocol || options.protocol,
          country: proxy.country,
          speed: proxy.speed,
          anonymity: proxy.anonymity
        }));

        console.log(colorizer.success(`✓ Fetched ${this.proxyList.length} proxies`));
        this.displayProxyList();
      } else {
        console.log(colorizer.warning('No proxies returned from API'));
      }
      
    } catch (error) {
      console.log(colorizer.error(`Failed to fetch proxies: ${error.message}`));
      if (error.response) {
        console.log(colorizer.dim(`Status: ${error.response.status}`));
        console.log(colorizer.dim(`Response: ${JSON.stringify(error.response.data)}`));
      }
    }
    console.log();
  },

  /**
   * Add Proxy5 proxies manually
   */
  async addProxy5Proxies(args) {
    if (!this.proxy5Credentials.username || !this.proxy5Credentials.password) {
      console.log(colorizer.error('Proxy5 credentials not configured'));
      console.log(colorizer.info('Run "configure-proxy5 <username> <password>" first'));
      return;
    }

    console.log(colorizer.section('Adding Proxy5 Proxies'));

    // Common Proxy5 server locations
    const proxy5Servers = [
      { host: 'proxy5.net', port: 8080, country: 'US', location: 'United States' },
      { host: 'proxy5.net', port: 8081, country: 'US', location: 'United States' },
      { host: 'proxy5.net', port: 8082, country: 'UK', location: 'United Kingdom' },
      { host: 'proxy5.net', port: 8083, country: 'DE', location: 'Germany' },
      { host: 'proxy5.net', port: 8084, country: 'FR', location: 'France' },
    ];

    proxy5Servers.forEach(server => {
      this.proxyList.push({
        ...server,
        protocol: 'http',
        username: this.proxy5Credentials.username,
        password: this.proxy5Credentials.password,
        source: 'proxy5'
      });
    });

    console.log(colorizer.success(`✓ Added ${proxy5Servers.length} Proxy5 proxies`));
    this.displayProxyList();
    console.log();
  },

  /**
   * Display current proxy list
   */
  displayProxyList() {
    if (this.proxyList.length === 0) {
      console.log(colorizer.warning('No proxies in list'));
      return;
    }

    console.log(colorizer.cyan('\nAvailable Proxies:'));
    this.proxyList.forEach((proxy, index) => {
      const active = this.currentProxy && 
                     this.currentProxy.host === proxy.host && 
                     this.currentProxy.port === proxy.port;
      
      const marker = active ? colorizer.green('→') : ' ';
      const country = proxy.country ? `[${proxy.country}]` : '';
      const auth = proxy.username ? '[AUTH]' : '';
      const source = proxy.source ? `[${proxy.source.toUpperCase()}]` : '';
      
      console.log(colorizer.dim(
        `  ${marker} ${index + 1}. ${proxy.host}:${proxy.port} ${country} ${auth} ${source}`
      ));
    });
    console.log();
  },

  /**
   * Select and activate a proxy
   */
  async selectProxy(args) {
    if (!args || args.length === 0) {
      console.log(colorizer.section('Select Proxy'));
      console.log(colorizer.cyan('Usage: select-proxy <index>'));
      console.log();
      this.displayProxyList();
      return;
    }

    const index = parseInt(args[0]) - 1;
    
    if (index < 0 || index >= this.proxyList.length) {
      console.log(colorizer.error('Invalid proxy index'));
      this.displayProxyList();
      return;
    }

    this.currentProxy = this.proxyList[index];
    console.log(colorizer.success(`✓ Selected proxy: ${this.currentProxy.host}:${this.currentProxy.port}`));
    
    // Test the proxy
    await this.testProxy();
  },

  /**
   * Test current proxy
   */
  async testProxy(args) {
    if (!this.currentProxy) {
      console.log(colorizer.error('No proxy selected'));
      console.log(colorizer.info('Run "select-proxy <index>" first'));
      return;
    }

    console.log(colorizer.section('Testing Proxy'));
    console.log(colorizer.info(`Testing: ${this.currentProxy.host}:${this.currentProxy.port}`));

    try {
      await this.checkPublicIp(true);
      console.log(colorizer.success('✓ Proxy is working!'));
    } catch (error) {
      console.log(colorizer.error(`✗ Proxy test failed: ${error.message}`));
    }
    console.log();
  },

  /**
   * Clear current proxy (use direct connection)
   */
  clearProxy() {
    if (this.currentProxy) {
      console.log(colorizer.info(`Cleared proxy: ${this.currentProxy.host}:${this.currentProxy.port}`));
      this.currentProxy = null;
      console.log(colorizer.success('✓ Now using direct connection'));
    } else {
      console.log(colorizer.info('No proxy was active'));
    }
    console.log();
  },

  /**
   * Show proxy status
   */
  showStatus() {
    console.log(colorizer.section('Proxy Manager Status'));
    
    console.log(colorizer.cyan('Configuration:'));
    console.log(colorizer.dim(`  Proxifly API: ${this.proxiflyApiKey ? '✓ Configured' : '✗ Not configured'}`));
    console.log(colorizer.dim(`  Proxy5 Auth: ${this.proxy5Credentials.username ? '✓ Configured' : '✗ Not configured'}`));
    console.log();

    console.log(colorizer.cyan('Current Status:'));
    console.log(colorizer.dim(`  Active Proxy: ${this.currentProxy ? `${this.currentProxy.host}:${this.currentProxy.port}` : 'Direct connection'}`));
    console.log(colorizer.dim(`  Proxy List: ${this.proxyList.length} proxies available`));
    console.log(colorizer.dim(`  Last IP Check: ${this.lastChecked ? this.lastChecked.toLocaleString() : 'Never'}`));
    if (this.publicIp) {
      console.log(colorizer.dim(`  Public IP: ${this.publicIp}`));
    }
    console.log();
  },

  /**
   * Format proxy URL for axios agent
   */
  formatProxyUrl(proxy) {
    if (proxy.username && proxy.password) {
      return `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
    }
    return `${proxy.protocol}://${proxy.host}:${proxy.port}`;
  },

  /**
   * Show help
   */
  showHelp() {
    console.log(colorizer.box('Proxy Manager - Command Reference'));

    const commands = [
      { cmd: 'check-ip', desc: 'Check current public IP address' },
      { cmd: 'check-ip --proxy', desc: 'Check IP through active proxy' },
      { cmd: 'configure-proxifly <key>', desc: 'Configure Proxifly API key' },
      { cmd: 'configure-proxy5 <user> <pass>', desc: 'Configure Proxy5 credentials' },
      { cmd: 'fetch-proxies', desc: 'Fetch proxies from Proxifly' },
      { cmd: 'fetch-proxies --limit 20', desc: 'Fetch specific number of proxies' },
      { cmd: 'fetch-proxies --country US', desc: 'Fetch proxies from specific country' },
      { cmd: 'add-proxy5', desc: 'Add Proxy5 proxies to list' },
      { cmd: 'list-proxies', desc: 'Display available proxies' },
      { cmd: 'select-proxy <index>', desc: 'Select and activate a proxy' },
      { cmd: 'test-proxy', desc: 'Test current proxy connection' },
      { cmd: 'clear-proxy', desc: 'Clear proxy (use direct connection)' },
      { cmd: 'proxy-status', desc: 'Show proxy manager status' },
      { cmd: 'proxy-help', desc: 'Show this help message' }
    ];

    commands.forEach(({ cmd, desc }) => {
      console.log(colorizer.bullet(cmd.padEnd(35) + ' - ' + colorizer.dim(desc)));
    });

    console.log();
    console.log(colorizer.info('Environment Variables:'));
    console.log(colorizer.dim('  PROXIFLY_API_KEY    - Auto-configure Proxifly'));
    console.log(colorizer.dim('  PROXY5_USERNAME     - Auto-configure Proxy5 username'));
    console.log(colorizer.dim('  PROXY5_PASSWORD     - Auto-configure Proxy5 password'));
    console.log();

    console.log(colorizer.info('Example Workflow:'));
    console.log(colorizer.dim('  1. check-ip                              # Check current IP'));
    console.log(colorizer.dim('  2. configure-proxifly your_api_key       # Setup Proxifly'));
    console.log(colorizer.dim('  3. fetch-proxies --limit 10              # Get proxy list'));
    console.log(colorizer.dim('  4. select-proxy 1                        # Activate proxy'));
    console.log(colorizer.dim('  5. check-ip --proxy                      # Verify proxy works'));
    console.log(colorizer.dim('  6. clear-proxy                           # Return to direct'));
    console.log();
  }
}


module.exports = ProxyManager; 