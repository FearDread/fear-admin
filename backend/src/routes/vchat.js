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

    router.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    router.post('/logout', Auth.logout);
    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
    router.post('/register', loginLimiter, withoutToken, handler.async(Auth.register));
    router.get('/session', optionalUser, handler.async(Vchat.session));
    router.get('/config', requireUser, handler.async(Vchat.config));
    router.get('/token', requireUser, handler.async(Vchat.token));
    router.post('/rooms', requireUser, handler.async(Vchat.createRoom));
    router.get('/rooms/:room', requireUser, handler.async(Vchat.getRoom));
    router.get('/stats', requireUser, Auth.authorizeRoles('admin'), handler.async(Vchat.stats)); 

    // email routes
    router.post('/email/welcome', requireUser, handler.async(Vchat.sendWelcome));
    router.post('/email/invite', requireUser, handler.async(Vchat.sendInvite));

    return router;
};