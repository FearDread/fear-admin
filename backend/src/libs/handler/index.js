/**
 * Custom Application Error class
 * Extends the built-in Error class with HTTP status codes
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to automatically catch and forward errors
 * @param {Function} asyncFn - The async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  console.log('fn = ', fn);
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

const successResponse = (res, obj) => {3
  const strip = (text) => text.replace(/\x1b\[[0-9;]*m/g, '')

  if (obj.output) {
    obj.output = strip(obj.output);
  }

  return res.status(200).json(obj);

}
/**
 * Development Error Handler
 * Provides detailed error information for debugging
 */
const developmentErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  const response = {
    success: false,
    error: {
      message: err.message,
      statusCode,
      stack: err.stack,
      details: {
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    }
  };

  res.status(statusCode).json(response);
};

/**
 * Production Error Handler
 * Provides sanitized error responses for production
 */
const productionErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error details for monitoring (but don't expose to client)
  console.error('Production Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  let message = 'Internal Server Error';
  
  // Only expose operational errors to clients
  if (err.isOperational) {
    message = err.message;
  }
  
  // Handle specific error types
  if (statusCode === 404) {
    message = 'Resource not found';
  } else if (statusCode === 401) {
    message = 'Unauthorized access';
  } else if (statusCode === 403) {
    message = 'Forbidden';
  } else if (statusCode === 400) {
    message = err.message; // Usually safe to expose validation errors
  }

  const response = {
    success: false,
    error: {
      message,
      statusCode
    }
  };

  res.status(statusCode).json(response);
};

/**
 * Global Error Handler
 * Determines which error handler to use based on environment
 */
const globalErrorHandler = (err, req, res, next) => {
  // Handle specific error types
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.isOperational = true;
  } else if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
    err.isOperational = true;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    err.statusCode = 400;
    err.message = 'Duplicate field value';
    err.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    developmentErrorHandler(err, req, res, next);
  } else {
    productionErrorHandler(err, req, res, next);
  }
};

module.exports = {
  error: () => new AppError,
  success: successResponse,
  global: globalErrorHandler,
  production: productionErrorHandler,
  development: developmentErrorHandler,
  async: asyncHandler,
  notFound: notFoundHandler
}