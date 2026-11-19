const SecurityAgent = require('../libs/agent');
const policy = require('../libs/agent/policy');
const { AsyncLocalStorage } = require('async_hooks');
const util = require('util');

const COMMAND_TIMEOUT_MS = 60 * 1000;
const MAX_CONCURRENT = 3;
const MAX_OUTPUT_BYTES = 200 * 1024;
const MAX_BATCH = 10;
const RATE_LIMIT = 60; // commands per user per window
const RATE_WINDOW_MS = 60 * 1000;

const BUILT_IN_DESCRIPTIONS = {
    help: 'Show help information',
    status: 'Show system status',
    history: 'Show command history',
    banner: 'Show banner',
    version: 'Show version info',
    tips: 'Show tips and tricks',
};

// Error shape matches the auth controller's response.error
const fail = (res, status, message) => res.status(status).json({ success: false, message });

class CommandTimeout extends Error { }

// eslint-disable-next-line no-control-regex
const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

const withTimeout = (promise, ms) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new CommandTimeout('Command timed out')), ms);
        promise.then(
            (value) => { clearTimeout(timer); resolve(value); },
            (error) => { clearTimeout(timer); reject(error); }
        );
    });

const outputStore = new AsyncLocalStorage();

if (!console.log.__agentCapture) {
    const rawLog = console.log;
    const patched = function(...args) {
        const sink = outputStore.getStore();
        if (sink) return sink.write(util.format(...args));
        return rawLog.apply(this, args);
    };
    patched.__agentCapture = true;
    console.log = patched;
}

const createSink = () => {
    const lines = [];
    let bytes = 0;
    let truncated = false;

    return {
        write(line) {
            if (truncated) return;
            bytes += Buffer.byteLength(line) + 1;
            if (bytes > MAX_OUTPUT_BYTES) {
                truncated = true;
                lines.push('... output truncated ...');
                return;
            }
            lines.push(line);
        },
        text: () => stripAnsi(lines.join('\n')),
    };
};

const captureOutput = async (commandFn) => {
    const sink = createSink();
    await outputStore.run(sink, () => withTimeout(Promise.resolve().then(commandFn), COMMAND_TIMEOUT_MS));
    return sink.text();
};
/* -------------------------------------------------------------------------
   Controller

   Every handler requires an admin. The route file enforces this too; checking here as well means
   the dangerous part still fails closed if a route is ever mounted without its middleware.
   ---------------------------------------------------------------------- */

class AgentController {
    constructor() {
        this.agentInstance = null;
        this.isInitialized = false;
        this.activeCommands = 0;
        this.rateLog = new Map(); // userId -> [timestamps]
    }

    /** Get or create agent instance (singleton pattern) */
    getInstance() {
        if (!this.agentInstance) {
            this.agentInstance = new SecurityAgent({ mode: 'api' });
            this.isInitialized = false;
        }
        return this.agentInstance;
    }

    logger(req) {
        const fear = req.app && req.app.get('fear');
        return (fear && fear.getLogger()) || console;
    }

    /** Sends the 401/403 itself and returns null, or returns the admin user. */
    authorize(req, res) {
        const user = req.user;

        if (!user) {
            fail(res, 401, 'Authentication required');
            return null;
        }
        if (user.role !== 'admin') {
            this.logger(req).warn(`FEAR agent :: non-admin blocked :: user ${user._id} :: ${req.method} ${req.originalUrl}`);
            fail(res, 403, 'Admin access required');
            return null;
        }
        return user;
    }

    withinRateLimit(userId) {
        const key = String(userId);
        const now = Date.now();
        const recent = (this.rateLog.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);

        if (recent.length >= RATE_LIMIT) {
            this.rateLog.set(key, recent);
            return false;
        }
        recent.push(now);
        this.rateLog.set(key, recent);
        return true;
    }

    /** The commands this API exposes AND this server actually loaded. */
    exposedCommands(agent) {
        return policy.list().filter((command) => typeof agent.commands[command] === 'function');
    }

    describeCommand(agent, command) {
        const mapping = agent.mappings && agent.mappings[command];
        return mapping
            ? { description: mapping.description, module: mapping.module }
            : { description: BUILT_IN_DESCRIPTIONS[command] || '', module: 'core' };
    }

