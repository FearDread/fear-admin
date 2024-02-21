class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    console.log(message)
  }
}
exports.AppError = AppError;
/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
exports.catchErrors = (fn) => {
  return function (req, res, next) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

exports.authError = (res, token) => {
  res.status(401).json({
    success: false,
    result: res,
    message: "Authentication Error",
    error: token
  });
};

exports.dbError = (res, err) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    const message = '';

    switch (err) {
      case err.name === "CastError":
        message = `Resource not found. Invalid: ${err.path}`;

      case err.code === 11000:
        message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    
      case err.name === "JsonWebTokenError":
        message = `Json Web Token is invalid, Try again `;
    }

    res.status(statusCode).json({
      success: false,
      message: message,
      stack: err.stack,
    });
};

exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };

  res.status(500).json({
    success: false,
    message: "Oops ! Error in Server",
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Oops ! Error in Server",
  });
};
