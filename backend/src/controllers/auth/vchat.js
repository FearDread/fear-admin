/**
 * vchat auth :: one identity source for REST routes and the signaling WebSocket.
 *
 * Identity is the JWT your auth controller already issues (httpOnly `jwt` cookie, or a
 * Bearer header for native clients). Nothing here relies on express-session/passport.
 * Drop at: backend/src/controllers/auth/vchat.js
 * Built once by FEAR (see setupVchatAuth) and reached everywhere as fear.getVchatAuth() / fear.vchatAuth.
 */
const crypto = require('crypto');
const User = require('../../models/user');
const TokenService = require('./token');

const BLOCKED_STATUS = new Set(['deleted', 'suspended', 'inactive']); // same set isAuthorized rejects

let env = process.env; // replaced with FEAR's parsed .env by the factory at the bottom

// ----------------------------------------------------------------- identity

// WebSocket upgrade requests never pass through cookie-parser, so parse the header here.
function parseCookies(header = '') {
    const out = Object.create(null);

    header.split(';').forEach((part) => {
        const i = part.indexOf('=');
        if (i < 0) return;

        const name = part.slice(0, i).trim();
        if (!name || name in out) return;

        let value = part.slice(i + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);

        try {
            out[name] = decodeURIComponent(value);
        } catch (err) {
            out[name] = value;
        }
    });

    return out;
}

