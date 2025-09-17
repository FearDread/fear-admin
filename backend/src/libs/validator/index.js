
const handler = require('../handler');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');



/**
 * Basic validation middleware for express-validator
 * Checks validation results and throws handler..error if validation fails
 */
exports.request = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      const field = error.path || error.param;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(error.msg);
      return acc;
    }, {});

    const errorResponse = {
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      errorCount: errors.array().length
    };

    return res.status(400).json(errorResponse);
  }
  
  next();
}

/**
 * Custom validation schemas for common use cases
 */
exports.schemas = {
  // MongoDB ObjectId validation
  mongoId: (field = 'id') => ({
    [field]: {
      in: ['params', 'body', 'query'],
      isMongoId: {
        errorMessage: `Valid ${field} is required`
      }
    }
  }),

  // Email validation
  email: (field = 'email', required = true) => ({
    [field]: {
      in: ['body'],
      ...(required && { notEmpty: { errorMessage: `${field} is required` } }),
      isEmail: {
        errorMessage: 'Valid email address is required'
      },
      normalizeEmail: true
    }
  }),

  // Password validation
  password: (field = 'password', minLength = 8) => ({
    [field]: {
      in: ['body'],
      isLength: {
        options: { min: minLength },
        errorMessage: `Password must be at least ${minLength} characters long`
      },
      matches: {
        options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    }
  }),

  // Pagination validation
  pagination: () => ({
    page: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Page must be a positive integer'
      },
      toInt: true
    },
    limit: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1, max: 100 },
        errorMessage: 'Limit must be between 1 and 100'
      },
      toInt: true
    }
  })
};

/**
 * Dynamic validation builder
 */
exports.buildValidation = (schema) => {
  const { checkSchema } = require('express-validator');
  return checkSchema(schema);
};

/**
 * Sanitization helpers
 */
exports.sanitizers = {
  trimAndEscape: (field) =>
    body(field).trim().escape(),
    
  normalizeEmail: (field = 'email') =>
    body(field).normalizeEmail(),
    
  toLowerCase: (field) =>
    body(field).toLowerCase(),
    
  toBoolean: (field) =>
    body(field).toBoolean()
};

/**
 * Validation middleware factory
 * Creates validation middleware with custom error handling
 */
exports.factory = (options = {}) => {
  const {
    detailed = true,
    firstOnly = false,
    location = true
  } = options;

  return (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      if (firstOnly) {
        const firstError = errors.array()[0];
        const message = location 
          ? `${firstError.path}: ${firstError.msg}`
          : firstError.msg;
        
        throw new handler.error(message, 400);
      }

      if (detailed) {
        const formattedErrors = errors.array().reduce((acc, error) => {
          const field = error.path || error.param;
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push({
            message: error.msg,
            value: error.value,
            location: error.location
          });
          return acc;
        }, {});

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
      }

      // Default: simple error list
      const errorMessages = errors.array().map(error => 
        includeLocation ? `${error.path}: ${error.msg}` : error.msg
      );
      
      throw new handler.error(errorMessages.join(', '), 400);
    }
    
    next();
  };
};

module.exports = {
    request: exports.request,
    schemas: exports.schemas,
    builder: exports.buildValidation,
    factory: exports.factory,
    sanitizers: exports.sanitizers,
}