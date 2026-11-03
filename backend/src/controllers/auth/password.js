'use strict';

const crypto = require('crypto');
const User = require('../../models/user');
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const RESET_EXPIRES_IN = '10 minutes'; // keep in sync with createPasswordResetToken()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same answer whether or not the email has an account (anti-enumeration).
const FORGOT_MESSAGE = 'If an account exists for that email, a reset link has been sent.';

// Response helper
const response = {
    success: (res, data, statusCode = 200, message = 'Operation successful') => {
        return res.status(statusCode).json({ success: true, message, data });
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

/**
 * Where the *storefront* lives (the Next.js app), used to build the link in
 * the reset email. Returns null if nothing is configured.
 *
 * Never build this from req.get('host'): that header is attacker-controlled,
 * so anyone could request a reset for a victim with a forged Host and the
 * victim would receive a legitimate email linking to the attacker's domain
 * (host-header poisoning). It's also wrong behind the Next proxy, where Host
 * is the backend (:4000), not the storefront.
 */
const getFrontendOrigin = () => {
    const origin =
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.HTTPS_DOMAIN ? `https://${process.env.HTTPS_DOMAIN}` : null);

    return origin ? origin.replace(/\/+$/, '') : null;
};

const passwordProblem = (password) => {
    if (typeof password !== 'string' || !password) return 'New password is required';
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (password.length > MAX_PASSWORD_LENGTH) return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
    return null;
};

// mailService.sendEmail() resolves `{ success: false }` (it does not reject) when
// the provider refuses the message, so a bare .then() would treat a failed send
// as success. Turn that into a rejection so callers' .catch() actually runs.
const assertSent = (result) => {
    if (result && result.success === false) {
        throw new Error(result.message || 'Email provider rejected the message');
    }
    return result;
};

// "Your password changed" notice. Returns a promise that never rejects, so
// callers can fire it without awaiting and a mail failure can't fail a request.
const sendPasswordChangedEmail = (req, user) =>
    Promise.resolve()
        .then(() => {
            const mailService = req.app.get('mailer');
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

// Update password for authenticated user (route must run Auth.isAuthorized first)
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

    // Each branch returns its own response *inside* its own .then, so nothing
    // is chained after an early response (the previous version fell through to
    // the next .then with `res` as its value and tried to respond twice).
    return User.findById(userId)
        .then((user) => {
            if (!user) {
                return response.error(res, 404, 'User not found');
            }

            return Promise.resolve(user.isPasswordMatched(currentPassword)).then((isMatch) => {
                if (!isMatch) {
                    return response.error(res, 401, 'Current password is incorrect');
                }

                user.password = newPassword;
                return user.save().then(() => {
                    sendPasswordChangedEmail(req, user); // intentionally not awaited
                    return response.success(res, { updated: true }, 200, 'Password updated successfully');
                });
            });
        })
        .catch((error) => {
            return response.error(res, 500, 'Error updating password', error.message);
        });
};

// Request password reset token
exports.forgotPasswordToken = (req, res) => {
    noStore(res);

    const rawEmail = req.body && req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
        return response.error(res, 400, 'A valid email is required');
    }

    const origin = getFrontendOrigin();
    if (!origin) {
        console.error('[password] FRONTEND_URL (or HTTPS_DOMAIN) must be set to build password reset links');
        return response.error(res, 500, 'Password reset is temporarily unavailable');
    }

    const mailService = req.app.get('mailService');

    // Answer immediately and do the lookup/email work afterwards: the response
    // (status, body AND timing) is identical for known and unknown emails, so
    // this endpoint can't be used to discover which emails have accounts.
    // Trade-off: mail/DB failures are logged rather than returned to the client.
    response.success(res, { expiresIn: RESET_EXPIRES_IN }, 200, FORGOT_MESSAGE);

    let foundUser = null;

    return User.findOne({ email })
        .then((user) => {
            if (!user) return null;
            foundUser = user;

            return Promise.resolve(user.createPasswordResetToken())
                // The token fields are the only change; don't let unrelated schema
                // validation on old accounts block a reset.
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

            // If the token was issued but the email didn't go out, clear it.
            if (!foundUser) return null;

            foundUser.passwordResetToken = undefined;
            foundUser.passwordResetExpires = undefined;
            return foundUser.save({ validateBeforeSave: false }).catch((cleanupError) => {
                console.error('[password] failed to clear reset token:', cleanupError);
            });
        });
};

// Reset password with token
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

            // Update password and burn the token (single use)
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            // If your schema tracks it, also stamp passwordChangedAt here and have
            // Auth.isAuthorized reject sessions issued before it — a reset should
            // log out any session an attacker might already hold.

            return user.save().then(() => {
                sendPasswordChangedEmail(req, user); // intentionally not awaited

                // Deliberately no user object and no auto-login: the storefront
                // sends the person to /login after a reset.
                return response.success(res, { reset: true }, 200, 'Password reset successfully');
            });
        })
        .catch((error) => {
            return response.error(res, 500, 'Error resetting password', error.message);
        });
};

// Verify reset token validity — called by the reset page before showing the form
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
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid');
            }

            return response.success(
                res,
                {
                    valid: true,
                    email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // partially masked
                },
                200,
                'Token is valid'
            );
        })
        .catch((error) => {
            return response.error(res, 500, 'Error verifying token', error.message);
        });
};