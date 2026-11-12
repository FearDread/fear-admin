const User = require("../../models/user");
const TokenService = require('./token');
const validator = require('../../libs/validator');
const logger = require('../../libs/logger');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Auth responses carry a user + cookie, so they must never be cached by the
 * browser, nginx or a CDN. A cached /auth/session is exactly how a logged-in
 * user gets told they're logged out (or vice versa).
 */
const noStore = (res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.vary('Cookie');
};

/**
 * True if the token was issued before the user's last password change.
 * No-op if the schema has no `passwordChangedAt` field.
 */
const isSessionStale = (user, decoded) => {
    if (!user.passwordChangedAt || !decoded || !decoded.iat) return false;
    return decoded.iat * 1000 < new Date(user.passwordChangedAt).getTime();
};

/**
 * Authentication response helper
 */
const response = {
    success: (res, user, token, statusCode = 200, message = "Authentication successful") => {
        noStore(res);
        // toJSON strips sensitive fields (password, reset tokens, ...)
        const userResponse = user.toJSON();
        const envelope = { user: userResponse, token };

        return res
            .status(statusCode)
            .cookie("jwt", token, TokenService.getCookieOptions())
            .json({
                success: true,
                message,
                envelope,
                data: envelope,
                result: envelope,
            });
    },

    error: (res, statusCode, message, error = null) => {
        const body = { success: false, message };
        if (error && process.env.NODE_ENV === "development") body.error = error;
        return res.status(statusCode).json(body);
    }
};

/**
 * POST /fear/api/auth/login
 */
exports.login = (req, res) => {
    const { email, password } = req.body;
    const validation = validator.input.login({ email, password });
    if (!validation.isValid) {
        return response.error(res, 400, validation.message);
    }

    logger.info('Authentication attempt for:', email);

    User.findOne({
        email: email.toLowerCase(),
        status: { $ne: 'deleted' }
    })
        .select('+password')
        .then(user => {
            if (!user) {
                return response.error(res, 401, "Invalid credentials");
            }

            if (user.isLocked()) {
                return response.error(res, 423,
                    "Account temporarily locked due to too many failed login attempts. Please try again later."
                );
            }

            if (user.status === 'suspended') {
                return response.error(res, 403, "Your account has been suspended. Please contact support.");
            }
            if (user.status === 'inactive') {
                return response.error(res, 403, "Your account is inactive. Please contact support to reactivate.");
            }

            return user.comparePassword(password)
                .then(isPasswordValid => {
                    if (!isPasswordValid) {
                        return user.incLoginAttempts()
                            .then(() => response.error(res, 401, "Invalid credentials"));
                    }

                    return user.resetLoginAttempts()
                        .then(() => user.updateOne({
                            lastLoginAt: new Date(),
                            lastLoginIP: req.ip || req.socket?.remoteAddress
                        }))
                        .then(() => {
                            const token = TokenService.generateToken(user);
                            return response.success(res, user, token, 200, "Login successful");
                        });
                });
        })
        .catch(error => {
            logger.error('Login error:', error);
            return response.error(res, 500, "Authentication failed", error.message);
        });
};

/**
 * POST /fear/api/auth/register
 * NOTE: this still sets the jwt cookie. The storefront deliberately sends the
 * person to /login afterwards, so a full page reload right after registering
 * will hydrate them as logged in. If you'd rather force an explicit login,
 * return a plain { success, message } here without the cookie.
 */
exports.register = (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        displayName,
        phoneNumber,
        dateOfBirth,
        ...otherFields
    } = req.body;

    const validation = validator.input.register({ email, password, firstName, lastName });
    if (!validation.isValid) {
        return response.error(res, 400, validation.message);
    }

    User.findOne({ email: email.toLowerCase() })
        .then(existingUser => {
            if (existingUser) {
                return response.error(res, 409, "User with this email already exists");
            }

            const userData = {
                email: email.toLowerCase(),
                password,
                firstName: firstName ? firstName.trim() : '',
                lastName: lastName ? lastName.trim() : '',
                displayName: displayName || `${firstName} ${lastName}`.trim() || email,
                mobile: phoneNumber || undefined,
                dateOfBirth: dateOfBirth || undefined,
                // Never trust a client-supplied role on public registration.
                role: 'user',
                status: 'active'
            };

            return User.create(userData);
        })
        .then(user => {
            // `user` is the express Response when the 409 branch already replied.
            if (!user || typeof user.toJSON !== 'function' || res.headersSent) return;

            logger.info('New user registered:', user.email);
            const token = TokenService.generateToken(user);
            return response.success(res, user, token, 201, "Registration successful");
        })
        .catch(error => {
            logger.error('Registration error:', error);

            if (error.code === 11000) {
                return response.error(res, 409, "User with this email already exists");
            }
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                return response.error(res, 400, messages.join(', '));
            }
            return response.error(res, 500, "Registration failed", error.message);
        });
};

