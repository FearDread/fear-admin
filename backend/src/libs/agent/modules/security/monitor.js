// modules/traffic-monitor.js - Real-time Network Traffic Monitor
const { spawn } = require('child_process');
const fs = require('fs').promises;
const os = require('os');

class Monitor {
  constructor() {
    this.monitoring = false;
    this.tcpdumpProcess = null;
    this.stats = {
      startTime: null,
      packets: {
        total: 0,
        tcp: 0,
        udp: 0,
        icmp: 0,
        other: 0
      },
      protocols: {
        http: 0,
        https: 0,
        dns: 0,
        ssh: 0,
        ftp: 0
      },
      traffic: {
        incoming: 0,
        outgoing: 0,
        totalBytes: 0
      },
      suspicious: [],
      connections: new Map()
    };
  }

  async startMonitoring(args) {
    if (this.monitoring) {
      console.log('⚠️  Traffic monitoring is already running. Use "stop-monitor" first.\n');
      return;
    }

    const iface = args[0] || this.getDefaultInterface();
    
    console.log(`\n������ Starting Traffic Monitor`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Interface: ${iface}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log(`\nMonitoring... (Press Ctrl+C or use "stop-monitor" to stop)\n`);
    
    this.monitoring = true;
    this.stats.startTime = Date.now();
    
    // Check if we have tcpdump or use fallback
    const hasTcpdump = await this.checkCommand('tcpdump');
    
    if (hasTcpdump) {
      this.startTcpdumpMonitor(iface);
    } else {
      console.log('⚠️  tcpdump not found. Using fallback monitoring...\n');
      this.startFallbackMonitor();
    }
  }

  async checkCommand(cmd) {
    return new Promise((resolve) => {
      const proc = spawn('which', [cmd]);
      proc.on('close', (code) => resolve(code === 0));
    });
  }

  startTcpdumpMonitor(iface) {
    // tcpdump -i interface -n -l
    // Note: May require sudo privileges
    this.tcpdumpProcess = spawn('tcpdump', [
      '-i', iface,
      '-n',  // Don't resolve hostnames
      '-l',  // Line buffered
      '-tttt' // Human readable timestamps
    ]);

    this.tcpdumpProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => this.parsePacket(line));
    });

    this.tcpdumpProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Permission denied')) {
        console.log('❌ Permission denied. Try running with sudo.\n');
        this.stopMonitoring();
      } else if (!msg.includes('listening on')) {
        console.error(`⚠️  ${msg}`);
      }
    });

    this.tcpdumpProcess.on('close', () => {
      this.monitoring = false;
    });
  }

  startFallbackMonitor() {
    // Fallback: Monitor using netstat
    this.monitorInterval = setInterval(() => {
      this.sampleNetworkActivity();
    }, 2000);
  }

  async sampleNetworkActivity() {
    const proc = spawn('netstat', ['-an']);
    let output = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', () => {
      const lines = output.split('\n');
      let established = 0;
      
      lines.forEach(line => {
        if (line.includes('ESTABLISHED')) {
          established++;
          this.stats.packets.total++;
          
          // Basic protocol detection
          if (line.includes(':80 ') || line.includes(':8080 ')) {
            this.stats.protocols.http++;
          } else if (line.includes(':443 ') || line.includes(':8443 ')) {
            this.stats.protocols.https++;
          } else if (line.includes(':22 ')) {
            this.stats.protocols.ssh++;
          } else if (line.includes(':53 ')) {
            this.stats.protocols.dns++;
          }
        }
      });

      if (established > 0) {
        console.log(`������ Active connections: ${established}`);
      }
    });
  }

  parsePacket(line) {
    if (!line.trim()) return;

    this.stats.packets.total++;

    // Parse protocol
    if (line.includes('TCP') || line.includes('tcp')) {
      this.stats.packets.tcp++;
    } else if (line.includes('UDP') || line.includes('udp')) {
      this.stats.packets.udp++;
    } else if (line.includes('ICMP') || line.includes('icmp')) {
      this.stats.packets.icmp++;
    } else {
      this.stats.packets.other++;
    }

    // Parse ports for protocol detection
    if (line.match(/\.80\s|\.80:/)) {
      this.stats.protocols.http++;
    } else if (line.match(/\.443\s|\.443:/)) {
      this.stats.protocols.https++;
    } else if (line.match(/\.53\s|\.53:/)) {
      this.stats.protocols.dns++;
    } else if (line.match(/\.22\s|\.22:/)) {
      this.stats.protocols.ssh++;
    } else if (line.match(/\.21\s|\.21:/)) {
      this.stats.protocols.ftp++;
    }

    // Detect suspicious patterns
    this.detectSuspicious(line);

    // Display packet (rate limited)
    if (this.stats.packets.total % 50 === 0) {
      this.displayLiveStats();
    }
  }

  detectSuspicious(line) {
    const suspicious = [];

    // Port scanning detection (many connections from same IP)
    const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (ipMatch) {
      const ip = ipMatch[1];
      const count = this.stats.connections.get(ip) || 0;
      this.stats.connections.set(ip, count + 1);

      if (count > 100) {
        suspicious.push({
          type: 'Port Scan',
          detail: `Multiple connections from ${ip}`,
          timestamp: new Date()
        });
      }
    }

    // Unusual ports
    if (line.match(/\.(666|1337|31337|4444|5555)\s/)) {
      suspicious.push({
        type: 'Suspicious Port',
        detail: 'Connection to uncommon port',
        timestamp: new Date()
      });
    }

    // FTP (unencrypted)
    if (line.includes('.21 ') || line.includes(':21 ')) {
      suspicious.push({
        type: 'Unencrypted Protocol',
        detail: 'FTP traffic detected (consider SFTP)',
        timestamp: new Date()
      });
    }

    // Telnet (unencrypted)
    if (line.includes('.23 ') || line.includes(':23 ')) {
      suspicious.push({
        type: 'Unencrypted Protocol',
        detail: 'Telnet traffic detected (use SSH)',
        timestamp: new Date()
      });
    }

    if (suspicious.length > 0) {
      suspicious.forEach(s => {
        this.stats.suspicious.push(s);
        console.log(`������ ${s.type}: ${s.detail}`);
      });
    }
  }

  displayLiveStats() {
    console.log(`\n������ Live Stats (${this.stats.packets.total} packets)`);
    console.log(`  TCP: ${this.stats.packets.tcp} | UDP: ${this.stats.packets.udp} | ICMP: ${this.stats.packets.icmp}`);
    console.log(`  HTTP: ${this.stats.protocols.http} | HTTPS: ${this.stats.protocols.https} | DNS: ${this.stats.protocols.dns}`);
  }

  stopMonitoring() {
    if (!this.monitoring) {
      console.log('ℹ️  Traffic monitoring is not running.\n');
      return;
    }

    if (this.tcpdumpProcess) {
      this.tcpdumpProcess.kill();
      this.tcpdumpProcess = null;
    }

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    this.monitoring = false;
    console.log('\n✅ Traffic monitoring stopped.\n');
  }

  showStats() {
    if (!this.stats.startTime) {
      console.log('ℹ️  No monitoring data available. Start monitoring first.\n');
      return;
    }

    const duration = Math.floor((Date.now() - this.stats.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    console.log(`\n������ Traffic Statistics`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Duration: ${minutes}m ${seconds}s`);
    console.log(`Status: ${this.monitoring ? '������ Active' : '������ Stopped'}\n`);

    console.log(`Packets:`);
    console.log(`  Total: ${this.stats.packets.total}`);
    console.log(`  TCP: ${this.stats.packets.tcp} (${this.getPercentage(this.stats.packets.tcp, this.stats.packets.total)}%)`);
    console.log(`  UDP: ${this.stats.packets.udp} (${this.getPercentage(this.stats.packets.udp, this.stats.packets.total)}%)`);
    console.log(`  ICMP: ${this.stats.packets.icmp} (${this.getPercentage(this.stats.packets.icmp, this.stats.packets.total)}%)`);
    console.log(`  Other: ${this.stats.packets.other}\n`);

    console.log(`Protocols:`);
    console.log(`  HTTP: ${this.stats.protocols.http}`);
    console.log(`  HTTPS: ${this.stats.protocols.https}`);
    console.log(`  DNS: ${this.stats.protocols.dns}`);
    console.log(`  SSH: ${this.stats.protocols.ssh}`);
    console.log(`  FTP: ${this.stats.protocols.ftp}\n`);

    if (this.stats.suspicious.length > 0) {
      console.log(`������ Suspicious Activity (${this.stats.suspicious.length} events):`);
      const recent = this.stats.suspicious.slice(-10);
      recent.forEach(s => {
        console.log(`  [${s.timestamp.toLocaleTimeString()}] ${s.type}: ${s.detail}`);
      });
      console.log();
    }

    // Top talkers
    if (this.stats.connections.size > 0) {
      console.log(`Top Connections:`);
      const sorted = Array.from(this.stats.connections.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      sorted.forEach(([ip, count]) => {
        console.log(`  ${ip}: ${count} packets`);
      });
      console.log();
    }
  }

  getPercentage(value, total) {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  }

  async exportData(args) {
    const filename = args[0] || `traffic-export-${Date.now()}.json`;

    const exportData = {
      exportTime: new Date().toISOString(),
      monitoringDuration: this.stats.startTime ? Date.now() - this.stats.startTime : 0,
      statistics: {
        packets: this.stats.packets,
        protocols: this.stats.protocols,
        traffic: this.stats.traffic
      },
      suspicious: this.stats.suspicious,
      topConnections: Array.from(this.stats.connections.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([ip, count]) => ({ ip, packetCount: count }))
    };

    try {
      await fs.writeFile(filename, JSON.stringify(exportData, null, 2));
      console.log(`\n✅ Traffic data exported to: ${filename}\n`);
    } catch (err) {
      console.log(`❌ Export failed: ${err.message}\n`);
    }
  }

  getDefaultInterface() {
    const platform = os.platform();
    
    if (platform === 'darwin') {
      return 'en0';
    } else if (platform === 'linux') {
      return 'eth0';
    } else if (platform === 'win32') {
      return 'Ethernet';
    }
    
    return 'any';
  }
}

module.exports = Monitor;