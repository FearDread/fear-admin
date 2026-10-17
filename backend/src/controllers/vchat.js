const crypto = require('crypto');

const ROOM_PATTERN = /^[\w-]{1,64}$/;
const DEFAULT_STUN = 'stun:stun.l.google.com:19302';
const DEFAULT_SOCKET_PATH = '/fear/ws/vchat';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAIL_FROM = 'fear.dread@underworld.dog';

// Invites go to arbitrary addresses, so cap them per user (in-memory, per instance).
const INVITE_LIMIT = 10;
const INVITE_WINDOW_MS = 60 * 60 * 1000;
const inviteLog = new Map(); // userId -> [timestamps]

const allowInvite = (userId) => {
    const now = Date.now();
    const recent = (inviteLog.get(userId) || []).filter((t) => now - t < INVITE_WINDOW_MS);
    const allowed = recent.length < INVITE_LIMIT;

    if (allowed) recent.push(now);
    inviteLog.set(userId, recent);
    return allowed;
};

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

// ---------------------------------------------------------------- email

// Mailer from libs/smtp.js: use the instance FEAR already built (fear.mailer) or build it once.
// Adjust the require path to where smtp.js lives.
let mailer = null;
const getMailer = (req) => {
    if (!mailer) mailer = fearOf(req).mailer || require('../libs/smtp')(fearOf(req));
    return mailer;
};

// Public base URL for links in emails. Set VCHAT_PUBLIC_URL in .env (e.g. https://vchat.example.com).
const baseUrl = (req) => {
    const env = fearOf(req).getEnvironment() || {};
    return (env.VCHAT_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
};

// Must match what parseRoute() in the client expects for a meeting link.
const roomLink = (req, room) => `${baseUrl(req)}/#/meeting/${room}`;

const mailFailed = (req, res, detail) => {
    fearOf(req).getLogger().error(`FEAR vchat :: email failed :: ${detail}`);
    fail(res, 502, 'Email could not be sent');
};

// Welcome email, sent to the signed-in user's own address. Admins may pass { email, firstName }.
exports.sendWelcome = async (req, res) => {
    const user = req.vchatUser;
    const isAdmin = Array.isArray(user.roles) ? user.roles.includes('admin') : user.role === 'admin';
    const body = req.body || {};
    const to = String((isAdmin && body.email) || user.email || '').trim();

    if (!EMAIL_PATTERN.test(to)) return fail(res, 400, 'No valid email address for this account');

    try {
        const mail = getMailer(req);
        const firstName = String((isAdmin && body.firstName) || user.displayName || '').split(' ')[0];
        const appUrl = baseUrl(req);

        const result = await mail.sendEmail({
            to,
            from: MAIL_FROM,
            subject: 'Welcome to V-CHAT',
            html: mail.templates.vchatWelcome({ firstName, appUrl }),
            text: `Welcome to V-CHAT${firstName ? `, ${firstName}` : ''}! Your account is live. Start a call: ${appUrl}`,
        });

        if (!result.success) return mailFailed(req, res, result.message);
        res.json({ success: true, message: 'Welcome email sent' });
    } catch (error) {
        mailFailed(req, res, error.message);
    }
};

// Invitation email. Link and inviter name are built server-side so they can't be spoofed.
// Body: { email, room, message?, scheduledFor?, roomName? }
exports.sendInvite = async (req, res) => {
    const user = req.vchatUser;
    const { email, room, message, scheduledFor, roomName } = req.body || {};
    const to = String(email || '').trim();

    if (!EMAIL_PATTERN.test(to)) return fail(res, 400, 'Valid email required');
    if (!ROOM_PATTERN.test(String(room || ''))) return fail(res, 400, 'Invalid room');
    if (!allowInvite(user.id)) return fail(res, 429, 'Invite limit reached, try again later');

    try {
        const mail = getMailer(req);
        const inviterName = user.displayName || 'A V-CHAT user';
        const roomUrl = roomLink(req, room);
        const note = message ? String(message).slice(0, 500) : undefined;

        const result = await mail.sendEmail({
            to,
            from: MAIL_FROM,
            subject: `${inviterName} invited you to a V-CHAT call`,
            html: mail.templates.vchatInvite({
                inviterName,
                roomUrl,
                roomName: roomName ? String(roomName).slice(0, 80) : undefined,
                message: note,
                scheduledFor: scheduledFor ? String(scheduledFor).slice(0, 100) : undefined,
            }),
            text: `${inviterName} invited you to a V-CHAT call.${note ? `\n\n${note}` : ''}\n\nJoin: ${roomUrl}`,
        });

        if (!result.success) return mailFailed(req, res, result.message);

        fearOf(req).getLogger().info(`FEAR vchat :: invite sent :: room ${room} :: user ${user.id}`);
        res.json({ success: true, message: 'Invitation sent' });
    } catch (error) {
        mailFailed(req, res, error.message);
    }
};

module.exports = exports;