/**
 * POST /fear/api/auth/logout
 * clearCookie only works if path/domain/sameSite/secure match what was used to
 * SET the cookie, so reuse TokenService's options (minus maxAge/expires).
 */
exports.logout = (req, res) => {
    noStore(res);
    // eslint-disable-next-line no-unused-vars
    const { maxAge, expires, ...cookieOpts } = TokenService.getCookieOptions();

    return res
        .status(200)
        .clearCookie('jwt', cookieOpts)
        .json({ success: true, message: "Logout successful" });
};

/**
 * GET /fear/api/auth/me   (mount behind isAuthorized)
 * 401 when anonymous; the storefront only calls this once it knows it's logged in.
 */
exports.getCurrentUser = (req, res) => {
    noStore(res);
    const userResponse = req.user.toJSON();
    return res.status(200).json({
        success: true,
        result: { user: userResponse },
        data: { user: userResponse }
    });
};

/**
 * GET /fear/api/auth/session   (mount behind optionalAuth, NOT isAuthorized)
 * Used by the storefront's AuthHydrator on every page load. Anonymous visitors
 * get a normal 200 with `user: null` instead of a 401 on every page view.
 */
exports.getSession = (req, res) => {
    noStore(res);
    const user = req.user ? req.user.toJSON() : null;
    return res.status(200).json({
        success: true,
        authenticated: Boolean(user),
        result: { user },
        data: { user }
    });
};

/**
 * PUT /fear/api/auth/refresh-token
 */
exports.refreshToken = (req, res) => {
    const newToken = TokenService.generateToken(req.user);
    return response.success(res, req.user, newToken, 200, "Token refreshed successfully");
};

/**
 * PUT /fear/api/auth/update-profile
 */
exports.updateProfile = (req, res) => {
    const { firstName, lastName, displayName, phoneNumber, phone, bio, dateOfBirth, avatar } = req.body;
    const mobile = phoneNumber !== undefined ? phoneNumber : phone;

    noStore(res);

    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return response.error(res, 404, "User not found");
            }

            if (typeof firstName === 'string' && firstName.trim()) user.firstName = firstName.trim();
            if (typeof lastName === 'string' && lastName.trim()) user.lastName = lastName.trim();
            if (typeof displayName === 'string') user.displayName = displayName.trim();
            // register() stores this as `mobile`; keep update consistent with it.
            if (mobile !== undefined) user.mobile = mobile;
            if (bio !== undefined) user.bio = bio;
            if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
            if (avatar !== undefined) user.avatar = avatar;

            return user.save();
        })
        .then(user => {
            if (!user || typeof user.toJSON !== 'function' || res.headersSent) return;

            const userResponse = user.toJSON();
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                result: { user: userResponse },
                data: { user: userResponse }
            });
        })
        .catch(error => {
            logger.error('Profile update error:', error);

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                return response.error(res, 400, messages.join(', '));
            }
            return response.error(res, 500, "Profile update failed", error.message);
        });
};

/**
 * PUT /fear/api/auth/update-preferences
 */
exports.updatePreferences = (req, res) => {
    const { language, timezone, notifications, theme } = req.body;

    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return response.error(res, 404, "User not found");
            }

            user.preferences = user.preferences || {};
            if (language) user.preferences.language = language;
            if (timezone) user.preferences.timezone = timezone;
            if (theme) user.preferences.theme = theme;
            if (notifications) {
                user.preferences.notifications = {
                    ...user.preferences.notifications,
                    ...notifications
                };
            }

            return user.save();
        })
        .then(user => {
            if (!user || typeof user.toJSON !== 'function' || res.headersSent) return;

            return res.status(200).json({
                success: true,
                message: "Preferences updated successfully",
                data: { preferences: user.preferences }
            });
        })
        .catch(error => {
            logger.error('Preferences update error:', error);
            return response.error(res, 500, "Preferences update failed", error.message);
        });
};

const getTokenFromRequest = (req) => {
    if (req.cookies?.jwt) return req.cookies.jwt;
    if (req.headers.authorization?.startsWith('Bearer ')) return req.headers.authorization.split(' ')[1];
    return null;
};

