/**
 * FEAR route :: vchat
 *
 * Drop at: routes/vchat.js  ->  auto-mounted at /fear/api/vchat
 *
 * The WebSocket handles signaling; this handles everything the client needs
 * before it opens the socket (ICE servers, room creation, room state).
 */

const crypto = require("crypto");

const HANDOFF_TTL_MS = 120000; // must match libs/signal/index.js's HANDOFF_TTL_MS

// Per-IP login attempt limit. In-memory, so it's per-process — fine for one
// instance, not shared across a horizontally-scaled deployment. Swap for a
// Redis-backed limiter before running more than one process of this app.
const LOGIN_RATE_LIMIT = 5;
const LOGIN_RATE_WINDOW_MS = 5 * 60 * 1000;
const loginAttempts = new Map(); // ip -> { count, windowStart }

function checkLoginRateLimit(ip) {
    const now = Date.now();
    const entry = loginAttempts.get(ip);

    if (!entry || now - entry.windowStart > LOGIN_RATE_WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, windowStart: now });
        return true;
    }

    if (entry.count >= LOGIN_RATE_LIMIT) return false;

    entry.count += 1;
    return true;
}

module.exports = (fear) => {
    const router = fear.createRouter();
    const logger = fear.getLogger();
    const env = fear.getEnvironment() || {};

    const requireUser = (req, res, next) => {
        if (!req.user && !req.session?.passport?.user) {
            return res.status(401).json({ error: "authentication required" });
        }
        next();
    };

    /**
     * Programmatic login — reads { email, password } from a JSON body, same
     * fields libs/passport's "vchat-login" strategy expects. passport-local
     * reads req.body regardless of what produced it; express.json() (mounted
     * in FEAR.js's setupMiddleware) parses a fetch()'d JSON POST exactly the
     * same way it'd parse an HTML form's urlencoded body. No form, no
     * redirect — this calls passport.authenticate() with the callback
     * signature instead of using it as middleware, specifically to get a JSON
     * response back on failure instead of passport's default
     * redirect-on-failure behavior.
     *
     * Deliberately NOT the "login" strategy also registered in
     * libs/passport — that one calls req.flash() on failure, which this
     * JSON route has no use for and no guarantee is even mounted. See the
     * doc comment on "vchat-login" in libs/passport/index.js for why these
     * are two separate strategies rather than one shared one.
     */
    router.post("/login", (req, res, next) => {
        if (!checkLoginRateLimit(req.ip)) {
            return res.status(429).json({ error: "too many login attempts — try again in a few minutes" });
        }

        const passport = fear.getPassport();
        if (!passport || typeof passport.authenticate !== "function") {
            return res.status(503).json({ error: "authentication not configured" });
        }

        passport.authenticate("vchat-login", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: info?.message || "invalid email or password" });

            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                res.json({ ok: true, userId: user.id ?? user._id ?? null });
            });
        })(req, res, next);
    });

    router.post("/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);

            if (!req.session) return res.json({ ok: true });

            req.session.destroy(() => {
                // Default express-session cookie name — change this if FEAR.js's
                // session({...}) call sets a custom `name`.
                res.clearCookie("connect.sid");
                res.json({ ok: true });
            });
        });
    });

    /**
     * Lets the client check "am I already logged in?" on page load without
     * tripping a 401 against a protected route just to find out.
     */
    router.get("/session", (req, res) => {
        const userId = req.user?.id || req.session?.passport?.user || null;
        res.json({ authenticated: !!userId, userId });
    });

    /**
     * ICE servers. STUN alone only works when both peers can hole-punch; add a
     * TURN server (coturn on the same box is fine) before trusting this on
     * mobile networks or symmetric NAT.
     */
    router.get("/config", requireUser, (req, res) => {
        const iceServers = [{ urls: env.STUN_URL || "stun:stun.l.google.com:19302" }];

        if (env.TURN_URL && env.TURN_USER && env.TURN_PASS) {
            iceServers.push({
                urls: env.TURN_URL,
                username: env.TURN_USER,
                credential: env.TURN_PASS,
            });
        }

        res.json({
            iceServers,
            socketPath: fear.signal ? fear.signal.path : "/fear/ws/vchat",
            maxRoomSize: fear.signal ? fear.signal.maxRoomSize : null,
            // Informational only — the client keeps its own hardcoded endpoint list
            // so it can still find the fallback if THIS origin is the one that's
            // down. This just lets it sanity-check that value against what the
            // server thinks its fallback is.
            fallbackOrigin: env.VCHAT_WS_FALLBACK_ORIGIN || null,
        });
    });

    /**
     * Mints a short-lived signed token the client can present to the WebSocket
     * on a *different* origin than this one — see libs/signal/index.js's
     * verifyHandoffToken() for exactly what it proves and for how long. This
     * is what lets a client that's already logged in on the primary origin
     * fail over to a fallback tunnel without a second login.
     */
    router.get("/token", requireUser, (req, res) => {
        if (!env.SESSION_SECRET) {
            return res.status(503).json({ error: "handoff signing not configured" });
        }

        const userId = req.user?.id || req.session?.passport?.user;
        const payload = { userId, exp: Date.now() + HANDOFF_TTL_MS };
        const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
        const signature = crypto.createHmac("sha256", env.SESSION_SECRET).update(payloadB64).digest("hex");

        res.json({ token: `${payloadB64}.${signature}`, expiresAt: payload.exp });
    });

    router.post("/rooms", requireUser, (req, res) => {
        const room = crypto.randomBytes(9).toString("base64url");
        logger.info(`FEAR vchat :: room created :: ${room}`);
        res.status(201).json({ room });
    });

    router.get("/rooms/:room", requireUser, (req, res) => {
        const stats = fear.signal ? fear.signal.getStats() : { rooms: [] };
        const found = stats.rooms.find((entry) => entry.room === req.params.room);
        res.json({ room: req.params.room, peers: found ? found.peers : 0 });
    });

    router.get("/stats", requireUser, (req, res) => {
        if (!fear.signal) return res.status(503).json({ error: "signaling not attached" });
        res.json(fear.signal.getStats());
    });

    return router;
};