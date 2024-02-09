
const models = require("../models");
const jwt = require("jsonwebtoken");
const config = require('../config');
const AppError = require("../utils/app.error");
const asyncWrapper = require('express-async-handler');


exports.isAuth = asyncWrapper(async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies;

  if ( !authHeader || !authCookie ) {
    return next( new AppError("Unauthorized", 401) )
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, config.JWT_SECRET);
    const user = await models.users.findById(deCodeToken.id);

    req.user = user;
    next();
  
    } catch (err) {
      console.log(err).json();
      new AppError("No Admin User Found", 401);
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
