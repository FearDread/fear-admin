const fs = require('fs');
const path = require('path');
const https = require('https');
const colorizer = require('../utils/colorizer');

/**
 * Google Dorks Module
 * Generates and manages Google dork queries for security reconnaissance
 */
const GoogleDorks = function() {
    const ensureOutputDir = () => {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
    this.outputDir = path.join(process.cwd(), 'dork-results');
    ensureOutputDir();
    
    // Predefined dork templates by category
    this.dorkTemplates = {
      'sensitive-files': [
        'intitle:"index of" "password.txt"',
        'intitle:"index of" "config.php"',
        'intitle:"index of" ".env"',
        'intitle:"index of" "backup.sql"',
        'filetype:sql "password" site:',
        'filetype:log inurl:"access.log"',
        'filetype:bak inurl:"backup"',
        'ext:xml intext:"password"'
      ],
      'login-pages': [
        'intitle:"login" site:',
        'inurl:admin intitle:"login"',
        'inurl:wp-admin site:',
        'intitle:"Dashboard" inurl:admin',
        'inurl:"/phpmyadmin" intitle:"phpMyAdmin"',
        'intitle:"Admin Login" OR intitle:"Administrator Login"'
      ],
      'exposed-databases': [
        'intitle:"phpMyAdmin" "Welcome to phpMyAdmin"',
        'inurl:"/db/main.php" "phpMyAdmin"',
        'intitle:"index of" "database.sql"',
        'filetype:sql inurl:backup',
        'ext:sql intext:INSERT INTO',
        'inurl:mongoadmin'
      ],
      'vulnerable-servers': [
        'intitle:"Apache Status" "Apache Server Status for"',
        'intitle:"Directory Listing For" inurl:logs',
        'intitle:"Index of" .bash_history',
        'intitle:"index of" "server-status"',
        'inurl:"/server-status" intitle:"Apache Status"'
      ],
      'api-keys': [
        'filetype:env "API_KEY"',
        'filetype:log "api_key"',
        'filetype:json "api_key"',
        '"Authorization: Bearer" filetype:log',
        'site:github.com "API_KEY" OR "API_SECRET"',
        'filetype:yml "api_key" OR "apikey"'
      ],
      'cloud-storage': [
        'site:s3.amazonaws.com intitle:"index of"',
        'site:blob.core.windows.net intitle:"index of"',
        'site:storage.googleapis.com intitle:"index of"',
        'inurl:s3.amazonaws.com "Bucket Listing"',
        'site:s3.amazonaws.com filetype:xls OR filetype:csv'
      ],
      'error-messages': [
        'intitle:"error" "sql syntax"',
        'intext:"Warning: mysql_" site:',
        'intext:"Uncaught exception" site:',
        'intitle:"500 Internal Server Error"',
        'intitle:"Exception Details" site:'
      ],
      'credentials': [
        'filetype:xls inurl:"password"',
        'filetype:csv inurl:"username" inurl:"password"',
        'intext:"username" filetype:log',
        'ext:txt intext:"userid" intext:"password"',
        'filetype:config inurl:web.config intext:connectionString'
      ],
      'webcams': [
        'inurl:"/view/view.shtml"',
        'intitle:"Live View / - AXIS"',
        'inurl:"/axis-cgi/mjpg"',
        'intitle:"EvoCam" inurl:"webcam.html"',
        'inurl:"viewerframe?mode="'
      ],
      'vulnerable-apps': [
        'inurl:wp-content/uploads/ filetype:pdf',
        'inurl:"/jmx-console/" intitle:"JMX Management Console"',
        'intitle:"Jenkins" "Dashboard"',
        'intitle:"Grafana" inurl:"/login"',
        'intitle:"Kibana" inurl:"/app/kibana"'
      ]
    };
}

GoogleDorks.prototype = {
  /**
   * Show help and available commands
   */
  showHelp() {
    console.log(colorizer.section('Google Dorks Module - Help'));
    console.log();
    
    console.log(colorizer.cyan('Available Commands:'));
    console.log(colorizer.bullet('list-dorks [category]       - List available dork templates'));
    console.log(colorizer.bullet('generate-dork <target>      - Generate dorks for a target domain'));
    console.log(colorizer.bullet('custom-dork <query>         - Create custom dork query'));
    console.log(colorizer.bullet('dork-categories             - Show all dork categories'));
    console.log(colorizer.bullet('save-dorks <file>           - Save generated dorks to file'));
    console.log(colorizer.bullet('load-custom-dorks <file>    - Load custom dorks from file'));
    console.log(colorizer.bullet('dork-help                   - Show this help'));
    console.log();
    
    console.log(colorizer.cyan('Categories:'));
    Object.keys(this.dorkTemplates).forEach(cat => {
      console.log(colorizer.dim(`  • ${cat} (${this.dorkTemplates[cat].length} dorks)`));
    });
    console.log();
    
    console.log(colorizer.info('Examples:'));
    console.log(colorizer.dim('  list-dorks sensitive-files'));
    console.log(colorizer.dim('  generate-dork example.com'));
    console.log(colorizer.dim('  custom-dork site:example.com filetype:pdf'));
    console.log();
    
    console.log(colorizer.warning('Legal Notice:'));
    console.log(colorizer.dim('  Only use these dorks on systems you own or have explicit'));
    console.log(colorizer.dim('  permission to test. Unauthorized access is illegal.'));
    console.log();
  },

  /**
   * List available dork categories
   */
  showCategories() {
    console.log(colorizer.section('Available Dork Categories'));
    console.log();
    
    Object.entries(this.dorkTemplates).forEach(([category, dorks]) => {
      console.log(colorizer.cyan(`${category.toUpperCase()}`));
      console.log(colorizer.dim(`  ${dorks.length} dork templates available`));
      console.log(colorizer.dim(`  Use: list-dorks ${category}`));
      console.log();
    });
  },

  /**
   * List dorks by category
   */
  listDorks(args) {
    const category = args[0];
    
    if (!category) {
      console.log(colorizer.section('All Available Dorks'));
      console.log();
      
      Object.entries(this.dorkTemplates).forEach(([cat, dorks]) => {
        console.log(colorizer.cyan(`${cat.toUpperCase()} (${dorks.length} dorks)`));
        dorks.forEach((dork, i) => {
          console.log(colorizer.numbered(i + 1, dork));
        });
        console.log();
      });
      return;
    }
    
    if (!this.dorkTemplates[category]) {
      console.log(colorizer.error(`Category "${category}" not found`));
      console.log(colorizer.info('Available categories:'));
      Object.keys(this.dorkTemplates).forEach(cat => {
        console.log(colorizer.dim(`  • ${cat}`));
      });
      return;
    }
    
    console.log(colorizer.section(`Dorks: ${category.toUpperCase()}`));
    console.log();
    
    this.dorkTemplates[category].forEach((dork, i) => {
      console.log(colorizer.numbered(i + 1, dork));
    });
    console.log();
  },

  /**
   * Generate dorks for a specific target
   */
  generateDork(args) {
    const target = args[0];
    
    if (!target) {
      console.log(colorizer.error('Please provide a target domain'));
      console.log(colorizer.info('Usage: generate-dork example.com'));
      return;
    }
    
    console.log(colorizer.section(`Generated Dorks for: ${target}`));
    console.log();
    
    const results = {};
    
    Object.entries(this.dorkTemplates).forEach(([category, dorks]) => {
      results[category] = dorks.map(template => {
        // Add site: operator to templates that support it
        if (template.includes('site:') && !template.match(/site:\S+/)) {
          return template.replace('site:', `site:${target}`);
        } else if (!template.includes('site:')) {
          return `${template} site:${target}`;
        }
        return template;
      });
    });
    
    // Display results
    Object.entries(results).forEach(([category, dorks]) => {
      console.log(colorizer.cyan(`${category.toUpperCase()}`));
      dorks.forEach((dork, i) => {
        console.log(colorizer.numbered(i + 1, dork));
        console.log(colorizer.dim(`https://www.google.com/search?q=${encodeURIComponent(dork)}`));
      });
      console.log();
    });
    
    // Save to file
    const filename = `dorks_${target.replace(/\./g, '_')}_${Date.now()}.txt`;
    const filepath = path.join(this.outputDir, filename);
    
    const content = Object.entries(results)
      .map(([cat, dorks]) => {
        return `# ${cat.toUpperCase()}\n${dorks.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
      })
      .join('\n\n');
    
    fs.writeFileSync(filepath, content);
    console.log(colorizer.success(`Dorks saved to: ${filepath}`));
    console.log();
  },

  /**
   * Create custom dork query
   */
  customDork(args) {
    if (args.length === 0) {
      console.log(colorizer.error('Please provide a dork query'));
      console.log();
      console.log(colorizer.cyan('Google Dork Operators:'));
      console.log(colorizer.bullet('site:        - Limit to specific domain'));
      console.log(colorizer.bullet('filetype:    - Search specific file types'));
      console.log(colorizer.bullet('intitle:     - Search in page title'));
      console.log(colorizer.bullet('inurl:       - Search in URL'));
      console.log(colorizer.bullet('intext:      - Search in page text'));
      console.log(colorizer.bullet('ext:         - File extension'));
      console.log(colorizer.bullet('cache:       - Show cached version'));
      console.log(colorizer.bullet('link:        - Pages linking to URL'));
      console.log(colorizer.bullet('related:     - Similar pages'));
      console.log();
      console.log(colorizer.info('Example: custom-dork site:example.com filetype:pdf confidential'));
      return;
    }
    
    const query = args.join(' ');
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
    
    console.log(colorizer.section('Custom Dork Query'));
    console.log();
    console.log(colorizer.cyan('Query: ') + colorizer.bright(query));
    console.log(colorizer.cyan('URL:   ') + colorizer.dim(searchUrl));
    console.log();
    
    // Save to history
    const historyFile = path.join(this.outputDir, 'dork_history.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(historyFile, `[${timestamp}] ${query}\n`);
    
    console.log(colorizer.success(`✓ Query saved to history`));
    console.log();
  },

  /**
   * Save dorks to file
   */
  saveDorks(args) {
    const filename = args[0] || `dorks_${Date.now()}.txt`;
    const filepath = path.join(this.outputDir, filename);
    
    const content = Object.entries(this.dorkTemplates)
      .map(([category, dorks]) => {
        return `# ${category.toUpperCase()}\n${dorks.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
      })
      .join('\n\n');
    
    fs.writeFileSync(filepath, content);
    
    console.log(colorizer.success(`✓ Dorks saved to: ${filepath}`));
    console.log(colorizer.info(`Total dorks: ${Object.values(this.dorkTemplates).flat().length}`));
    console.log();
  },

  /**
   * Load custom dorks from file
   */
  loadCustomDorks(args) {
    const filename = args[0];
    
    if (!filename) {
      console.log(colorizer.error('Please provide a filename'));
      console.log(colorizer.info('Usage: load-custom-dorks mydorks.txt'));
      return;
    }
    
    const filepath = fs.existsSync(filename) ? filename : path.join(this.outputDir, filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(colorizer.error(`File not found: ${filepath}`));
      return;
    }
    
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      if (lines.length === 0) {
        console.log(colorizer.warning('No valid dorks found in file'));
        return;
      }
      
      // Add to custom category
      if (!this.dorkTemplates['custom']) {
        this.dorkTemplates['custom'] = [];
      }
      
      this.dorkTemplates['custom'] = [
        ...this.dorkTemplates['custom'],
        ...lines.map(l => l.replace(/^\d+\.\s*/, '').trim())
      ];
      
      console.log(colorizer.success(`✓ Loaded ${lines.length} custom dorks`));
      console.log(colorizer.info('Use: list-dorks custom'));
      console.log();
      
    } catch (err) {
      console.log(colorizer.error(`Failed to load dorks: ${err.message}`));
    }
  },
  /**
   * Generate advanced dorks with combinations
   */
  generateAdvancedDorks(args) {
    const target = args[0];
    
    if (!target) {
      console.log(colorizer.error('Please provide a target domain'));
      return;
    }
    
    console.log(colorizer.section(`Advanced Dorks for: ${target}`));
    console.log();
    
    // Advanced combination dorks
    const advanced = [
      `site:${target} (ext:xml OR ext:conf OR ext:cnf OR ext:reg OR ext:inf OR ext:rdp OR ext:cfg OR ext:txt OR ext:ora OR ext:ini)`,
      `site:${target} intext:"sql syntax near" OR intext:"syntax error has occurred" OR intext:"incorrect syntax near"`,
      `site:${target} intext:"Warning: mysql_connect()" OR intext:"Warning: mysql_query()"`,
      `site:${target} (inurl:backup OR inurl:old OR inurl:bak OR inurl:copy)`,
      `site:${target} (intitle:"index of" OR intitle:"directory listing") (password OR passwords OR passwd)`,
      `site:${target} filetype:log intext:"password" OR intext:"username"`,
      `site:${target} inurl:admin OR inurl:administrator OR inurl:login OR inurl:wp-admin`,
      `site:${target} (inurl:phpinfo.php OR inurl:info.php OR inurl:test.php)`,
      `site:${target} ext:sql (intext:"insert into" OR intext:"create table")`,
      `site:${target} (filetype:env OR filetype:yml) (intext:"api_key" OR intext:"password")`
    ];
    
    console.log(colorizer.cyan('ADVANCED COMBINATION DORKS'));
    advanced.forEach((dork, i) => {
      console.log(colorizer.numbered(i + 1, dork));
      console.log(colorizer.dim(`   → https://www.google.com/search?q=${encodeURIComponent(dork)}`));
    });
    console.log();
    
    // Save
    const filename = `advanced_dorks_${target.replace(/\./g, '_')}_${Date.now()}.txt`;
    const filepath = path.join(this.outputDir, filename);
    fs.writeFileSync(filepath, advanced.join('\n'));
    
    console.log(colorizer.success(`Advanced dorks saved to: ${filepath}`));
    console.log();
  }
}

module.exports = GoogleDorks;