/**
 * Middleware: Verify JWT and attach req.user
 */
exports.isAuthorized = (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        return response.error(res, 401, "Access denied. Authentication required.");
    }

    let decodedToken;
    try {
        decodedToken = TokenService.verifyToken(token);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return response.error(res, 401, "Invalid token.");
        }
        if (error.name === 'TokenExpiredError') {
            return response.error(res, 401, "Token has expired. Please login again.");
        }
        logger.error('Authorization error:', error);
        return response.error(res, 500, "Authentication failed", error.message);
    }

    return User.findById(decodedToken.id)
        .then(user => {
            if (!user) {
                return response.error(res, 401, "Invalid token. User not found.");
            }
            if (user.status === 'deleted') {
                return response.error(res, 401, "Account has been deleted.");
            }
            if (user.status === 'suspended') {
                return response.error(res, 403, "Account has been suspended.");
            }
            if (user.status === 'inactive') {
                return response.error(res, 403, "Account is inactive.");
            }
            // A password change/reset should kill sessions issued before it.
            if (isSessionStale(user, decodedToken)) {
                return response.error(res, 401, "Password was changed. Please login again.");
            }

            req.user = user;
            req.token = token;
            return next();
        })
        .catch(error => {
            logger.error('Authorization error:', error);
            return response.error(res, 500, "Authentication failed", error.message);
        });
};

/**
 * Middleware: require admin role (run after isAuthorized)
 */
exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return response.error(res, 401, "Authentication required");
    }
    if (req.user.role !== "admin") {
        return response.error(res, 403, "Access denied. Admin privileges required.");
    }
    next();
};

/**
 * Middleware factory: require one of the given roles
 */
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return response.error(res, 401, "Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            return response.error(
                res,
                403,
                `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`
            );
        }
        next();
    };
};

/**
 * Middleware: optional authentication. Attaches req.user when a valid session
 * exists; otherwise continues anonymously (never errors).
 */
exports.optionalAuth = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) return next();

    let decodedToken;
    try {
        decodedToken = TokenService.verifyToken(token);
    } catch (error) {
        logger.debug('Optional auth failed:', error.message);
        return next();
    }

    return User.findById(decodedToken.id)
        .then(user => {
            if (user && user.status === 'active' && !isSessionStale(user, decodedToken)) {
                req.user = user;
                req.token = token;
            }
            next();
        })
        .catch(error => {
            logger.debug('Optional auth failed:', error.message);
            next();
        });
};

/**
 * POST /fear/api/auth/google
 * SECURITY: the audience MUST come from server config. Previously it was taken
 * from req.body.clientId (the storefront never sends it), so audience was
 * `undefined` and Google ID tokens minted for ANY client app were accepted.
 */
exports.googleAuth = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return response.error(res, 400, "Google credential is required");
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
        logger.error('GOOGLE_CLIENT_ID is not configured');
        return response.error(res, 500, "Google sign-in is not configured");
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const {
            sub: googleId,
            email,
            given_name: firstName,
            family_name: lastName,
            picture: avatar,
            email_verified,
        } = payload;

        if (!email_verified) {
            return response.error(res, 401, "Google email is not verified");
        }

        logger.info('Google authentication attempt for:', email);

        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { 'oauth.google.id': googleId }
            ],
            status: { $ne: 'deleted' }
        });

        // ── Existing user: login ────────────────────────────────────────────
        if (user) {
            if (user.status === 'suspended') {
                return response.error(res, 403, "Your account has been suspended. Please contact support.");
            }
            if (user.status === 'inactive') {
                return response.error(res, 403, "Your account is inactive. Please contact support to reactivate.");
            }

            if (!user.oauth?.google?.id) {
                user.oauth = user.oauth || {};
                user.oauth.google = {
                    id: googleId,
                    email: email.toLowerCase(),
                    connectedAt: new Date()
                };
            }

            user.lastLoginAt = new Date();
            user.lastLoginIP = req.ip || req.socket?.remoteAddress;

            if (avatar && !user.avatar) {
                user.avatar = avatar;
            }

            const savedUser = await user.save();
            logger.info('Google login successful for:', savedUser.email);

            const token = TokenService.generateToken(savedUser);
            return response.success(res, savedUser, token, 200, "Google login successful");
        }

        // ── New user: registration ──────────────────────────────────────────
        const newUser = await User.create({
            email: email.toLowerCase(),
            firstName: firstName?.trim() || email.split('@')[0],
            lastName: lastName?.trim() || '',
            displayName: firstName && lastName
                ? `${firstName} ${lastName}`.trim()
                : email.split('@')[0],
            avatar: avatar || undefined,
            role: 'user',
            status: 'active',
            oauth: {
                google: {
                    id: googleId,
                    email: email.toLowerCase(),
                    connectedAt: new Date()
                }
            },
            isEmailVerified: true,
            lastLoginAt: new Date(),
            lastLoginIP: req.ip || req.socket?.remoteAddress
        });
        logger.info('New user registered via Google:', newUser.email);

        const token = TokenService.generateToken(newUser);
        return response.success(res, newUser, token, 201, "Google registration successful");

    } catch (error) {
        logger.error('Google authentication error:', error);

        if (error.message?.includes('Token used too late') ||
            error.message?.includes('Invalid token') ||
            error.message?.includes('Wrong recipient')) {
            return response.error(res, 401, "Invalid or expired Google credential");
        }
        if (error.code === 11000) {
            return response.error(res, 409, "User with this email already exists");
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return response.error(res, 400, messages.join(', '));
        }
        return response.error(res, 500, "Google authentication failed", error.message);
    }
};