    /**
     * The one place a command runs. Returns { ok, status, message } or { ok: true, output }.
     * Used by single execution, batch and the module-specific routes.
     */
    async execute(req, user, command, rawArgs) {
        const logger = this.logger(req);
        const who = `user ${user._id} (${user.email || 'no email'}) ip ${req.ip}`;

        if (!policy.isAllowed(command)) {
            logger.warn(`FEAR agent :: denied :: ${who} :: ${JSON.stringify(String(command)).slice(0, 60)}`);
            return { ok: false, status: 403, message: 'Command not available' };
        }

        const normalized = policy.normalizeArgs(rawArgs);
        if (normalized.error) return { ok: false, status: 400, message: normalized.error };

        const problem = policy.validate(command, normalized.args);
        if (problem) return { ok: false, status: 400, message: problem };

        const agent = this.getInstance();
        this.isInitialized = true;
        await agent.ready; // modules finish their own async setup (e.g. the Ollama probe)

        const run = agent.commands[command];
        if (typeof run !== 'function') {
            return { ok: false, status: 503, message: 'Command is not loaded on this server' };
        }

        if (!this.withinRateLimit(user._id)) {
            return { ok: false, status: 429, message: 'Too many commands, slow down' };
        }
        if (this.activeCommands >= MAX_CONCURRENT) {
            return { ok: false, status: 429, message: 'The agent is busy, try again shortly' };
        }

        this.activeCommands++;
        try {
            const output = await captureOutput(() => run(normalized.args));
            logger.info(`FEAR agent :: ran ${command} :: ${who} :: args ${JSON.stringify(normalized.args.join(' ').slice(0, 100))}`);
            return { ok: true, output };
        } catch (error) {
            if (error instanceof CommandTimeout) {
                logger.error(`FEAR agent :: timed out ${command} :: ${who}`);
                return { ok: false, status: 504, message: 'Command timed out' };
            }
            logger.error(`FEAR agent :: ${command} failed :: ${who} :: ${error.message}`);
            const detail = process.env.NODE_ENV === 'production' ? 'Command failed' : error.message || 'Command failed';
            return { ok: false, status: 500, message: detail };
        } finally {
            this.activeCommands--;
        }
    }

    /** Run one command and send the result. Also what the module-specific routes call. */
    async runCommand(req, res, command, rawArgs) {
        const user = this.authorize(req, res);
        if (!user) return null;

        const result = await this.execute(req, user, command, rawArgs);
        if (!result.ok) return fail(res, result.status, result.message);

        return res.status(200).json({
            success: true,
            command,
            output: result.output,
            executedAt: new Date().toISOString(),
        });
    }

