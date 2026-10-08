/**
 * FEAR route :: vchat
 *
 * Drop at: routes/vchat.js  ->  auto-mounted at /fear/api/vchat
 *
 * The WebSocket handles signaling; this handles everything the client needs
 * before it opens the socket (ICE servers, room creation, room state).
 */

const crypto = require("crypto");
const Auth = require("../controllers/auth");

const HANDOFF_TTL_MS = 120000; // must match libs/signal/index.js's HANDOFF_TTL_MS
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
    const handler = fear.getHandler();
    const env = fear.getEnvironment() || {};

    const requireUser = (req, res, next) => {
        console.log('session user = ', req.user);
        if (!req.user && !req.session?.passport?.user) {
            return res.status(401).json({ error: "authentication required" });
        }
        next();
    };

    router.post("/login", handler.async(Auth.login));
    /*
    router.post("/login", (req, res, next) => {

        const { email, password } = req.body;
        if (!checkLoginRateLimit(req.ip)) {
            return res.status(429).json({ error: "too many login attempts — try again in a few minutes" });
        }

        const passport = fear.getPassport();



        Auth.login(req, res)
            .then((user) => {
                console.log('login response = ', user);
                if (!user) next(null, false, { message: "login failed" })
                //return next(null, resp);
                res.json({ ok: true, userId: user.id ?? user._id ?? null });
            })
            .catch((err) => next(err));
        /*
                if (!passport || typeof passport.authenticate !== "function") {
            return res.status(503).json({ error: "authentication not configured" });
        }
        console.log('vchat login :: ', req);
        passport.authenticate("vchat-login", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: info?.message || "invalid email or password" });

            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                res.json({ ok: true, userId: user.id ?? user._id ?? null });
            });
        })(req, res, next);

    });
            */


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

    router.get("/session", (req, res) => {
        const userId = req.user?.id || req.session?.passport?.user || null;
        res.json({ authenticated: !!userId, userId });
    });

    router.get("/config", requireUser, (req, res) => {

        const iceServers = [{ urls: env.STUN_URL || "stun:stun.l.google.com:19302" }];

        if (env.TURN_USER && env.TURN_CRED && env.TURN_URLS) {

            env.TURN_URLS.split(',').each((url) => {
                iceServers.push({
                    urls: url,
                    username: env.TURN_USER,
                    credential: env.TURN_CRED,
                });
            })
        }

        res.json({
            iceServers,
            socketPath: fear.signal ? fear.signal.path : "/fear/ws/vchat",
            maxRoomSize: fear.signal ? fear.signal.maxRoomSize : null,
            fallbackOrigin: env.VCHAT_WS_FALLBACK_ORIGIN || null,
        });
    });

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