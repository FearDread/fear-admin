'use strict';

const crypto = require('crypto');
const User = require('../../models/user');
const TokenService = require('./token');
const response = require('../request');

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const RESET_EXPIRES_MINUTES = 10; // passed to createPasswordResetToken(), so the two can't drift apart
const RESET_EXPIRES_IN = `${RESET_EXPIRES_MINUTES} minutes`;
const RESET_COOLDOWN_MS = 60 * 1000; // at most one reset email per account per minute
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same answer whether or not the email has an account (anti-enumeration).
const FORGOT_MESSAGE = 'If an account exists for that email, a reset link has been sent.';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getFrontendOrigin = () =>
    (process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://efear.shop').replace(/\/+$/, '');

const passwordProblem = (password) => {
    if (typeof password !== 'string' || !password) return 'New password is required';
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (password.length > MAX_PASSWORD_LENGTH) return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
    return null;
};

/* ----- small helpers for the emails ----- */

// Names come from the user's own profile and go into HTML templates unescaped.
const escapeHtml = (value) =>
    String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const firstNameOf = (user) => user.firstName || String(user.displayName || '').split(' ')[0] || 'there';

const formatDate = (date) =>
    `${date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC`;

// "jo***@example.com". Also safe for one-character names.
const maskEmail = (email) => {
    const [name, domain = ''] = String(email).split('@');
    return `${name.slice(0, 2)}***@${domain}`;
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

const sendResetEmail = (mailService, user, resetUrl) =>
    mailService.sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: mailService.templates.passwordReset({
            firstName: escapeHtml(firstNameOf(user)),
            email: escapeHtml(user.email),
            expiresAt: formatDate(user.passwordResetExpires),
            expiresIn: RESET_EXPIRES_IN,
            resetUrl
        }),
        text:
            `Hi ${firstNameOf(user)},\n\n` +
            `Use this link to reset your eFear password. It expires in ${RESET_EXPIRES_IN}:\n\n${resetUrl}\n\n` +
            `If you didn't request this, you can ignore this email.`
    }).then(assertSent);

// Never rejects: callers fire it without awaiting.
const sendPasswordChangedEmail = (req, user) =>
    Promise.resolve()
        .then(() => {
            const mailService = req.app.get('fear').getMailer();
            return mailService.sendEmail({
                to: user.email,
                subject: 'Password Changed Successfully',
                html: mailService.templates.passwordChanged({
                    firstName: escapeHtml(firstNameOf(user)),
                    email: escapeHtml(user.email),
                    changedAt: formatDate(new Date())
                }),
                text:
                    `Hi ${firstNameOf(user)},\n\nThe password for your eFear account was just changed. ` +
                    `If this wasn't you, reset your password right away and contact support.`
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

// PUT /update-password  (route must run Auth.isAuthorized first)
exports.updatePassword = (req, res) => {
    response.noStore(res);

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


// POST /forgot-password
exports.forgotPasswordToken = (req, res) => {
    response.noStore(res);

    const rawEmail = req.body && req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
        return response.error(res, 400, 'A valid email is required');
    }

    const origin = getFrontendOrigin();

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

            // A link went out seconds ago: don't let this endpoint be used to flood someone's inbox.
            const issuedAt = user.passwordResetExpires
                ? user.passwordResetExpires.getTime() - RESET_EXPIRES_MINUTES * 60 * 1000
                : 0;
            if (Date.now() - issuedAt < RESET_COOLDOWN_MS) return null;

            foundUser = user;
            const token = user.createPasswordResetToken(RESET_EXPIRES_MINUTES);

            return user.save({ validateBeforeSave: false })
                .then(() => sendResetEmail(mailService, user, `${origin}/reset-password/${token}`));
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

// POST /reset-password/:token
exports.resetPassword = (req, res) => {
    response.noStore(res);

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
            // Someone locked out by failed logins is exactly who uses this flow
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            stampPasswordChanged(user); // kills any session an attacker may hold

            return user.save().then(() => {
                sendPasswordChangedEmail(req, user); // intentionally not awaited

                // No user object, no cookie, no auto-login: the page sends the person to
                // sign in. Also clear any stale cookie in THIS browser.
                res.clearCookie('jwt', TokenService.getClearCookieOptions());

                return response.success(res, { reset: true }, 200, 'Password reset successfully');
            });
        })
        .catch((error) => {
            console.error('[password] reset failed:', error);
            if (res.headersSent) return null;
            return response.error(res, 500, 'Error resetting password', error.message);
        });
};

// GET /verify-reset-token/:token: the reset page calls this before showing the form
exports.verifyResetToken = (req, res) => {
    response.noStore(res);

    const { token } = req.params;

    if (typeof token !== 'string' || !token) {
        return response.error(res, 400, 'Reset token is required');
    }

    return User.findOne({
        passwordResetToken: hashToken(token),
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid');
            }

            return response.success(res, { valid: true, email: maskEmail(user.email) }, 200, 'Token is valid');
        })
        .catch((error) => {
            console.error('[password] verify token failed:', error);
            if (res.headersSent) return null;
            return response.error(res, 500, 'Error verifying token', error.message);
        });
};