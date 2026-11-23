/**
 * Agent module loader.
 *
 *   new SecurityAgent()                  CLI: loads every module in registry.js
 *   new SecurityAgent({ mode: 'api' })   HTTP: loads only the modules behind commands listed in policy.js,
 *                                        and registers only those commands
 *
 * What it gives the controller (controllers/agent.js):
 *   modules / definitions   loaded module instances and the definitions that were selected for this mode
 *   commands / mappings     runnable commands ({ name: args => ... }) and the full command -> module map
 *   ready                   promise that settles once every module's own async setup (e.g. the Ollama probe) is done
 *   backgroundServices / serviceStatus / registerService / startService / stopService / shutdown
 */

const colorizer = require('./modules/utils/colorizer');
const registry = require('./registry');
const cli = require('./cli');

const SecurityAgent = function (options = {}) {
    this.mode = options.mode === 'api' ? 'api' : 'cli';
    //this.policy = this.mode === 'api' ? require('./policy') : null;
    this.policy = null;
    this.modules = {};
    this.failed = {};
    this.commands = {};
    this.mappings = registry.mappings;
    this.definitions = this.selectDefinitions();

    this.commandHistory = [];
    this.maxHistory = 100;
    this.backgroundServices = new Map();
    this.serviceStatus = new Map();

    this.loadModules();
    this.registerCommands();
    this.ready = this.whenReady();
};

SecurityAgent.prototype = {

    /** CLI: everything. API: only the modules some policy-approved command needs. */
    selectDefinitions() {
        if (!this.policy) return registry.definitions.slice();

        const wanted = new Set();
        this.policy.list().forEach((command) => {
            const mapping = this.mappings[command];
            if (mapping) wanted.add(mapping.module);
        });
        return registry.definitions.filter((def) => wanted.has(def.name));
    },

    loadModules() {
        console.log(colorizer.dim(`Loading modules (${this.mode})...`));

        this.definitions.forEach((def) => {
            try {
                const ModuleClass = require(def.file);
                this.modules[def.name] = new ModuleClass(this);
                console.log(colorizer.dim('  [OK] ' + def.displayName));
            } catch (err) {
                this.failed[def.name] = err.message;
                console.log(colorizer.warning('  [SKIP] ' + def.displayName + ' - ' + err.message));
            }
        });

        console.log();
    },

    registerCommands() {
        //const permitted = (command) => !this.policy || this.policy.isAllowed(command);
        
        Object.entries(this.mappings).forEach(([command, config]) => {
            const mod = this.modules[config.module];

            //if (!permitted(command) || !mod || typeof mod[config.method] !== 'function') return;
            if (!mod || typeof mod[config.method] !== 'function') return;
            this.commands[command] = (args) => mod[config.method](args);
        });

        Object.entries(cli.builtins(this)).forEach(([command, run]) => {
            if (this.commands[command]) this.commands[command] = run;

            //if (permitted(command)) this.commands[command] = run;
        });
    },

    /** Modules may expose a `ready` promise for async setup; one failing never blocks the rest. */
    whenReady() {
        const pending = Object.values(this.modules).map((mod) => Promise.resolve(mod && mod.ready).catch(() => null));
        return Promise.all(pending).then(() => true);
    },

    /* ----- CLI ----- */

    start() {
        return cli.start(this);
    },

    executeCommand(input) {
        const [cmd, ...args] = input.split(' ');

        if (!this.commands[cmd]) {
            console.log(colorizer.error('Unknown command: ' + cmd));
            console.log(colorizer.info('Type "help" for available commands'));
            return Promise.resolve();
        }

        return Promise.resolve()
            .then(() => this.commands[cmd](args))
            .catch((err) => {
                console.log(colorizer.error(err.message));
                if (err.stack && process.env.DEBUG) console.log(colorizer.dim(err.stack));
            });
    },

    addToHistory(cmd) {
        this.commandHistory.push(cmd);
        if (this.commandHistory.length > this.maxHistory) this.commandHistory.shift();
    },

    /* ----- background services ----- */

    registerService(name, service) {
        this.backgroundServices.set(name, service);
        this.serviceStatus.set(name, 'stopped');
    },

    startService(name) {
        const service = this.backgroundServices.get(name);
        if (!service || !service.start) return false;
        service.start();
        this.serviceStatus.set(name, 'running');
        return true;
    },

    stopService(name) {
        const service = this.backgroundServices.get(name);
        if (!service || !service.stop) return false;
        service.stop();
        this.serviceStatus.set(name, 'stopped');
        return true;
    },

    /** Stops services and anything long-running a module started. Does not exit the process. */
    shutdown() {
        const stopped = [];

        this.backgroundServices.forEach((service, name) => {
            if (this.serviceStatus.get(name) === 'running') {
                this.stopService(name);
                stopped.push(name);
            }
        });

        const monitor = this.modules.trafficMonitor;
        if (monitor && monitor.stopMonitoring) monitor.stopMonitoring();

        return stopped;
    }
};

module.exports = SecurityAgent;