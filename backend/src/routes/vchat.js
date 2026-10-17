/**
 * FEAR route :: vchat   (drop at routes/vchat.js -> /fear/api/vchat)
 *
 * Auth model: the JWT cookie set by controllers/auth login. Signaling happens over the
 * WebSocket; this router covers what the client needs before it connects.
 */
const crypto = require('crypto');
const Auth = require('../controllers/auth');
const Vchat = require('../controllers/vchat');
const { requireUser, optionalUser, withoutToken, loginLimiter, mintHandoff } = require('../controllers/auth/vchat');

const ROOM_PATTERN = /^[\w-]{1,64}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Invites go to arbitrary addresses, so cap them per user (in-memory, per instance).
const INVITE_LIMIT = 10;
const INVITE_WINDOW_MS = 60 * 60 * 1000;
const inviteLog = new Map(); // userId -> [timestamps]

function allowInvite(userId) {
    const now = Date.now();
    const recent = (inviteLog.get(userId) || []).filter((t) => now - t < INVITE_WINDOW_MS);
    if (recent.length >= INVITE_LIMIT) {
        inviteLog.set(userId, recent);
        return false;
    }
    recent.push(now);
    inviteLog.set(userId, recent);
    return true;
}

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

    // ---------------------------------------------------------------- email

    // Mailer from libs/smtp.js. Use the instance FEAR already built if there is one
    // (fear.mailer); otherwise build it once. Adjust the require path to where smtp.js lives.
    let mailer = null;
    const getMailer = () => {
        if (!mailer) mailer = fear.mailer || require('../libs/smtp')(fear);
        return mailer;
    };

    // Public base URL used in email links. Set VCHAT_PUBLIC_URL in .env (e.g. https://vchat.example.com).
    const baseUrl = (req) => (env.VCHAT_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

    // Must match what parseRoute() in the client expects for a meeting link.
    const roomLink = (req, room) => `${baseUrl(req)}/#/meeting/${room}`;

    const sendFailed = (res, result) => {
        logger.error(`FEAR vchat :: email failed :: ${result && result.message}`);
        return res.status(502).json({ error: 'email could not be sent' });
    };

    // Welcome email. Sent to the signed-in user's own address; admins may pass { email } for someone else.
    router.post('/email/welcome', requireUser, async (req, res) => {
        const user = req.vchatUser;
        const isAdmin = Array.isArray(user.roles) ? user.roles.includes('admin') : user.role === 'admin';
        const to = String((isAdmin && req.body.email) || user.email || '').trim();

        if (!EMAIL_PATTERN.test(to)) return res.status(400).json({ error: 'no valid email address for this account' });

        try {
            const mail = getMailer();
            const firstName = String((isAdmin && req.body.firstName) || user.displayName || '').split(' ')[0];
            const result = await mail.sendEmail({
                to,
                from: 'fear.dread@underworld.dog',
                subject: 'Welcome to V-CHAT',
                html: mail.templates.vchatWelcome({ firstName, appUrl: baseUrl(req) }),
                text: `Welcome to V-CHAT${firstName ? `, ${firstName}` : ''}! Your account is live. Start a call: ${baseUrl(req)}`,
            });

            if (!result.success) return sendFailed(res, result);
            res.json({ ok: true });
        } catch (err) {
            logger.error(`FEAR vchat :: welcome email error :: ${err.message}`);
            res.status(500).json({ error: 'email could not be sent' });
        }
    });

    // Invitation email. The link and inviter name are built server-side so they can't be spoofed.
    // Body: { email, room, message?, scheduledFor?, roomName? }
    router.post('/email/invite', requireUser, async (req, res) => {
        const user = req.vchatUser;
        const { email, room, message, scheduledFor, roomName } = req.body || {};
        const to = String(email || '').trim();

        if (!EMAIL_PATTERN.test(to)) return res.status(400).json({ error: 'valid email required' });
        if (!ROOM_PATTERN.test(String(room || ''))) return res.status(400).json({ error: 'invalid room' });
        if (!allowInvite(user.id)) return res.status(429).json({ error: 'invite limit reached, try again later' });

        try {
            const mail = getMailer();
            const inviterName = user.displayName || 'A V-CHAT user';
            const roomUrl = roomLink(req, room);
            const msg = message ? String(message).slice(0, 500) : undefined;

            const result = await mail.sendEmail({
                to,
                from: 'fear.dread@underworld.dog',
                subject: `${inviterName} invited you to a V-CHAT call`,
                html: mail.templates.vchatInvite({
                    inviterName,
                    roomUrl,
                    roomName: roomName ? String(roomName).slice(0, 80) : undefined,
                    message: msg,
                    scheduledFor: scheduledFor ? String(scheduledFor).slice(0, 100) : undefined,
                }),
                text: `${inviterName} invited you to a V-CHAT call.${msg ? `\n\n${msg}` : ''}\n\nJoin: ${roomUrl}`,
            });

            if (!result.success) return sendFailed(res, result);
            logger.info(`FEAR vchat :: invite sent :: room ${room} :: user ${user.id}`);
            res.json({ ok: true });
        } catch (err) {
            logger.error(`FEAR vchat :: invite email error :: ${err.message}`);
            res.status(500).json({ error: 'email could not be sent' });
        }
    });

    return router;
};