function readJwt(req) {
    const cookies = parseCookies(req.headers && req.headers.cookie);
    if (cookies.jwt) return cookies.jwt;

    const auth = req.headers && req.headers.authorization;
    return auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

function toIdentity(user) {
    return {
        id: String(user._id),
        role: user.role || 'user',
        displayName: user.displayName || user.firstName || null,
        doc: user,
    };
}

async function userById(id) {
    const user = await User.findById(id);
    return user && !BLOCKED_STATUS.has(user.status) ? toIdentity(user) : null;
}

/** Resolves to an identity, or null. Never throws for a bad/expired/absent token. */
async function userFromRequest(req) {
    const token = readJwt(req);
    if (!token) return null;

    let claims;
    try {
        claims = TokenService.verifyToken(token);
    } catch (err) {
        return null;
    }

    const identity = await userById(claims.id);
    if (!identity) return null;

    // Stateless JWTs outlive a password change. If the model records passwordChangedAt,
    // refuse tokens issued before it. (No-op until the model sets that field.)
    const changed = identity.doc.passwordChangedAt;
    if (changed && claims.iat * 1000 < new Date(changed).getTime()) return null;

    return identity;
}

// --------------------------------------------------------------- middleware

const requireUser = (req, res, next) => {
    userFromRequest(req)
        .then((identity) => {
            if (!identity) return res.status(401).json({ success: false, message: 'Authentication required' });

            req.vchatUser = identity;
            req.user = identity.doc; // so Auth.authorizeRoles / Password.updatePassword work unchanged
            next();
        })
        .catch(next);
};

const optionalUser = (req, res, next) => {
    userFromRequest(req)
        .then((identity) => {
            req.vchatUser = identity;
            next();
        })
        .catch(() => {
            req.vchatUser = null;
            next();
        });
};

/**
 * Auth.login returns the JWT in the JSON body *and* the cookie. The SPA only needs the
 * cookie, and a token in the body is readable by any script on the page, so strip it.
 */
const withoutToken = (req, res, next) => {
    const json = res.json.bind(res);

    res.json = (body) => {
        if (body && typeof body === 'object') {
            ['result', 'data'].forEach((key) => {
                if (body[key] && body[key].token) {
                    body[key] = { ...body[key] };
                    delete body[key].token;
                }
            });
        }
        return json(body);
    };

    next();
};

// ------------------------------------------------------------ login limiter

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const attempts = new Map(); // ip -> { count, since }

setInterval(() => {
    const now = Date.now();
    attempts.forEach((entry, ip) => {
        if (now - entry.since > LOGIN_WINDOW_MS) attempts.delete(ip);
    });
}, LOGIN_WINDOW_MS).unref();

/**
 * Counts failed logins per IP; a success clears the count. Per-account lockout already
 * lives in the User model — this stops one IP spraying many accounts.
 * Behind nginx, call app.set('trust proxy', 1) or every user shares nginx's IP.
 */
const loginLimiter = (req, res, next) => {
    const now = Date.now();
    let entry = attempts.get(req.ip);

    if (!entry || now - entry.since > LOGIN_WINDOW_MS) {
        entry = { count: 0, since: now };
        attempts.set(req.ip, entry);
    }

    if (entry.count >= LOGIN_LIMIT) {
        res.set('Retry-After', String(Math.ceil((entry.since + LOGIN_WINDOW_MS - now) / 1000)));
        return res.status(429).json({ success: false, message: 'Too many sign-in attempts. Try again in a few minutes.' });
    }

    res.on('finish', () => {
        if (res.statusCode >= 400) entry.count += 1;
        else attempts.delete(req.ip);
    });

    next();
};

// -------------------------------------------------------- socket handoff token

const HANDOFF_TTL_MS = 120000;
const HANDOFF_AUD = 'vchat-ws';
const spent = new Map(); // jti -> exp, for single use

function handoffKey() {
    const secret = env.SESSION_SECRET || env.JWT_SECRET;
    if (!secret) throw new Error('SESSION_SECRET or JWT_SECRET is required for handoff tokens');
    return secret;
}

// Prefixing the signed bytes keeps this HMAC from ever validating as something else.
const sign = (b64) => crypto.createHmac('sha256', handoffKey()).update(`vchat-handoff.${b64}`).digest();

/**
 * For connecting through a different origin (fallback tunnel) where the jwt cookie is not
 * sent. Short-lived, single-use, only accepted by the WebSocket upgrade, never by REST.
 */
function mintHandoff(userId) {
    const payload = {
        uid: userId,
        aud: HANDOFF_AUD,
        jti: crypto.randomBytes(12).toString('base64url'),
        exp: Date.now() + HANDOFF_TTL_MS,
    };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

    return { token: `${b64}.${sign(b64).toString('base64url')}`, expiresAt: payload.exp };
}

function verifyHandoff(token) {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 2) return null;

    let given;
    let expected;
    try {
        given = Buffer.from(parts[1], 'base64url');
        expected = sign(parts[0]);
    } catch (err) {
        return null;
    }
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;

    let payload;
    try {
        payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    } catch (err) {
        return null;
    }

    const now = Date.now();
    if (payload.aud !== HANDOFF_AUD || !payload.uid || !payload.jti || typeof payload.exp !== 'number' || now > payload.exp) {
        return null;
    }

    spent.forEach((exp, jti) => {
        if (exp < now) spent.delete(jti);
    });
    if (spent.has(payload.jti)) return null; // replay
    spent.set(payload.jti, payload.exp);

    return payload;
}

/** Plugged into FearSignal as options.authenticate. Cookie wins; token is the fallback. */
async function authenticateSocket(req, token) {
    const viaCookie = await userFromRequest(req);
    if (viaCookie) return { userId: viaCookie.id, displayName: viaCookie.displayName, via: 'cookie' };

    const claim = verifyHandoff(token);
    if (!claim) return null;

    const viaToken = await userById(claim.uid); // re-check status: the account may have been suspended since
    return viaToken ? { userId: viaToken.id, displayName: viaToken.displayName, via: 'handoff' } : null;
}

const api = {
    parseCookies,
    userFromRequest,
    requireUser,
    optionalUser,
    withoutToken,
    loginLimiter,
    mintHandoff,
    verifyHandoff,
    authenticateSocket,
};

/**
 * Factory used by FEAR:  this.vchatAuth = require('./controllers/auth/vchat')(this);
 * The same helpers are also attached to the factory itself for direct imports and tests.
 */
module.exports = function createVchatAuth(fear) {
    const parsed = (fear && typeof fear.getEnvironment === 'function' && fear.getEnvironment()) || {};
    env = { ...process.env, ...parsed };
    return api;
};

Object.assign(module.exports, api);
