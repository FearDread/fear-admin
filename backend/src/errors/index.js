const CustomError = require("./custom-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const AuthError = require("./unauthenticated");

const dbError = () => {
   const statusCode = res.statusCode ? res.statusCode : 500;
   let message = "";

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
     message,
     stack: err.stack,
   });
}

module.exports = {
   CustomError,
   BadRequestError,
   NotFoundError,
   AuthError,
   dbError
};
