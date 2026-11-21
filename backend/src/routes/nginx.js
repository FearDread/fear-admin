const Nginx = require("../controllers/nginx");
const Auth = require("../controllers/auth");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const { requireUser } = fear.getVchatAuth();

    // Everything here exposes server config, upstream targets and cert paths: admin only.
    router.use(Auth.isAuthorized, Auth.isAdmin);

    // ── Monitor state ──────────────────────────────────────────────────────
    router.get("/status", handler.async(Nginx.status));                  // monitor state + latest snapshot
    router.get("/events", handler.async(Nginx.events));                  // ?limit=50 recent alerts / changes
    router.post("/monitor/start", handler.async(Nginx.start));           // { interval?: seconds }
    router.post("/monitor/stop", handler.async(Nginx.stop));

    // ── Config ─────────────────────────────────────────────────────────────
    router.get("/vhosts", handler.async(Nginx.vhosts));                  // parsed server blocks + upstreams
    router.post("/test", handler.async(Nginx.test));                     // nginx -t

    // ── Checks ─────────────────────────────────────────────────────────────
    router.post("/check-all", handler.async(Nginx.checkAll));            // run everything now, save snapshot
    router.get("/check/:domain", handler.async(Nginx.check));            // ?local=true bypasses DNS
    router.get("/dns/:domain", handler.async(Nginx.dns));
    router.get("/certs", handler.async(Nginx.certs));
    router.get("/history/:domain", handler.async(Nginx.history));
    router.get("/trend", handler.async(Nginx.trend));                    // ?limit=60 series for dashboard graphs

    return router;
};