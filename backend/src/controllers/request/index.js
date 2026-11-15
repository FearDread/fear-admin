/**
 * controllers/response/index.js
 */
const TokenService = require('../auth/token');

const isDev = () => process.env.NODE_ENV === 'development';

/** Auth responses carry a user + cookie: never let a browser/nginx/CDN cache them. */
const noStore = (res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.vary('Cookie');
};

/** Regular envelope. `count` is added automatically for arrays. */
const send = (res, status = 200, result = null, message = '', extra = {}) =>
    res.status(status).json({
        success: status < 400,
        message,
        result,
        ...(Array.isArray(result) ? { count: result.length } : {}),
        ...extra,
    });

const ok = (res, result, message = '') => send(res, 200, result, message);
const created = (res, result, message = '') => send(res, 201, result, message);

/** Paginated list: list(res, docs, { currentPage, totalPages, ... }) */
const list = (res, result, pagination, message = '') =>
    send(res, 200, result, message, pagination ? { pagination } : {});

/**
 * Error envelope.
 *   fail(res, 404, 'Not found')
 *   fail(res, 400, 'Validation failed', { email: ['Invalid'] })   → errors   (plain object, shown to the client)
 *   fail(res, 500, 'Could not save', err)                         → error    (Error/string, development only)
 */
const fail = (res, status = 500, message = 'Something went wrong', detail = null) => {
    const body = { success: false, message };

    if (detail instanceof Error || typeof detail === 'string') {
        if (isDev()) body.error = detail instanceof Error ? detail.message : detail;
    } else if (detail && typeof detail === 'object') {
        body.errors = detail;
    }

    return res.status(status).json(body);
};

/** Login / register / google / refresh: sets the jwt cookie and returns { user, token }. */
const auth = (res, user, token, status = 200, message = 'Authentication successful') => {
    noStore(res);
    const envelope = { user: user.toJSON(), token };

    return res
        .status(status)
        .cookie('jwt', token, TokenService.getCookieOptions())
        .json({ success: true, message, result: envelope, data: envelope, envelope });
};

/** /auth/me and /auth/session. Pass null for an anonymous visitor. */
const me = (res, user = null, message = '') => {
    noStore(res);
    const payload = { user: user ? user.toJSON() : null };

    return res.status(200).json({
        success: true,
        message,
        authenticated: Boolean(user),
        result: payload,
        data: payload,
    });
};

/** Clears the jwt cookie with the same attributes it was set with. */
const logout = (res, message = 'Logout successful') => {
    noStore(res);
    // eslint-disable-next-line no-unused-vars
    const { maxAge, expires, ...cookieOpts } = TokenService.getCookieOptions();
    return res.status(200).clearCookie('jwt', cookieOpts).json({ success: true, message });
};

auth.success = auth;
auth.fail = fail;

module.exports = {
    send, ok, created, list, fail, auth, me, logout, noStore,
    success: ok,
    fear: { success: send, fail },
    AuthResponse: { success: auth, error: fail },
};