const User = require("../../models/user");
const TokenService = require('./token');
const Validation = require("./validation");
const { tryCatch } = require("../../libs/handler/error");


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
    // Remove sensitive data from user object
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

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
    const response = {
      success: false,
      message
    };

    if (error && process.env.NODE_ENV === "development") {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }
}


/**
 * POST /fear/api/auth/login
 * @summary Authenticate user and generate JWT token
 * @description Validates user credentials (email/password) and returns JWT token for authenticated user
 * @tags authentication
 */
exports.login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validation = Validation.validateLoginInput({ email, password });
  if (!validation.isValid) {
    return response.sendError(res, 400, validation.message);
  }

  console.log('Authentication attempt for:', email);

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return response.error(res, 401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await user.compare(password);
    if (!isPasswordValid) {
      return response.error(res, 401, "Invalid credentials");
    }

    // Generate token and send response
    const token = TokenService.generateToken(user);
    return response.success(res, user, token, 200, "Login successful");

  } catch (error) {
    console.error('Login error:', error);
    return response.error(res, 500, "Authentication failed", error.message);
  }
});

/**
 * POST /fear/api/auth/register
 * @summary Register a new user account
 * @description Creates a new user account with provided information and returns JWT token
 * @tags authentication
 */
exports.register = tryCatch(async (req, res) => {
  const { email, firstname, lastname, name: providedName, password, ...otherFields } = req.body;

  // Validate input
  const validation = Validation.validateRegistrationInput({
    email, firstname, lastname, name: providedName, password
  });
  
  if (!validation.isValid) {
    return response.error(res, 400, validation.message);
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.error(res, 409, "User with this email already exists");
    }

    // Create new user
    const userData = {
      ...otherFields,
      email: email.toLowerCase(),
      name: validation.name,
      password,
      role: otherFields.role || 'user' // Default role
    };

    const user = await User.create(userData);
    
    // Generate token and send response
    const token = TokenService.generateToken(user);
    return response.success(res, user, token, 201, "Registration successful");

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return response.error(res, 409, "User with this email already exists");
    }
    
    return response.error(res, 500, "Registration failed", error.message);
  }
});

/**
 * POST /fear/api/auth/logout
 * @summary Log out user and clear JWT cookie
 * @description Clears the JWT token cookie to log out the authenticated user
 * @tags authentication
 */
exports.logout = tryCatch(async (req, res) => {
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
});

/**
 * GET /fear/api/auth/me
 * @summary Get current authenticated user profile
 * @description Returns the current user's profile information
 * @tags authentication
 */
exports.getCurrentUser = tryCatch(async (req, res) => {
  // req.user is set by isAuthorized middleware
  const user = req.user;
  
  const userResponse = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return res.status(200).json({
    success: true,
    data: { user: userResponse }
  });
});

/**
 * PUT /fear/api/auth/refresh-token
 * @summary Refresh JWT token
 * @description Generates a new JWT token for authenticated user
 * @tags authentication
 */
exports.refreshToken = tryCatch(async (req, res) => {
  const user = req.user; // Set by isAuthorized middleware
  
  const newToken = TokenService.generateToken(user);
  return response.success(res, user, newToken, 200, "Token refreshed successfully");
});

/**
 * Middleware: Verify JWT token and authenticate user
 * @summary Checks if user has valid JWT token in cookies or Authorization header
 * @description Validates JWT token and attaches user object to request
 * @tags middleware, authentication
 */
exports.isAuthorized = tryCatch(async (req, res, next) => {
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
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.error(res, 401, "Invalid token. User not found.");
    }

    // Check if user is still active (optional)
    if (user.isActive === false) {
      return response.error(res, 401, "Account has been deactivated.");
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    console.error('Authorization error:', error);

    if (error.name === 'JsonWebTokenError') {
      return response.error(res, 401, "Invalid token.");
    }

    if (error.name === 'TokenExpiredError') {
      return response.error(res, 401, "Token has expired. Please login again.");
    }

    return response.error(res, 500, "Authentication failed", error.message);
  }
});

/**
 * Middleware: Check if user has admin role
 * @summary Verifies that authenticated user has admin privileges
 * @description Checks if req.user.role equals 'admin'. Must be used after isAuthorized middleware
 * @tags middleware, authorization
 */
exports.isAdmin = tryCatch(async (req, res, next) => {
  if (!req.user) {
    return response.error(res, 401, "Authentication required");
  }

  if (req.user.role !== "admin") {
    return response.error(res, 403, "Access denied. Admin privileges required.");
  }

  next();
});

/**
 * Middleware factory: Check if user has required role(s)
 * @summary Creates middleware to verify user has one of the specified roles
 * @description Returns middleware function that checks if authenticated user's role is in allowed roles list
 * @tags middleware, authorization
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'moderator', 'user')
 * @returns {function} Express middleware function
 */
exports.authorizeRoles = (...roles) => {
  return tryCatch(async (req, res, next) => {
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
  });
};

/**
 * Middleware: Optional authentication
 * @summary Attempts to authenticate user but doesn't fail if no token provided
 * @description Useful for routes that behave differently for authenticated vs anonymous users
 * @tags middleware, authentication
 */
exports.optionalAuth = tryCatch(async (req, res, next) => {
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
    const user = await User.findById(decodedToken.id);
    
    if (user && user.isActive !== false) {
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }

  next();
});

// Export TokenService and other utilities for use in other modules
exports.AuthResponse = response;