/**
 * POST /fear/api/auth/google/link
 */
exports.linkGoogleAccount = (req, res) => {
    const { googleId, email } = req.body;
    const userId = req.user._id;

    if (!googleId || !email) {
        return response.error(res, 400, "Google ID and email are required");
    }

    User.findOne({ 'oauth.google.id': googleId, _id: { $ne: userId } })
        .then(existingUser => {
            if (existingUser) {
                return response.error(res, 409, "This Google account is already linked to another user");
            }
            return User.findById(userId);
        })
        .then(user => {
            if (!user || typeof user.save !== 'function') {
                if (!res.headersSent) return response.error(res, 404, "User not found");
                return;
            }

            user.oauth = user.oauth || {};
            user.oauth.google = {
                id: googleId,
                email: email.toLowerCase(),
                connectedAt: new Date()
            };

            if (!user.isEmailVerified && email.toLowerCase() === user.email) {
                user.isEmailVerified = true;
            }

            return user.save();
        })
        .then(user => {
            if (!user || typeof user.toJSON !== 'function' || res.headersSent) return;

            logger.info('Google account linked for user:', user.email);
            return res.status(200).json({
                success: true,
                message: "Google account linked successfully",
                data: { user: user.toJSON() }
            });
        })
        .catch(error => {
            logger.error('Google account linking error:', error);
            return response.error(res, 500, "Failed to link Google account", error.message);
        });
};

/**
 * DELETE /fear/api/auth/google/unlink
 */
exports.unlinkGoogleAccount = (req, res) => {
    const userId = req.user._id;

    User.findById(userId)
        .select('+password')
        .then(user => {
            if (!user) {
                return response.error(res, 404, "User not found");
            }

            if (!user.oauth || !user.oauth.google) {
                return response.error(res, 400, "No Google account is linked to this user");
            }

            // Don't strand a Google-only account with no way to sign in.
            if (!user.password) {
                return response.error(
                    res,
                    400,
                    "Cannot unlink Google account. Please set a password first to maintain access to your account."
                );
            }

            user.oauth.google = undefined;
            return user.save();
        })
        .then(user => {
            if (!user || typeof user.toJSON !== 'function' || res.headersSent) return;

            logger.info('Google account unlinked for user:', user.email);
            return res.status(200).json({
                success: true,
                message: "Google account unlinked successfully",
                data: { user: user.toJSON() }
            });
        })
        .catch(error => {
            logger.error('Google account unlinking error:', error);
            return response.error(res, 500, "Failed to unlink Google account", error.message);
        });
};

// A single export object: assigning module.exports after setting exports.X
// discards the earlier assignments, which is how AuthResponse used to vanish.
module.exports = {
    login: exports.login,
    register: exports.register,
    logout: exports.logout,
    me: exports.getCurrentUser,
    session: exports.getSession,
    getCurrentUser: exports.getCurrentUser,
    getSession: exports.getSession,
    refreshToken: exports.refreshToken,
    updateProfile: exports.updateProfile,
    updatePreferences: exports.updatePreferences,
    googleAuth: exports.googleAuth,
    linkGoogleAccount: exports.linkGoogleAccount,
    unlinkGoogleAccount: exports.unlinkGoogleAccount,
    isAuthorized: exports.isAuthorized,
    isAdmin: exports.isAdmin,
    authorizeRoles: exports.authorizeRoles,
    optionalAuth: exports.optionalAuth,
    AuthResponse: response,
};