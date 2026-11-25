    // routes/agent.js - API routes for the Security Agent
//
// Admin only, command allowlist (libs/agent/policy.js), per-user rate limit and audit log.
// Off by default in production: set AGENT_API_ENABLED=true to mount it there. Anywhere else it is on
// unless AGENT_API_ENABLED=false.
const Auth = require("../controllers/auth");
const agent = require("../controllers/agent");

module.exports = (fear) => {
    const router = fear.createRouter();
    const logger = fear.getLogger();
    const env = fear.getEnvironment() || {};

    const enabled = env.AGENT_API_ENABLED
        ? env.AGENT_API_ENABLED === 'true'
        : env.NODE_ENV !== 'production';

    if (!enabled) {
        logger.warn('FEAR agent :: API disabled (set AGENT_API_ENABLED=true to enable it)');
        router.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));
        return router;
    }

    router.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    // Nothing below this line is reachable without an admin session.
    router.use(Auth.isAuthorized, Auth.isAdmin);

    const body = (req) => req.body || {};

    // Maps a route onto one policy-checked command. Missing fields are dropped, so the policy reports
    // "expected at least N argument(s)" instead of a type error.
    const run = (command, argsFrom = () => []) => (req, res) =>
        agent.runCommand(req, res, command, argsFrom(req).filter((value) => value !== undefined && value !== null));

    // ---- agent ----
    router.post('/initialize', (req, res) => agent.initialize(req, res));
    router.post('/execute', (req, res) => agent.executeCommand(req, res));
    router.post('/batch', (req, res) => agent.executeBatch(req, res));
    router.get('/commands', (req, res) => agent.getCommands(req, res));
    router.get('/commands/:command', (req, res) => agent.checkCommand(req, res));
    router.get('/status', (req, res) => agent.getStatus(req, res));
    router.get('/history', (req, res) => agent.getHistory(req, res));
    router.get('/version', (req, res) => agent.getVersion(req, res));
    router.post('/shutdown', (req, res) => agent.shutdown(req, res));

    // ---- AI ----
    router.get('/ai/status', run('ai-status'));
    router.post('/ai/provider', run('ai-provider', (req) => [body(req).provider]));

    router.post('/chat', run('chat-quick', (req) => [body(req).message]));
    router.get('/chat/history', run('chat-history'));
    router.post('/chat/clear', run('chat-clear'));

    // ---- CVE ----
    router.post('/cve/search', run('search-cve', (req) => [body(req).query]));

    // ---- background services ----
    router.post('/service/start', run('service-start', (req) => [body(req).service]));
    router.post('/service/stop', run('service-stop', (req) => [body(req).service]));
    router.get('/service/status', run('service-status'));
    router.get('/service/list', run('service-list'));

    // ---- proxies (read-only) ----
    router.get('/proxy/list', run('list-proxies'));
    router.get('/proxy/status', run('proxy-status'));

    // ---- crypto ----
    router.get('/crypto/price/:symbol', run('crypto-price', (req) => [req.params.symbol]));
    // crypto-convert takes <amount> <from> <to>
    router.post('/crypto/convert', run('crypto-convert', (req) => {
        const { amount, from, to } = body(req);
        return [amount, from, to];
    }));

    router.post('/audit/site', run('site-audit', (req) => [body(req).site]));

    return router;
};