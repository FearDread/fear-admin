const User = require("../../models/user");
const TokenService = require('./token');
const validator = require('../../libs/validator');
const logger = require('../../libs/logger');


/**
 * Authentication response helper
 */
const response = {
  /**
   * Send successful authentication response
   * @param {object} res - Express response object
   * @param {object} user - User object
   * @param {string} token - JWT token
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   */
  success: (res, user, token, statusCode = 200, message = "Authentication successful") => {
    // Use the model's toJSON method which automatically removes sensitive data
    const userResponse = user.toJSON();

    return res
      .status(statusCode)
      .cookie("jwt", token, TokenService.getCookieOptions())
      .json({
        success: true,
        message,
        data: {
          user: userResponse,
          token
        }
      });
  },

  /**
   * Send error response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} error - Detailed error (optional)
   */
  error: (res, statusCode, message, error = null) => {
    const response = { success: false, message };

    if (error && process.env.NODE_ENV === "development") response.error = error;

    return res.status(statusCode).json(response);
  }
}


/**
 * POST /fear/api/auth/login
 * @summary Authenticate user and generate JWT token
 * @description Validates user credentials (email/password) and returns JWT token for authenticated user
 * @tags authentication
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validation = validator.input.login({ email, password });
  if (!validation.isValid) {
    return response.error(res, 400, validation.message);
  }

  logger.info('Authentication attempt for:', email);

  // Find user and include password field
  User.findOne({ 
    email: email.toLowerCase(),
    status: { $ne: 'deleted' }
  })
    .select('+password')
    .then(user => {
      if (!user) {
        return response.error(res, 401, "Invalid credentials");
      }

      // Check if account is locked
      if (user.isLocked()) {
        return response.error(
          res, 
          423, 
          "Account temporarily locked due to too many failed login attempts. Please try again later."
        );
      }

      // Check if account is suspended or inactive
      if (user.status === 'suspended') {
        return response.error(res, 403, "Your account has been suspended. Please contact support.");
      }

      if (user.status === 'inactive') {
        return response.error(res, 403, "Your account is inactive. Please contact support to reactivate.");
      }

      // Verify password
      return user.comparePassword(password)
        .then(isPasswordValid => {
          if (!isPasswordValid) {
            return user.incLoginAttempts()
              .then(() => {
                return response.error(res, 401, "Invalid credentials");
              });
          }

          // Reset login attempts and update last login
          return user.resetLoginAttempts()
            .then(() => {
              return user.updateOne({ 
                lastLoginAt: new Date(),
                lastLoginIP: req.ip || req.connection.remoteAddress
              });
            })
            .then(() => {
              // Generate token
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
 * @summary Register a new user account
 * @description Creates a new user account with provided information and returns JWT token
 * @tags authentication
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

  // Validate input
  const validation = validator.input.register({
    email, 
    password,
    firstName,
    lastName
  });

  if (!validation.isValid) {
    return response.error(res, 400, validation.message);
  }

  // Check if user already exists
  User.findOne({ email: email.toLowerCase() })
    .then(existingUser => {
      if (existingUser) {
        return response.error(res, 409, "User with this email already exists");
      }

      // Create new user with nested profile structure
      const userData = {
        email: email.toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName || `${firstName} ${lastName}`,
        mobile: phoneNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
        role: otherFields.role || 'user',
        status: 'active'
      };

      return User.create(userData);
    })
    .then(user => {
      if (!user) return; // Already handled in previous then

      logger.info('New user registered:', user.email);

      // Generate token and send response
      const token = TokenService.generateToken(user);
      return response.success(res, user, token, 201, "Registration successful");
    })
    .catch(error => {
      logger.error('Registration error:', error);

      // Handle duplicate key error (in case of race condition)
      if (error.code === 11000) {
        return response.error(res, 409, "User with this email already exists");
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return response.error(res, 400, messages.join(', '));
      }

      return response.error(res, 500, "Registration failed", error.message);
    });
};

/**
 * POST /fear/api/auth/logout
 * @summary Log out user and clear JWT cookie
 * @description Clears the JWT token cookie to log out the authenticated user
 * @tags authentication
 */
exports.logout = async (req, res) => {
  return res
    .status(200)
    .clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })
    .json({
      success: true,
      message: "Logout successful"
    });
};

/**
 * GET /fear/api/auth/me
 * @summary Get current authenticated user profile
 * @description Returns the current user's profile information
 * @tags authentication
 */
exports.getCurrentUser = (req, res) => {
  // req.user is set by isAuthorized middleware
  const user = req.user;

  // Use toJSON to automatically remove sensitive fields
  const userResponse = user.toJSON();

  return res.status(200).json({
    success: true,
    data: { user: userResponse }
  });
};

/**
 * PUT /fear/api/auth/refresh-token
 * @summary Refresh JWT token
 * @description Generates a new JWT token for authenticated user
 * @tags authentication
 */