    /** POST /initialize */
    async initialize(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            const agent = this.getInstance();
            const already = this.isInitialized;
            this.isInitialized = true;

            return res.status(200).json({
                success: true,
                message: already ? 'Agent already initialized' : 'Agent initialized successfully',
                initialized: true,
                modulesLoaded: Object.keys(agent.modules).length,
                commandsRegistered: this.exposedCommands(agent).length,
            });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: initialize failed :: ${error.message}`);
            return fail(res, 500, 'Failed to initialize agent');
        }
    }

    /** POST /execute  { command, args } */
    async executeCommand(req, res) {
        const { command, args } = req.body || {};
        if (!command) {
            return this.authorize(req, res) && fail(res, 400, 'Command is required');
        }
        return this.runCommand(req, res, command, args);
    }

    /** POST /batch  { commands: [{ command, args }] }, run in order */
    async executeBatch(req, res) {
        const user = this.authorize(req, res);
        if (!user) return null;

        const { commands } = req.body || {};
        if (!Array.isArray(commands) || commands.length === 0) {
            return fail(res, 400, 'Commands array is required');
        }
        if (commands.length > MAX_BATCH) {
            return fail(res, 400, `A batch can hold at most ${MAX_BATCH} commands`);
        }

        const results = [];
        for (const item of commands) {
            const command = item && item.command;
            if (!command) {
                results.push({ success: false, error: 'Command name is required' });
                continue;
            }

            const result = await this.execute(req, user, command, item.args);
            results.push(
                result.ok
                    ? { success: true, command, output: result.output }
                    : { success: false, command: typeof command === 'string' ? command.slice(0, 40) : undefined, error: result.message }
            );
        }

        return res.status(200).json({
            success: true,
            totalCommands: commands.length,
            results,
            executedAt: new Date().toISOString(),
        });
    }

    /** GET /commands: only what this API can actually run */
    async getCommands(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            const agent = this.getInstance();
            const commands = {};
            this.exposedCommands(agent).forEach((command) => {
                commands[command] = this.describeCommand(agent, command);
            });

            return res.status(200).json({ success: true, totalCommands: Object.keys(commands).length, commands });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: list commands failed :: ${error.message}`);
            return fail(res, 500, 'Failed to fetch commands');
        }
    }

    /** GET /commands/:command */
    async checkCommand(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            const { command } = req.params;
            const agent = this.getInstance();
            const exists = policy.isAllowed(command) && typeof agent.commands[command] === 'function';

            return res.status(200).json({
                success: true,
                command,
                exists,
                details: exists ? this.describeCommand(agent, command) : null,
            });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: check command failed :: ${error.message}`);
            return fail(res, 500, 'Failed to check command');
        }
    }

    /** GET /status */
    async getStatus(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            if (!this.isInitialized) {
                return res.status(200).json({ success: true, initialized: false, message: 'Agent not initialized' });
            }

            const agent = this.getInstance();

            const modules = {};
            agent.definitions.forEach((moduleDef) => {
                const module = agent.modules[moduleDef.name];
                modules[moduleDef.name] = {
                    displayName: moduleDef.displayName,
                    loaded: !!module,
                    status: module ? 'ready' : 'unavailable',
                };

                if (moduleDef.name === 'aiAnalyzer' && module) {
                    modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
                    modules[moduleDef.name].provider = module.getProviderName ? module.getProviderName() : null;
                }
                if (moduleDef.name === 'aiChat' && module) {
                    modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
                }
            });

            const services = {};
            agent.backgroundServices.forEach((service, name) => {
                services[name] = agent.serviceStatus.get(name) || 'stopped';
            });

            return res.status(200).json({
                success: true,
                initialized: true,
                version: this.getVersionInfo(agent),
                modules,
                services,
                stats: {
                    modulesLoaded: Object.keys(agent.modules).length,
                    commandsAvailable: this.exposedCommands(agent).length,
                    servicesRunning: Array.from(agent.serviceStatus.values()).filter((s) => s === 'running').length,
                    commandHistory: agent.commandHistory.length,
                },
            });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: status failed :: ${error.message}`);
            return fail(res, 500, 'Failed to fetch status');
        }
    }

    /** GET /history?limit= */
    async getHistory(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            if (!this.isInitialized) {
                return res.status(200).json({ success: true, history: [], message: 'Agent not initialized' });
            }

            const agent = this.getInstance();
            const requested = parseInt(req.query.limit, 10);
            const limit = Number.isNaN(requested) ? 20 : Math.min(Math.max(requested, 1), 100);

            return res.status(200).json({
                success: true,
                total: agent.commandHistory.length,
                limit,
                history: agent.commandHistory.slice(-limit),
            });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: history failed :: ${error.message}`);
            return fail(res, 500, 'Failed to fetch history');
        }
    }

    /** GET /version */
    async getVersion(req, res) {
        if (!this.authorize(req, res)) return null;

        try {
            return res.status(200).json({ success: true, ...this.getVersionInfo(this.getInstance()) });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: version failed :: ${error.message}`);
            return fail(res, 500, 'Failed to fetch version');
        }
    }

    /** POST /shutdown: stops the agent's services and drops the instance (the server keeps running) */
    async shutdown(req, res) {
        const user = this.authorize(req, res);
        if (!user) return null;

        try {
            const agent = this.getInstance();

            const stoppedServices = [];
            agent.backgroundServices.forEach((service, name) => {
                if (agent.serviceStatus.get(name) === 'running') {
                    agent.stopService(name);
                    stoppedServices.push(name);
                }
            });

            if (agent.modules.trafficMonitor && agent.modules.trafficMonitor.stopMonitoring) {
                agent.modules.trafficMonitor.stopMonitoring();
            }

            this.isInitialized = false;
            this.agentInstance = null;

            this.logger(req).info(`FEAR agent :: shutdown :: user ${user._id}`);
            return res.status(200).json({ success: true, message: 'Agent shutdown successfully', servicesStopped: stoppedServices });
        } catch (error) {
            this.logger(req).error(`FEAR agent :: shutdown failed :: ${error.message}`);
            return fail(res, 500, 'Failed to shutdown agent');
        }
    }

    getVersionInfo(agent) {
        return {
            version: '2.4.0',
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            modulesLoaded: Object.keys(agent.modules).length,
            commandsAvailable: this.exposedCommands(agent).length,
        };
    }
}

// Export singleton instance
module.exports = new AgentController();