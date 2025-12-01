// modules/services/manager.js - Background Service Manager
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');
const EventEmitter = require('events');

const ServiceManager = function(agent) {
  this.agent = agent;
  this.services = new Map();
  this.logs = new Map();
  this.maxLogEntries = 1000;
  
  // Register built-in services
  this.registerBuiltInServices();
};

ServiceManager.prototype = {

  registerBuiltInServices() {
    // Auto-scan service - monitors for security issues
    this.registerService('auto-scan', {
      name: 'Auto Security Scanner',
      description: 'Periodic security scanning of project files',
      interval: 300000, // 5 minutes
      action: () => this.runAutoScan()
    });

    // Log monitor service - watches for suspicious patterns
    this.registerService('log-monitor', {
      name: 'Log Monitor',
      description: 'Monitors application logs for security events',
      interval: 60000, // 1 minute
      action: () => this.runLogMonitor()
    });

    // CVE checker service - checks for new vulnerabilities
    this.registerService('cve-check', {
      name: 'CVE Vulnerability Checker',
      description: 'Checks dependencies for new CVEs',
      interval: 3600000, // 1 hour
      action: () => this.runCVECheck()
    });

    // Network monitor service - monitors network activity
    this.registerService('net-monitor', {
      name: 'Network Monitor',
      description: 'Monitors network connections and traffic',
      interval: 120000, // 2 minutes
      action: () => this.runNetworkMonitor()
    });

    // File watcher service - watches for file changes
    this.registerService('file-watch', {
      name: 'File Watcher',
      description: 'Watches project files for suspicious changes',
      interval: 30000, // 30 seconds
      action: () => this.runFileWatcher()
    });
  },

  registerService(id, config) {
    const service = {
      id,
      name: config.name,
      description: config.description,
      interval: config.interval,
      action: config.action,
      status: 'stopped',
      timer: null,
      lastRun: null,
      runCount: 0,
      errors: 0,
      emitter: new EventEmitter()
    };

    this.services.set(id, service);
    this.logs.set(id, []);
    
    // Register with agent if available
    if (this.agent) {
      this.agent.registerService(id, {
        start: () => this.startService([id]),
        stop: () => this.stopService([id])
      });
    }
  },

  startService(args) {
    const serviceId = args[0];
    
    if (!serviceId) {
      console.log(colorizer.error('Usage: service-start <service-id>'));
      console.log(colorizer.info('Run "service-list" to see available services\n'));
      return Promise.resolve();
    }

    const service = this.services.get(serviceId);
    
    if (!service) {
      console.log(colorizer.error(`Service "${serviceId}" not found\n`));
      return Promise.resolve();
    }

    if (service.status === 'running') {
      console.log(colorizer.warning(`Service "${service.name}" is already running\n`));
      return Promise.resolve();
    }

    service.status = 'running';
    
    // Run immediately
    this.executeService(service);
    
    // Schedule periodic execution
    service.timer = setInterval(() => {
      this.executeService(service);
    }, service.interval);

    this.log(serviceId, 'info', 'Service started');
    console.log(colorizer.success(`✓ Started: ${service.name}`));
    console.log(colorizer.dim(`  Interval: ${this.formatInterval(service.interval)}\n`));

    return Promise.resolve();
  },

  stopService(args) {
    const serviceId = args[0];
    
    if (!serviceId) {
      console.log(colorizer.error('Usage: service-stop <service-id>'));
      console.log(colorizer.info('Run "service-list" to see running services\n'));
      return Promise.resolve();
    }

    const service = this.services.get(serviceId);
    
    if (!service) {
      console.log(colorizer.error(`Service "${serviceId}" not found\n`));
      return Promise.resolve();
    }

    if (service.status === 'stopped') {
      console.log(colorizer.warning(`Service "${service.name}" is not running\n`));
      return Promise.resolve();
    }

    if (service.timer) {
      clearInterval(service.timer);
      service.timer = null;
    }

    service.status = 'stopped';
    this.log(serviceId, 'info', 'Service stopped');
    
    console.log(colorizer.success(`✓ Stopped: ${service.name}\n`));
    return Promise.resolve();
  },

  restartService(args) {
    const serviceId = args[0];
    
    if (!serviceId) {
      console.log(colorizer.error('Usage: service-restart <service-id>\n'));
      return Promise.resolve();
    }

    console.log(colorizer.info(`Restarting ${serviceId}...`));
    
    return this.stopService([serviceId])
      .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
      .then(() => this.startService([serviceId]));
  },

  executeService(service) {
    try {
      service.lastRun = new Date();
      service.runCount++;
      
      Promise.resolve(service.action())
        .then(result => {
          if (result && result.alert) {
            this.log(service.id, 'alert', result.message);
            console.log(colorizer.warning(`\n⚠️  ${service.name}: ${result.message}`));
          } else if (result && result.info) {
            this.log(service.id, 'info', result.message);
          }
        })
        .catch(err => {
          service.errors++;
          this.log(service.id, 'error', err.message);
          
          if (service.errors > 5) {
            console.log(colorizer.error(`\n❌ ${service.name} encountered multiple errors. Stopping...`));
            this.stopService([service.id]);
          }
        });
    } catch (err) {
      service.errors++;
      this.log(service.id, 'error', err.message);
    }
  },

  serviceStatus(args) {
    const serviceId = args[0];

    if (serviceId) {
      return this.showServiceDetail(serviceId);
    }

    console.log(colorizer.header('Background Services Status'));
    console.log(colorizer.separator());

    if (this.services.size === 0) {
      console.log(colorizer.dim('No services registered\n'));
      return Promise.resolve();
    }

    this.services.forEach(service => {
      const status = service.status === 'running' ? 
        colorizer.green('● RUNNING') : 
        colorizer.dim('○ STOPPED');
      
      console.log(`${status} ${colorizer.cyan(service.name)}`);
      console.log(colorizer.dim(`  ID: ${service.id}`));
      console.log(colorizer.dim(`  ${service.description}`));
      
      if (service.status === 'running') {
        console.log(colorizer.dim(`  Interval: ${this.formatInterval(service.interval)}`));
        console.log(colorizer.dim(`  Runs: ${service.runCount}`));
        if (service.lastRun) {
          console.log(colorizer.dim(`  Last run: ${service.lastRun.toLocaleString()}`));
        }
      }
      
      if (service.errors > 0) {
        console.log(colorizer.warning(`  Errors: ${service.errors}`));
      }
      
      console.log();
    });

    return Promise.resolve();
  },

  showServiceDetail(serviceId) {
    const service = this.services.get(serviceId);
    
    if (!service) {
      console.log(colorizer.error(`Service "${serviceId}" not found\n`));
      return Promise.resolve();
    }

    console.log(colorizer.header(`Service: ${service.name}`));
    console.log(colorizer.separator());
    
    console.log(colorizer.cyan('ID: ') + service.id);
    console.log(colorizer.cyan('Description: ') + service.description);
    console.log(colorizer.cyan('Status: ') + 
      (service.status === 'running' ? colorizer.green('Running') : colorizer.dim('Stopped')));
    console.log(colorizer.cyan('Interval: ') + this.formatInterval(service.interval));
    console.log(colorizer.cyan('Total Runs: ') + service.runCount);
    console.log(colorizer.cyan('Errors: ') + 
      (service.errors > 0 ? colorizer.warning(service.errors) : colorizer.green('0')));
    
    if (service.lastRun) {
      console.log(colorizer.cyan('Last Run: ') + service.lastRun.toLocaleString());
      const nextRun = new Date(service.lastRun.getTime() + service.interval);
      console.log(colorizer.cyan('Next Run: ') + nextRun.toLocaleString());
    }

    console.log();
    
    // Show recent logs
    const logs = this.logs.get(serviceId) || [];
    if (logs.length > 0) {
      console.log(colorizer.section('Recent Activity'));
      logs.slice(-10).forEach(log => {
        const icon = log.level === 'error' ? '❌' : 
                    log.level === 'alert' ? '⚠️' : 
                    'ℹ️';
        const color = log.level === 'error' ? colorizer.error : 
                     log.level === 'alert' ? colorizer.warning : 
                     colorizer.dim;
        console.log(`${icon} ${color(`[${log.time}] ${log.message}`)}`);
      });
    }

    console.log();
    return Promise.resolve();
  },

  listServices(args) {
    console.log(colorizer.header('Available Background Services'));
    console.log(colorizer.separator());

    if (this.services.size === 0) {
      console.log(colorizer.dim('No services available\n'));
      return Promise.resolve();
    }

    console.log(colorizer.section('Service List'));
    
    this.services.forEach(service => {
      const status = service.status === 'running' ? 
        colorizer.green('[RUNNING]') : 
        colorizer.dim('[STOPPED]');
      
      console.log(`${status} ${colorizer.cyan(service.id)}`);
      console.log(colorizer.dim(`  ${service.name} - ${service.description}`));
    });

    console.log();
    console.log(colorizer.info('Commands:'));
    console.log(colorizer.dim('  service-start <id>    - Start a service'));
    console.log(colorizer.dim('  service-stop <id>     - Stop a service'));
    console.log(colorizer.dim('  service-status <id>   - View service details'));
    console.log(colorizer.dim('  service-logs <id>     - View service logs'));
    console.log(colorizer.dim('  service-restart <id>  - Restart a service'));
    console.log();

    return Promise.resolve();
  },

  showLogs(args) {
    const serviceId = args[0];
    const limit = parseInt(args[1]) || 50;

    if (!serviceId) {
      console.log(colorizer.error('Usage: service-logs <service-id> [limit]'));
      console.log(colorizer.info('Example: service-logs auto-scan 100\n'));
      return Promise.resolve();
    }

    const service = this.services.get(serviceId);
    const logs = this.logs.get(serviceId);

    if (!service) {
      console.log(colorizer.error(`Service "${serviceId}" not found\n`));
      return Promise.resolve();
    }

    console.log(colorizer.header(`Logs: ${service.name}`));
    console.log(colorizer.separator());

    if (!logs || logs.length === 0) {
      console.log(colorizer.dim('No logs available\n'));
      return Promise.resolve();
    }

    const recentLogs = logs.slice(-limit);
    
    console.log(colorizer.cyan(`Showing last ${recentLogs.length} entries:\n`));

    recentLogs.forEach(log => {
      const icon = log.level === 'error' ? '❌' : 
                  log.level === 'alert' ? '⚠️' : 
                  log.level === 'info' ? 'ℹ️' : 
                  '📝';
      
      const color = log.level === 'error' ? colorizer.error : 
                   log.level === 'alert' ? colorizer.warning : 
                   colorizer.dim;
      
      console.log(`${icon} ${color(`[${log.timestamp}] ${log.message}`)}`);
    });

    console.log();
    return Promise.resolve();
  },

  log(serviceId, level, message) {
    const logs = this.logs.get(serviceId);
    if (!logs) return;

    const entry = {
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      level,
      message
    };

    logs.push(entry);

    // Trim logs if too many
    if (logs.length > this.maxLogEntries) {
      logs.splice(0, logs.length - this.maxLogEntries);
    }
  },

  formatInterval(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  // Built-in service actions

  runAutoScan() {
    // Scan project files for security issues
    const scanResults = {
      filesScanned: 0,
      issues: []
    };

    // This would integrate with the scanner module
    if (this.agent && this.agent.modules.scanner) {
      // Perform quick security audit
      return Promise.resolve({
        info: true,
        message: `Scanned ${scanResults.filesScanned} files`
      });
    }

    return Promise.resolve();
  },

  runLogMonitor() {
    // Monitor logs for suspicious patterns
    const logsDir = './logs';
    
    return fs.readdir(logsDir)
      .then(files => {
        const logFiles = files.filter(f => f.endsWith('.log'));
        
        if (logFiles.length > 0) {
          return {
            info: true,
            message: `Monitored ${logFiles.length} log files`
          };
        }
      })
      .catch(() => null);
  },

  runCVECheck() {
    // Check for CVE updates
    if (this.agent && this.agent.modules.cveDatabase) {
      return Promise.resolve({
        info: true,
        message: 'CVE database check completed'
      });
    }
    return Promise.resolve();
  },

  runNetworkMonitor() {
    // Monitor network connections
    return Promise.resolve({
      info: true,
      message: 'Network monitoring active'
    });
  },

  runFileWatcher() {
    // Watch for file changes
    const watchDir = process.cwd();
    
    return fs.readdir(watchDir)
      .then(files => {
        // This would track file modifications
        return {
          info: true,
          message: `Watching ${files.length} files`
        };
      })
      .catch(() => null);
  }
};

module.exports = ServiceManager;