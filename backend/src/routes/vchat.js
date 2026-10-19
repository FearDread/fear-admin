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
    let mail = null;
    const router = fear.createRouter();
    const logger = fear.getLogger();
    const handler = fear.getHandler();
    const env = fear.getEnvironment() || {};

    const baseUrl = (req) => (env.VCHAT_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    const roomLink = (req, room) => `${baseUrl(req)}/?room=${room}`;
    const sendFailed = (res, result) => res.status(502).json({ error: 'email could not be sent' });
    

    mail = fear.getMailer() || require('../libs/emailer/smtp');

    router.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
    router.post('/logout', Auth.logout);
    router.get('/session', optionalUser, handler.async(Vchat.session));
    router.get('/config', requireUser, handler.async(Vchat.config));
    router.get('/token', requireUser, handler.async(Vchat.token));
    router.post('/rooms', requireUser, handler.async(Vchat.createRoom));
    router.get('/rooms/:room', requireUser, handler.async(Vchat.getRoom));

    // Lists every room and participant name: admins only.
    router.get('/stats', requireUser, Auth.authorizeRoles('admin'), handler.async(Vchat.stats)); 

    // email routes
    router.post('/email/welcome', requireUser, async (req, res) => {
        const user = req.vchatUser;
        const isAdmin = Array.isArray(user.roles) ? user.roles.includes('admin') : user.role === 'admin';
        const to = String((isAdmin && req.body.email) || user.email || '').trim();

        if (!EMAIL_PATTERN.test(to)) return res.status(400).json({ error: 'no valid email address for this account' });

        try {
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

    router.post('/email/invite', requireUser, async (req, res) => {
        const user = req.vchatUser;
        const { email, room, message, scheduledFor, roomName } = req.body || {};
        const to = String(email || '').trim();

        if (!EMAIL_PATTERN.test(to)) return res.status(400).json({ error: 'valid email required' });
        if (!ROOM_PATTERN.test(String(room || ''))) return res.status(400).json({ error: 'invalid room' });
        if (!allowInvite(user.id)) return res.status(429).json({ error: 'invite limit reached, try again later' });

        try {
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