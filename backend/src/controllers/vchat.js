const crypto = require('crypto');

const ROOM_PATTERN = /^[\w-]{1,64}$/;
const DEFAULT_STUN = 'stun:stun.l.google.com:19302';
const DEFAULT_SOCKET_PATH = '/fear/ws/vchat';

// Error shape matches the auth controller's response.error
const fail = (res, status, message) => res.status(status).json({ success: false, message });

const fearOf = (req) => req.app.get('fear');

// session / config / token carry identity or TURN credentials: never cache them.
exports.noStore = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
};

// Always 200: the SPA calls this on load to choose between login and lobby.
exports.session = (req, res) => {
    const user = req.vchatUser || null;

    res.json({
        authenticated: !!user,
        userId: user ? user.id : null,
        displayName: user ? user.displayName : null,
    });
};

// ICE servers, socket path and room limits the client needs before it connects.
exports.config = (req, res) => {
    const fear = fearOf(req);
    const env = fear.getEnvironment() || {};
    const iceServers = [{ urls: env.STUN_URL || DEFAULT_STUN }];

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
        socketPath: fear.signal ? fear.signal.path : DEFAULT_SOCKET_PATH,
        maxRoomSize: fear.signal ? fear.signal.maxRoomSize : null,
        fallbackOrigin: env.VCHAT_WS_FALLBACK_ORIGIN || null,
    });
};

// Short-lived, single-use token for reconnecting through a different origin.
exports.token = (req, res) => {
    const fear = fearOf(req);

    try {
        res.json(fear.getVchatAuth().mintHandoff(req.vchatUser.id));
    } catch (error) {
        fear.getLogger().error(`FEAR vchat :: handoff mint failed :: ${error.message}`);
        fail(res, 503, 'Handoff signing not configured');
    }
};

exports.createRoom = (req, res) => {
    const room = crypto.randomBytes(9).toString('base64url');

    fearOf(req).getLogger().info(`FEAR vchat :: room created :: ${room} :: user ${req.vchatUser.id}`);
    res.status(201).json({ room });
};

exports.getRoom = (req, res) => {
    const { room } = req.params;
    if (!ROOM_PATTERN.test(room)) return fail(res, 400, 'Invalid room');

    const { signal } = fearOf(req);
    const stats = signal ? signal.getStats() : { rooms: [] };
    const found = stats.rooms.find((entry) => entry.room === room);

    res.json({ room, peers: found ? found.peers : 0 });
};

// Lists every room and participant name — mount behind an admin role check.
exports.stats = (req, res) => {
    const { signal } = fearOf(req);
    if (!signal) return fail(res, 503, 'Signaling not attached');

    res.json(signal.getStats());
};

module.exports = exports;