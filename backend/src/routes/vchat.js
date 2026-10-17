/**
 * FEAR route :: vchat   (drop at routes/vchat.js -> /fear/api/vchat)
 *
 * Auth model: the JWT cookie set by controllers/auth login. Signaling happens over the
 * WebSocket; this router covers what the client needs before it connects.
 */
const crypto = require('crypto');
const Auth = require('../controllers/auth');
const { requireUser, optionalUser, withoutToken, loginLimiter, mintHandoff } = require('../controllers/auth/vchat');

const ROOM_PATTERN = /^[\w-]{1,64}$/;

module.exports = (fear) => {
    const router = fear.createRouter();
    const logger = fear.getLogger();
    const handler = fear.getHandler();
    const env = fear.getEnvironment() || {};

    // session/config/token carry identity or TURN credentials: never cache them.
    router.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
    router.post('/logout', Auth.logout);

    // Always 200: the SPA calls this on load to decide between login and lobby.
    router.get('/session', optionalUser, (req, res) => {
        const user = req.vchatUser;
        res.json({
            authenticated: !!user,
            userId: user ? user.id : null,
            displayName: user ? user.displayName : null,
        });
    });

    router.get('/config', requireUser, (req, res) => {
        const iceServers = [{ urls: env.STUN_URL || 'stun:stun.l.google.com:19302' }];

        if (env.TURN_USER && env.TURN_CRED && env.TURN_URLS) {
            env.TURN_URLS.split(',')
                .map((url) => url.trim())
                .filter(Boolean)
                .forEach((url) => {
                    iceServers.push({ urls: url, username: env.TURN_USER, credential: env.TURN_CRED });
                });
        }

        res.json({
            iceServers,
            socketPath: fear.signal ? fear.signal.path : '/fear/ws/vchat',
            maxRoomSize: fear.signal ? fear.signal.maxRoomSize : null,
            fallbackOrigin: env.VCHAT_WS_FALLBACK_ORIGIN || null,
        });
    });

    router.get('/token', requireUser, (req, res) => {
        try {
            res.json(mintHandoff(req.vchatUser.id));
        } catch (err) {
            logger.error(`FEAR vchat :: handoff mint failed :: ${err.message}`);
            res.status(503).json({ error: 'handoff signing not configured' });
        }
    });

    router.post('/rooms', requireUser, (req, res) => {
        const room = crypto.randomBytes(9).toString('base64url');
        logger.info(`FEAR vchat :: room created :: ${room} :: user ${req.vchatUser.id}`);
        res.status(201).json({ room });
    });

    router.get('/rooms/:room', requireUser, (req, res) => {
        if (!ROOM_PATTERN.test(req.params.room)) return res.status(400).json({ error: 'invalid room' });

        const stats = fear.signal ? fear.signal.getStats() : { rooms: [] };
        const found = stats.rooms.find((entry) => entry.room === req.params.room);
        res.json({ room: req.params.room, peers: found ? found.peers : 0 });
    });

    // Lists every room and participant name: admins only.
    router.get('/stats', requireUser, Auth.authorizeRoles('admin'), (req, res) => {
        if (!fear.signal) return res.status(503).json({ error: 'signaling not attached' });
        res.json(fear.signal.getStats());
    });

    return router;
};
