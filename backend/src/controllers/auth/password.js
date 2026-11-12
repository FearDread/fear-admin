'use strict';

const crypto = require('crypto');
const User = require('../../models/user');
const TokenService = require('./token');

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const RESET_EXPIRES_IN = '10 minutes'; // keep in sync with createPasswordResetToken()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same answer whether or not the email has an account (anti-enumeration).
const FORGOT_MESSAGE = 'If an account exists for that email, a reset link has been sent.';

const response = {
    success: (res, data, statusCode = 200, message = 'Operation successful') => {
        return res.status(statusCode).json({ success: true, message, data, result: data });
    },

    error: (res, statusCode, message, error = null) => {
        const responseObj = { success: false, message };
        if (error && process.env.NODE_ENV === 'development') {
            responseObj.error = error;
        }
        return res.status(statusCode).json(responseObj);
    }
};

// Recovery responses must never be cached by browsers, proxies or the CDN.
const noStore = (res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getFrontendOrigin = () => {
    const origin =
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'https://efear.shop';

    return origin ? origin.replace(/\/+$/, '') : null;
};

const passwordProblem = (password) => {
    if (typeof password !== 'string' || !password) return 'New password is required';
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (password.length > MAX_PASSWORD_LENGTH) return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
    return null;
};

/**
 * The auth controller's login uses user.comparePassword(); this file used
 * user.isPasswordMatched(). Whichever your User model actually defines is used,
 * so one of them can't silently 500 the change-password endpoint.
 */
const matchPassword = (user, plain) => {
    if (typeof user.comparePassword === 'function') return user.comparePassword(plain);
    if (typeof user.isPasswordMatched === 'function') return user.isPasswordMatched(plain);
    throw new Error('User model defines neither comparePassword nor isPasswordMatched');
};

// mailService.sendEmail() resolves `{ success: false }` instead of rejecting.
const assertSent = (result) => {
    if (result && result.success === false) {
        throw new Error(result.message || 'Email provider rejected the message');
    }
    return result;
};

// Never rejects: callers fire it without awaiting.
const sendPasswordChangedEmail = (req, user) =>
    Promise.resolve()
        .then(() => {
            const mailService = req.app.get('fear').getMailer();
            return mailService.sendEmail({
                to: user.email,
                subject: 'Password Changed Successfully',
                html: mailService.templates.passwordResetSuccessTemplate(user.email),
                text: mailService.templates.generatePlainText({ email: user.email }, 'passwordResetSuccess')
            });
        })
        .then(assertSent)
        .catch((emailError) => {
            console.error('Failed to send password-changed confirmation email:', emailError);
        });

/**
 * Stamp "password changed" one second in the past. auth.isAuthorized rejects
 * any JWT whose `iat` is earlier than this, so every session issued before the
 * change dies. Requires `passwordChangedAt: Date` on the User schema (ignored
 * silently by Mongoose strict mode if the field doesn't exist).
 */
const stampPasswordChanged = (user) => {
    user.passwordChangedAt = new Date(Date.now() - 1000);
};

// PUT /auth/update-password  (route must run Auth.isAuthorized first)
exports.updatePassword = (req, res) => {
    noStore(res);

    const userId = req.user && req.user._id;
    if (!userId) {
        return response.error(res, 401, 'Not authenticated');
    }

    const { currentPassword, newPassword } = req.body || {};

    if (typeof currentPassword !== 'string' || !currentPassword || typeof newPassword !== 'string' || !newPassword) {
        return response.error(res, 400, 'Current password and new password are required');
    }

    const problem = passwordProblem(newPassword);
    if (problem) {
        return response.error(res, 400, problem);
    }

    if (currentPassword === newPassword) {
        return response.error(res, 400, 'New password must be different from the current password');
    }

    // `+password`: the field is normally excluded from queries (login selects it
    // explicitly). Without it the comparison runs against undefined.
    return User.findById(userId)
        .select('+password')
        .then((user) => {
            if (!user) {
                return response.error(res, 404, 'User not found');
            }

            return Promise.resolve(matchPassword(user, currentPassword)).then((isMatch) => {
                if (!isMatch) {
                    return response.error(res, 401, 'Current password is incorrect');
                }

                user.password = newPassword;
                stampPasswordChanged(user);

                return user.save().then(() => {
                    sendPasswordChangedEmail(req, user); // intentionally not awaited

                    // Old sessions are now stale; give THIS browser a fresh cookie so
                    // changing your password doesn't log you out of the tab you're in.
                    const token = TokenService.generateToken(user);
                    res.cookie('jwt', token, TokenService.getCookieOptions());

                    return response.success(res, { updated: true }, 200, 'Password updated successfully');
                });
            });
        })
        .catch((error) => {
            console.error('[password] update failed:', error);
            if (res.headersSent) return null;
            return response.error(res, 500, 'Error updating password', error.message);
        });
};

// POST /auth/forgot-password
exports.forgotPasswordToken = (req, res) => {
    noStore(res);

    const rawEmail = req.body && req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
        return response.error(res, 400, 'A valid email is required');
    }

    const origin = getFrontendOrigin();
    if (!origin) {
        console.error('[password] FRONTEND_URL must be set to build password reset links');
        return response.error(res, 500, 'Password reset is temporarily unavailable');
    }

    let mailService;
    try {
        mailService = req.app.get('fear').getMailer();
    } catch (err) {
        console.error('[password] mailer unavailable:', err);
        return response.error(res, 500, 'Password reset is temporarily unavailable');
    }

    // Reply first, work after: identical status/body/timing for known and
    // unknown emails, so this can't be used to enumerate accounts.
    response.success(res, { expiresIn: RESET_EXPIRES_IN }, 200, FORGOT_MESSAGE);

    let foundUser = null;

    return User.findOne({ email, status: { $nin: ['deleted', 'suspended'] } })
        .then((user) => {
            if (!user) return null;
            foundUser = user;

            return Promise.resolve(user.createPasswordResetToken())
                .then((token) => user.save({ validateBeforeSave: false }).then(() => token))
                .then((token) => {
                    const resetURL = `${origin}/reset-password/${encodeURIComponent(token)}`;

                    return mailService.sendEmail({
                        to: user.email,
                        subject: 'Password Reset Request',
                        html: mailService.templates.passwordResetTemplate(resetURL, user.email),
                        text: mailService.templates.generatePlainText({ resetURL, email: user.email }, 'passwordReset')
                    }).then(assertSent);
                });
        })
        .catch((error) => {
            console.error('[password] forgot-password failed:', error);

            // Token issued but email didn't go out: clear it.
            if (!foundUser) return null;

            foundUser.passwordResetToken = undefined;
            foundUser.passwordResetExpires = undefined;
            return foundUser.save({ validateBeforeSave: false }).catch((cleanupError) => {
                console.error('[password] failed to clear reset token:', cleanupError);
            });
        });
};

