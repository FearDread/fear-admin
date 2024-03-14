

const DataError = (req, res) => {
   const statusCode = res.statusCode ? res.statusCode : 500;
   let customError = {
      statusCode,
      message: err.message || "Something went wrong, try again later",
   };

   switch (err) {
     case err.name === "CastError":
      customError.message = `Resource not found. Invalid: ${err.path}`;

     case err.code === 11000:
      customError.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
   
     case err.name === "JsonWebTokenError":
      customError.message = `Json Web Token is invalid, Try again `;

     case err.name === "ValidationError":
         customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
         customError.statusCode = 504;
   }

   res.status(statusCode).json({
     success: false,
     error: customError,
     stack: err.stack,
   });
}

module.exports = DataError;
