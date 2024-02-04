
const models = require("../models");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/app.error");
const asyncWrapper = require('express-async-handler');


exports.isAuthenticatedUser = asyncWrapper(async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies;

  if ( !authHeader || !authCookie ) {
    return next( new AppError("Unauthorized", 401) )
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.users.findById(deCodeToken.id);

    req.user = user;
    next();
  
    } catch (err) {
      console.log(err).json();
      new AppError(401, "No Admin User Found");
    }
});

exports.authorizeRoles = (...roles) => {
 
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
        return next( new AppError("Unauthorized", 401) );
    }
   
    next();
 }
};