// POST /auth/reset-password/:token
exports.resetPassword = (req, res) => {
    noStore(res);

    const { token } = req.params;
    const password = req.body && req.body.password;

    if (typeof token !== 'string' || !token) {
        return response.error(res, 400, 'Reset token is required');
    }

    const problem = passwordProblem(password);
    if (problem) {
        return response.error(res, 400, problem);
    }

    return User.findOne({
        passwordResetToken: hashToken(token),
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid. Please request a new link');
            }

            user.password = password;
            user.passwordResetToken = undefined; // single use
            user.passwordResetExpires = undefined;
            stampPasswordChanged(user); // kills any session an attacker may hold

            return user.save().then(() => {
                sendPasswordChangedEmail(req, user); // intentionally not awaited

                // No user object, no cookie, no auto-login: the storefront sends the
                // person to /login. Also clear any stale cookie in THIS browser.
                // eslint-disable-next-line no-unused-vars
                const { maxAge, expires, ...cookieOpts } = TokenService.getCookieOptions();
                res.clearCookie('jwt', cookieOpts);

                return response.success(res, { reset: true }, 200, 'Password reset successfully');
            });
        })
        .catch((error) => {
            console.error('[password] reset failed:', error);
            if (res.headersSent) return null;
            return response.error(res, 500, 'Error resetting password', error.message);
        });
};

// GET /auth/verify-reset-token/:token: the reset page calls this before showing the form
exports.verifyResetToken = (req, res) => {
    noStore(res);

    const { token } = req.params;

    if (typeof token !== 'string' || !token) {
        return response.error(res, 400, 'Reset token is required');
    }

    return User.findOne({
        passwordResetToken: hashToken(token),
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            // BUG FIX: this used to be `if (!user) response.error(...)` with no
            // `return`, so it sent the 400 and then crashed on `user.email`, whose
            // catch tried to send a second response ("headers already sent").
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid');
            }

            return response.success(
                res,
                { valid: true, email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') },
                200,
                'Token is valid'
            );
        })
        .catch((error) => {
            console.error('[password] verify token failed:', error);
            if (res.headersSent) return null;
            return response.error(res, 500, 'Error verifying token', error.message);
        });
};