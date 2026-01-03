const User = require("../../models/user");
const TokenService = require('./token');
const handler = require('../../libs/handler');
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
        phoneNumber: phoneNumber || undefined,
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
  if (req.cookies?.jwt) {
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

// Export TokenService and other utilities for use in other modules
exports.AuthResponse = response;

module.exports = {
  login: exports.login,
  register: exports.register,
  logout: exports.logout
}