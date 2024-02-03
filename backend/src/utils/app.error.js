
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    console.log(message)
  }
}

exports.exports = AppError;