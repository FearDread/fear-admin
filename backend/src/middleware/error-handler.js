

module.exports = DataError = (res, err) => {
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
}
