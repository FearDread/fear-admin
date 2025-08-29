const User = require("../../models/user");
const jwt = require("jsonwebtoken");

/**
 * POST /fear/api/auth/login
 * @summary Authenticate user and generate JWT token
 * @description Validates user credentials (email/password) and returns JWT token for authenticated user
 * @tags authentication
 * @param {object} req.body - User credentials
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password
 * @returns {object} 200 - Authentication successful
 * @returns {object} 400 - Invalid request (missing email/password)
*/
exports.login = (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

  console.log('Logging in user:', email);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      return user.compare(password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return res.status(401).json({ 
              success: false, 
              error: 'Invalid credentials' 
            });
          }

          const token = this.getJWTToken(res, user);
          return res.status(200).json({ 
            success: true,
            result: { user, token }
          });
        });
    })
    .catch((error) => {
      console.error('Login error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    });
};

/**
 * POST /fear/api/auth/logout
 * @summary Log out user and clear JWT cookie
 * @description Clears the JWT token cookie to log out the authenticated user
 * @tags authentication
 * @returns {object} 200 - Logout successful
 * @returns {object} 500 - Internal server error
 * @example
 * // Success response
 * {
 *   "success": true
 * }
 */
exports.logout = (req, res) => {
  Promise.resolve()
    .then(() => {
      return res.status(200)
        .clearCookie('jwt', {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict"
        })
        .json({ success: true });
    })
    .catch((error) => {
      console.error('Logout error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    });
};

/**
 * POST /fear/api/auth/register
 * @summary Register a new user account
 * @description Creates a new user account with provided information and returns JWT token
 * @tags authentication
 * @param {object} req.body - User registration data
 * @param {string} req.body.email - User email address (required)
 * @param {string} [req.body.firstname] - User first name
 * @param {string} [req.body.lastname] - User last name
 * @param {string} [req.body.name] - Full name (used if firstname/lastname not provided)
 * @returns {object} 201 - User created successfully
 * @returns {object} 400 - Invalid request (missing required fields)
 * @returns {object} 409 - User already exists
 * @returns {object} 500 - Internal server error
 * @example
 * // Request body
 * {
 *   "email": "newuser@example.com",
 *   "firstname": "John",
 *   "lastname": "Doe",
 *   "password": "securepassword"
 * }
 * 
 * // Success response
 * {
 *   "success": true,
 *   "user": {...},
 *   "token": "jwt.token.here"
 * }
 */
exports.register = (req, res) => {
  const { email, firstname, lastname, name: providedName, ...otherFields } = req.body;
  
  // Validate required fields
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required' 
    });
  }

  // Construct full name
  const name = firstname && lastname 
    ? `${firstname} ${lastname}` 
    : providedName;

  if (!name) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name is required' 
    });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'User already exists' 
        });
      }

      const userData = { ...otherFields, email, name };
      return User.create(userData)
        .then((user) => {
          const token = this.getJWTToken(res, user);
          return res.status(201).json({ 
            success: true, 
            user, 
            token 
          });
        });
    })
    .catch((error) => {
      console.error('Registration error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    });
};

/**
 * Middleware: Verify JWT token and authenticate user
 * @summary Checks if user has valid JWT token in cookies
 * @description Validates JWT token from cookies and attaches user object to request
 * @tags middleware, authentication
 * @param {object} req - Express request object
 * @param {object} req.cookies - Request cookies containing JWT token
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void} Calls next() on success, sends error response on failure
 * @throws {401} No token provided
 * @throws {401} Invalid or expired token
 * @throws {401} User not found
 * @throws {500} Internal server error
 * @example
 * // Usage in route
 * router.get('/protected', isAuthorized, (req, res) => {
 *   // req.user is now available
 *   res.json({ user: req.user });
 * });
 */
exports.isAuthorized = (req, res, next) => {
  console.log("Checking Authorization:", req.cookies);
  
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({
      success: false, 
      message: "Access denied. No token provided."
    });
  }

  Promise.resolve()
    .then(() => {
      // Verify JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken;
    })
    .then((decodedToken) => {
      return User.findById(decodedToken.id);
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false, 
          message: "Invalid token. User not found."
        });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error('Authorization error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false, 
          message: "Invalid token."
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false, 
          message: "Token expired."
        });
      }

      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    });
};

/**
 * Generate JWT token and set HTTP-only cookie
 * @summary Creates signed JWT token and sets secure cookie
 * @description Generates JWT token with user ID and expiration, sets it as HTTP-only cookie
 * @param {object} res - Express response object for setting cookie
 * @param {object} user - User object containing user data
 * @param {string} user._id - User ID to include in token payload
 * @returns {string} Generated JWT token
 * @example
 * const token = getJWTToken(res, user);
 * // Cookie is automatically set on response
 * // Token can be returned in response body if needed
 */
exports.getJWTToken = (res, user) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      id: user._id,
    }, 
    process.env.JWT_SECRET
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};

/**
 * Middleware: Check if user has admin role
 * @summary Verifies that authenticated user has admin privileges
 * @description Checks if req.user.role equals 'admin'. Must be used after isAuthorized middleware
 * @tags middleware, authorization
 * @param {object} req - Express request object
 * @param {object} req.user - User object (attached by isAuthorized middleware)
 * @param {string} req.user.role - User role to check
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void} Calls next() if user is admin, sends error response otherwise
 * @throws {401} User not authenticated
 * @throws {403} User is not admin
 * @throws {500} Internal server error
 * @example
 * // Usage in route (must come after isAuthorized)
 * router.delete('/admin/users/:id', isAuthorized, isAdmin, (req, res) => {
 *   // Only admin users can access this route
 * });
 */
exports.isAdmin = (req, res, next) => {
  Promise.resolve()
    .then(() => {
      // User should already be attached to req from isAuthorized middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated"
        });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Access denied. Admin role required."
        });
      }

      next();
    })
    .catch((error) => {
      console.error('Admin check error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    });
};

/**
 * Middleware factory: Check if user has required role(s)
 * @summary Creates middleware to verify user has one of the specified roles
 * @description Returns middleware function that checks if authenticated user's role is in allowed roles list
 * @tags middleware, authorization
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'moderator', 'user')
 * @returns {function} Express middleware function
 **/
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            error: "User not authenticated"
          });
        }

        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
          });
        }

        next();
      })
      .catch((error) => {
        console.error('Role authorization error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Internal server error' 
        });
      });
  };
};