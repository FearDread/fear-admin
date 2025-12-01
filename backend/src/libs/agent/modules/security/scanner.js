// modules/scanner.js - Network and Security Scanner
const net = require('net');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const Scanner = function() {
    this.commonPorts = {
      20: 'FTP Data',
      21: 'FTP Control',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      445: 'SMB',
      3306: 'MySQL',
      3389: 'RDP',
      5432: 'PostgreSQL',
      6379: 'Redis',
      8080: 'HTTP Alt',
      8443: 'HTTPS Alt',
      27017: 'MongoDB'
    };
}

Scanner.prototype = {

  async scanPorts(args) {
    const host = args[0] || '127.0.0.1';
    const startPort = parseInt(args[1]) || 1;
    const endPort = parseInt(args[2]) || 1024;
    
    console.log(`\n������ Port Scan Report`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Target: ${host}`);
    console.log(`Range: ${startPort}-${endPort}`);
    console.log(`Started: ${new Date().toLocaleString()}\n`);
    
    const startTime = Date.now();
    const openPorts = [];
    const promises = [];
    let scanned = 0;
    const total = endPort - startPort + 1;
    
    for (let port = startPort; port <= endPort; port++) {
      promises.push(
        this.checkPort(host, port)
          .then(isOpen => {
            scanned++;
            if (isOpen) {
              const service = this.commonPorts[port] || 'Unknown';
              openPorts.push({ port, service });
              console.log(`✅ Port ${port} OPEN - ${service}`);
            }
            // Progress indicator
            if (scanned % 100 === 0) {
              process.stdout.write(`\r⏳ Progress: ${scanned}/${total} ports scanned...`);
            }
          })
          .catch(() => {})
      );
      
      // Limit concurrent connections
      if (promises.length >= 100) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }
    
    await Promise.all(promises);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n\n������ Scan Summary`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Total ports scanned: ${total}`);
    console.log(`Open ports: ${openPorts.length}`);
    console.log(`Duration: ${duration}s`);
    
    if (openPorts.length > 0) {
      console.log(`\n⚠️  Security Notes:`);
      openPorts.forEach(({ port, service }) => {
        if ([21, 23, 445, 3389].includes(port)) {
          console.log(`  ������ Port ${port} (${service}) - Consider closing if unused`);
        }
      });
    }
    console.log();
  },

  checkPort(host, port, timeout = 1000) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.setTimeout(timeout);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.connect(port, host);
    });
  },

  async checkDependencies(args) {
    const dir = args[0] || '.';
    const pkgPath = path.join(dir, 'package.json');
    
    try {
      const data = await fs.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(data);
      
      console.log('\n������ Dependency Analysis');
      console.log(`═══════════════════════════════════════`);
      console.log(`Project: ${pkg.name || 'Unknown'}`);
      console.log(`Version: ${pkg.version || 'Unknown'}`);
      console.log(`License: ${pkg.license || 'Not specified'}\n`);
      
      const deps = pkg.dependencies || {};
      const devDeps = pkg.devDependencies || {};
      
      if (Object.keys(deps).length > 0) {
        console.log('������ Production Dependencies:');
        Object.entries(deps).forEach(([name, ver]) => {
          console.log(`  • ${name}: ${ver}`);
        });
        console.log();
      }
      
      if (Object.keys(devDeps).length > 0) {
        console.log('������ Dev Dependencies:');
        Object.entries(devDeps).forEach(([name, ver]) => {
          console.log(`  • ${name}: ${ver}`);
        });
        console.log();
      }
      
      console.log('Recommendations:');
      console.log('  • Run "npm audit" for vulnerability scan');
      console.log('  • Run "npm outdated" to check for updates');
      console.log('  • Consider using "npm audit fix" for auto-fixes\n');
      
    } catch (err) {
      console.log(`❌ Could not read package.json: ${err.message}\n`);
    }
  },

  async getNetworkInfo() {
    const interfaces = os.networkInterfaces();
    
    console.log('\n������ Network Interface Information');
    console.log(`═══════════════════════════════════════`);
    console.log(`Hostname: ${os.hostname()}`);
    console.log(`Platform: ${os.platform()} ${os.arch()}\n`);
    
    Object.entries(interfaces).forEach(([name, addrs]) => {
      console.log(`������ ${name}:`);
      addrs.forEach(addr => {
        const status = addr.internal ? '(Internal)' : '(External)';
        console.log(`  ${addr.family.padEnd(6)} ${addr.address.padEnd(40)} ${status}`);
        if (addr.mac && addr.mac !== '00:00:00:00:00:00') {
          console.log(`  MAC: ${addr.mac}`);
        }
      });
      console.log();
    });
  },

  async securityAudit(args) {
    const dir = args[0] || '.';
    
    console.log('\n������ Security Audit Report');
    console.log(`═══════════════════════════════════════`);
    console.log(`Directory: ${path.resolve(dir)}`);
    console.log(`Date: ${new Date().toLocaleString()}\n`);
    
    const checks = [];
    
    // Check Node.js version
    const nodeVer = process.version;
    const majorVer = parseInt(nodeVer.slice(1).split('.')[0]);
    checks.push({
      category: 'Runtime',
      name: 'Node.js Version',
      status: majorVer >= 18 ? 'PASS' : 'WARN',
      value: nodeVer,
      note: majorVer < 18 ? 'Consider upgrading to LTS version' : null
    });
    
    // Check for security files
    const securityFiles = [
      { file: '.gitignore', critical: true },
      { file: '.env.example', critical: false },
      { file: 'README.md', critical: false },
      { file: 'SECURITY.md', critical: false },
      { file: '.npmrc', critical: false }
    ];
    
    for (const { file, critical } of securityFiles) {
      try {
        await fs.access(path.join(dir, file));
        checks.push({
          category: 'Files',
          name: file,
          status: 'PASS',
          value: 'Present'
        });
      } catch {
        checks.push({
          category: 'Files',
          name: file,
          status: critical ? 'FAIL' : 'INFO',
          value: 'Missing',
          note: critical ? 'Recommended' : 'Optional'
        });
      }
    }
    
    // Check .gitignore for sensitive patterns
    try {
      const gitignore = await fs.readFile(path.join(dir, '.gitignore'), 'utf8');
      const patterns = ['.env', 'node_modules', '*.log', '.DS_Store'];
      
      patterns.forEach(pattern => {
        checks.push({
          category: 'GitIgnore',
          name: pattern,
          status: gitignore.includes(pattern) ? 'PASS' : 'WARN',
          value: gitignore.includes(pattern) ? 'Ignored' : 'Not ignored'
        });
      });
    } catch {
      // Already reported missing .gitignore
    }
    
    // Check for .env file (should exist, but be gitignored)
    try {
      await fs.access(path.join(dir, '.env'));
      checks.push({
        category: 'Environment',
        name: '.env file',
        status: 'INFO',
        value: 'Present',
        note: 'Ensure it\'s in .gitignore'
      });
    } catch {
      checks.push({
        category: 'Environment',
        name: '.env file',
        status: 'INFO',
        value: 'Not found'
      });
    }
    
    // Display results
    const grouped = {};
    checks.forEach(check => {
      if (!grouped[check.category]) grouped[check.category] = [];
      grouped[check.category].push(check);
    });
    
    Object.entries(grouped).forEach(([category, items]) => {
      console.log(`\n${category}:`);
      items.forEach(item => {
        const icon = item.status === 'PASS' ? '✅' : 
                     item.status === 'WARN' ? '⚠️' : 
                     item.status === 'FAIL' ? '❌' : 'ℹ️';
        console.log(`  ${icon} ${item.name}: ${item.value}`);
        if (item.note) {
          console.log(`     └─ ${item.note}`);
        }
      });
    });
    
    console.log('\n\n������ Security Recommendations:');
    console.log('  • Keep Node.js and dependencies updated');
    console.log('  • Use environment variables for secrets');
    console.log('  • Implement HTTPS in production');
    console.log('  • Enable rate limiting on APIs');
    console.log('  • Use security headers (helmet.js)');
    console.log('  • Implement proper input validation');
    console.log('  • Use parameterized queries for databases');
    console.log('  • Enable CORS properly\n');
  },
}

module.exports = Scanner;