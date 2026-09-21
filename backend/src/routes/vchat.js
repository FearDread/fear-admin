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