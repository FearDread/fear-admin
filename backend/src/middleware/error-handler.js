const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
   // console.log(err.name);
   console.log(err.message);
   // console.log(err);

   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || "Something went wrong, try again later",
   };
   if (err.name === "CastError") {
      customError.msg = `_id ${err.value._id} is invalid`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }
   if (err.code === 11000) {
      customError.statusCode = 400;
      customError.msg = `${Object.keys(err.keyValue).join("")} already exists`;
   }
   if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
         .map((item) => item.message)
         .join(", ");
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }
   return res.status(customError.statusCode).json({ error: customError.msg });
};

module.exports = errorHandlerMiddleware;
