const agentController = require("../agent");
const request = require('../request');

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

// The monitor lives inside the security agent (libs/agent/modules/net/nginx.js).
const monitor = () => {
    const agent = agentController.getInstance();
    return agent.modules.nginxMonitor ? { agent, mod: agent.modules.nginxMonitor } : null;
};

/**
 * Wraps a handler: resolves the monitor module, runs fn inside a promise chain,
 * and turns any rejection (or sync throw) into a 500 envelope.
 * Typical failure is nginx.conf unreadable (wrong NGINX_CONF_DIR or no permission).
 */
const withMonitor = (fn) => (req, res) => {
    const found = monitor();
    if (!found) return request.fail(res, 503, "Nginx monitor module is not loaded");

    return Promise.resolve()
        .then(() => fn(found.mod, found.agent, req, res))
        .catch((error) => {
            if (res.headersSent) return null;
            return request.fail(res, 500, error.message || "Nginx monitor error", error);
        });
};

const validDomain = (req, res) => {
    const domain = String(req.params.domain || "").toLowerCase();
    if (!DOMAIN_RE.test(domain)) {
        request.fail(res, 400, "A valid domain is required");
        return null;
    }
    return domain;
};

/** GET /vhosts — parsed server blocks and upstreams */
exports.vhosts = withMonitor((mod, agent, req, res) => {
    return mod.getVhosts()
        .then(({ servers, upstreams }) =>
            request.send(res, 200, { servers, upstreams }, '', { count: servers.length }));
});

/** GET /status — monitor state plus the latest snapshot */
exports.status = withMonitor((mod, agent, req, res) => {
    return Promise.resolve(mod.getSnapshot())
        .then((snapshot) => request.send(res, 200, snapshot, '', { intervalMs: mod.intervalMs }));
});

/** GET /events?limit=50 — `count` is added automatically for arrays */
exports.events = withMonitor((mod, agent, req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);

    return Promise.resolve(mod.events.slice(-limit))
        .then((events) => request.ok(res, events));
});

/** GET /dns/:domain */
exports.dns = withMonitor((mod, agent, req, res) => {
    const domain = validDomain(req, res);
    if (!domain) return null;

    return mod.resolveAll(domain)
        .then((records) => request.ok(res, { domain, records }));
});

/** GET /check/:domain?local=true — DNS + HTTP/HTTPS + cert for one vhost */
exports.check = withMonitor((mod, agent, req, res) => {
    const domain = validDomain(req, res);
    if (!domain) return null;

    return mod.getVhosts()
        .then(({ servers }) => servers.find((s) => s.names.includes(domain)) || null)
        .catch(() => null) // config unreadable, still check the domain
        .then((vhost) =>
            mod.checkHost(domain, vhost, { local: req.query.local === "true" })
                .then((result) => request.send(res, 200, result, '', { inConfig: !!vhost })));
});

/** GET /certs — expiry for every SSL vhost, soonest first */
exports.certs = withMonitor((mod, agent, req, res) => {
    return mod.getVhosts()
        .then(({ servers }) => {
            const names = [...new Set(servers.filter((s) => s.ssl).flatMap((s) => mod.monitorable(s)))];
            return mod.pool(names, (host) => mod.certInfo(host, false).then((info) => ({ host, ...info })));
        })
        .then((rows) => {
            rows.sort((a, b) => (a.daysLeft ?? -1e9) - (b.daysLeft ?? -1e9));
            return request.ok(res, rows);
        });
});

/** GET /history/:domain — saved snapshots for one host */
exports.history = withMonitor((mod, agent, req, res) => {
    const domain = validDomain(req, res);
    if (!domain) return null;

    return mod.loadHistory()
        .then((history) => history
            .filter((s) => s.hosts[domain])
            .slice(-50)
            .map((s) => ({ time: s.time, healthy: mod.healthy(s.hosts[domain]), ...s.hosts[domain] })))
        .then((rows) => request.ok(res, rows));
});

/** GET /trend?limit=60 — compact per-snapshot series for the dashboard graphs */
exports.trend = withMonitor((mod, agent, req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 60, 2), 200);

    return mod.loadHistory()
        .then((history) => history.slice(-limit).map((s) => {
            const hosts = {};
            let up = 0, down = 0, sum = 0, n = 0;

            Object.entries(s.hosts).forEach(([name, h]) => {
                const ok = mod.healthy(h);
                const probe = h.https && h.https.ok ? h.https : (h.http && h.http.ok ? h.http : null);
                const ms = probe ? probe.ms : null;

                ok ? up++ : down++;
                if (ms !== null) { sum += ms; n++; }
                hosts[name] = { ok, ms };
            });

            return { time: s.time, up, down, avgMs: n ? Math.round(sum / n) : null, hosts };
        }))
        .then((rows) => request.ok(res, rows));
});

/** POST /check-all   { local?: boolean } — run every check now, save snapshot, return changes */
exports.checkAll = withMonitor((mod, agent, req, res) => {
    return mod.runChecks({ local: !!(req.body && req.body.local) })
        .then(({ snapshot, events }) => request.ok(res, { snapshot, events }));
});

/** POST /test — nginx -t */
exports.test = withMonitor((mod, agent, req, res) => {
    return mod.configTest()
        .then((result) => request.send(
            res,
            result.ok ? 200 : 422,
            result,
            result.ok ? 'Config OK' : 'Config test failed'
        ));
});

/** POST /monitor/start   { interval?: seconds } */
exports.start = withMonitor((mod, agent, req, res) => {
    const secs = req.body && req.body.interval !== undefined ? Number(req.body.interval) : null;

    if (secs !== null && (!Number.isInteger(secs) || secs < 30 || secs > 86400)) {
        return request.fail(res, 400, "interval must be an integer between 30 and 86400 seconds");
    }
    if (mod.timer) return request.fail(res, 409, "Monitor already running");

    return Promise.resolve()
        .then(() => {
            mod.startTimer(secs ? secs * 1000 : undefined);
            agent.serviceStatus.set("nginx-monitor", "running");
        })
        .then(() => request.send(res, 200, null, 'Monitor started', { intervalMs: mod.intervalMs }));
});

/** POST /monitor/stop */
exports.stop = withMonitor((mod, agent, req, res) => {
    if (!mod.timer) return request.fail(res, 409, "Monitor is not running");

    return Promise.resolve()
        .then(() => {
            mod.stopTimer();
            agent.serviceStatus.set("nginx-monitor", "stopped");
        })
        .then(() => request.ok(res, null, 'Monitor stopped'));
});