exports.refreshToken = (req, res) => {
  const user = req.user; // Set by isAuthorized middleware

  const newToken = TokenService.generateToken(user);
  return response.success(res, user, newToken, 200, "Token refreshed successfully");
};

/**
 * PUT /fear/api/auth/update-profile
 * @summary Update user profile information
 * @description Updates the authenticated user's profile data
 * @tags authentication
 */
exports.updateProfile = (req, res) => {
  const { firstName, lastName, displayName, phoneNumber, bio, dateOfBirth, avatar } = req.body;

  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return response.error(res, 404, "User not found");
      }

      // Update profile fields if provided
      if (firstName) user.firstName = firstName.trim();
      if (lastName) user.lastName = lastName.trim();
      if (displayName !== undefined) user.displayName = displayName.trim();
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (bio !== undefined) user.bio = bio;
      if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
      if (avatar !== undefined) user.avatar = avatar;

      return user.save();
    })
    .then(user => {
      if (!user) return; // Already handled

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user: user.toJSON() }
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
 * @summary Update user preferences
 * @description Updates the authenticated user's preferences (language, timezone, notifications, theme)
 * @tags authentication
 */
exports.updatePreferences = (req, res) => {
  const { language, timezone, notifications, theme } = req.body;

  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return response.error(res, 404, "User not found");
      }

      // Update preferences
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
      if (!user) return; // Already handled

      return res.status(200).json({
        success: true,
        message: "Preferences updated successfully",
        data: { 
          preferences: user.preferences
        }
      });
    })
    .catch(error => {
      logger.error('Preferences update error:', error);
      return response.error(res, 500, "Preferences update failed", error.message);
    });
};

/**
 * Middleware: Verify JWT token and authenticate user
 * @summary Checks if user has valid JWT token in cookies or Authorization header
 * @description Validates JWT token and attaches user object to request
 * @tags middleware, authentication
 */
exports.isAuthorized = (req, res, next) => {
  let token;

  // Check for token in cookies first, then Authorization header
  if (req && req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return response.error(res, 401, "Access denied. Authentication required.");
  }

  try {
    // Verify token
    const decodedToken = TokenService.verifyToken(token);

    // Get user from database
    User.findById(decodedToken.id)
      .then(user => {
        if (!user) {
          return response.error(res, 401, "Invalid token. User not found.");
        }

        // Check user status
        if (user.status === 'deleted') {
          return response.error(res, 401, "Account has been deleted.");
        }

        if (user.status === 'suspended') {
          return response.error(res, 403, "Account has been suspended.");
        }

        if (user.status === 'inactive') {
          return response.error(res, 403, "Account is inactive.");
        }

        // Attach user to request
        req.user = user;
        req.token = token;
        next();
      })
      .catch(error => {
        logger.error('Authorization error:', error);
        return response.error(res, 500, "Authentication failed", error.message);
      });

  } catch (error) {
    logger.error('Authorization error:', error);

    if (error.name === 'JsonWebTokenError') {
      return response.error(res, 401, "Invalid token.");
    }

    if (error.name === 'TokenExpiredError') {
      return response.error(res, 401, "Token has expired. Please login again.");
    }

    return response.error(res, 500, "Authentication failed", error.message);
  }
};

/**
 * Middleware: Check if user has admin role
 * @summary Verifies that authenticated user has admin privileges
 * @description Checks if req.user.role equals 'admin'. Must be used after isAuthorized middleware
 * @tags middleware, authorization
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
 * Middleware factory: Check if user has required role(s)
 * @summary Creates middleware to verify user has one of the specified roles
 * @description Returns middleware function that checks if authenticated user's role is in allowed roles list
 * @tags middleware, authorization
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'moderator', 'user')
 * @returns {function} Express middleware function
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
 * Middleware: Optional authentication
 * @summary Attempts to authenticate user but doesn't fail if no token provided
 * @description Useful for routes that behave differently for authenticated vs anonymous users
 * @tags middleware, authentication
 */
exports.optionalAuth = (req, res, next) => {
  let token;

  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decodedToken = TokenService.verifyToken(token);
    
    User.findById(decodedToken.id)
      .then(user => {
        if (user && user.status === 'active') {
          req.user = user;
          req.token = token;
        }
        next();
      })
      .catch(error => {
        // Silently fail for optional auth
        logger.debug('Optional auth failed:', error.message);
        next();
      });
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed:', error.message);
    next();
  }
};
/**
 * POST /fear/api/auth/google
 * @summary Authenticate or register user via Google OAuth
 * @description Handles Google OAuth login/registration. Creates new user if doesn't exist, or logs in existing user
 * @tags authentication, oauth
 */
