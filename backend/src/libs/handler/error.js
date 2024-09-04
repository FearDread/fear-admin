const { StatusCodes } = require("http-status-codes");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    console.log(message)
  }
}

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}


class UnauthenticatedError extends CustomError {
  constructor(message) {
     super(message);
     this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = {
  custom: CustomError,
  unauthorized: UnauthenticatedError,
  request: BadRequest 
};