exports.googleAuth = (req, res) => {
  const { googleToken, googleId, email, firstName, lastName, avatar } = req.body;

  // Validate required fields
  if (!email || !googleId) {
    return response.error(res, 400, "Google ID and email are required");
  }

  // Validate email format (assuming validator has email method)
  const emailValidation = validator.input.email ? validator.input.email(email) : { isValid: true };
  if (!emailValidation.isValid) {
    return response.error(res, 400, "Invalid email format");
  }

  logger.info('Google authentication attempt for:', email);

  // Find user by email or googleId
  User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { 'oauth.google.id': googleId }
    ],
    status: { $ne: 'deleted' }
  })
    .then(user => {
      // If user exists - login flow
      if (user) {
        // Check account status
        if (user.status === 'suspended') {
          return response.error(res, 403, "Your account has been suspended. Please contact support.");
        }

        if (user.status === 'inactive') {
          return response.error(res, 403, "Your account is inactive. Please contact support to reactivate.");
        }

        // Update Google OAuth info if not already set
        if (!user.oauth || !user.oauth.google || !user.oauth.google.id) {
          user.oauth = user.oauth || {};
          user.oauth.google = {
            id: googleId,
            email: email.toLowerCase(),
            connectedAt: new Date()
          };
        }

        // Update last login info
        user.lastLoginAt = new Date();
        user.lastLoginIP = req.ip || req.connection.remoteAddress;

        // Update avatar if provided and user doesn't have one
        if (avatar && !user.avatar) {
          user.avatar = avatar;
        }

        return user.save()
          .then(savedUser => {
            logger.info('Google login successful for:', savedUser.email);
            
            // Generate token and send response
            const token = TokenService.generateToken(savedUser);
            return response.success(res, savedUser, token, 200, "Google login successful");
          });
      }

      // User doesn't exist - registration flow
      const userData = {
        email: email.toLowerCase(),
        firstName: firstName?.trim() || 'User',
        lastName: lastName?.trim() || '',
        displayName: firstName && lastName ? `${firstName} ${lastName}`.trim() : email.split('@')[0],
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
        isEmailVerified: true, // Google emails are already verified
        lastLoginAt: new Date(),
        lastLoginIP: req.ip || req.connection.remoteAddress
      };

      // Create new user (no password required for OAuth users)
      return User.create(userData)
        .then(newUser => {
          logger.info('New user registered via Google:', newUser.email);

          // Generate token and send response
          const token = TokenService.generateToken(newUser);
          return response.success(res, newUser, token, 201, "Google registration successful");
        });
    })
    .catch(error => {
      logger.error('Google authentication error:', error);

      // Handle duplicate key error
      if (error.code === 11000) {
        return response.error(res, 409, "User with this email already exists");
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return response.error(res, 400, messages.join(', '));
      }

      return response.error(res, 500, "Google authentication failed", error.message);
    });
};

/**
 * POST /fear/api/auth/google/link
 * @summary Link Google account to existing authenticated user
 * @description Connects a Google OAuth account to the currently logged-in user
 * @tags authentication, oauth
 */
exports.linkGoogleAccount = (req, res) => {
  const { googleId, email } = req.body;
  const userId = req.user._id; // Set by isAuthorized middleware

  if (!googleId || !email) {
    return response.error(res, 400, "Google ID and email are required");
  }

  // Check if Google account is already linked to another user
  User.findOne({
    'oauth.google.id': googleId,
    _id: { $ne: userId }
  })
    .then(existingUser => {
      if (existingUser) {
        return response.error(res, 409, "This Google account is already linked to another user");
      }

      // Get current user
      return User.findById(userId);
    })
    .then(user => {
      if (!user) {
        return response.error(res, 404, "User not found");
      }

      // Update user with Google OAuth info
      user.oauth = user.oauth || {};
      user.oauth.google = {
        id: googleId,
        email: email.toLowerCase(),
        connectedAt: new Date()
      };

      // Verify email if it matches
      if (!user.isEmailVerified && email.toLowerCase() === user.email) {
        user.isEmailVerified = true;
      }

      return user.save();
    })
    .then(user => {
      if (!user) return; // Already handled

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
 * @summary Unlink Google account from authenticated user
 * @description Removes Google OAuth connection from the user's account
 * @tags authentication, oauth
 */
exports.unlinkGoogleAccount = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .select('+password')
    .then(user => {
      if (!user) {
        return response.error(res, 404, "User not found");
      }

      // Check if user has a password set (don't allow unlinking if it's their only auth method)
      if (!user.password && user.oauth?.google) {
        return response.error(
          res,
          400,
          "Cannot unlink Google account. Please set a password first to maintain access to your account."
        );
      }

      // Check if Google account is linked
      if (!user.oauth || !user.oauth.google) {
        return response.error(res, 400, "No Google account is linked to this user");
      }

      // Remove Google OAuth info
      user.oauth.google = undefined;

      return user.save();
    })
    .then(user => {
      if (!user) return; // Already handled

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
// Export TokenService and other utilities for use in other modules
exports.AuthResponse = response;


module.exports = {
  login: exports.login,
  register: exports.register,
  logout: exports.logout,
  isAuthorized: exports.isAuthorized,
  googleAuth: exports.googleAuth,
}