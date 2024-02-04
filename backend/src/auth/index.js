
const models = require("../models");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const app_error = require("../middleware");
=======
const AppError = require("../utils/app.error");
const asyncWrapper = require('express-async-handler');
>>>>>>> fe41a8de1940202aeac93cd570ccb3ff3b7ed283


exports.isAuthenticatedUser = asyncWrapper(async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies;

  if ( !authHeader || !authCookie ) {
<<<<<<< HEAD
    return next( app_error.error(401, "Unauthorized") )
=======
    return next( new AppError("Unauthorized", 401) )
>>>>>>> fe41a8de1940202aeac93cd570ccb3ff3b7ed283
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.users.findById(deCodeToken.id);

    req.user = user;
    next();
  
    } catch (err) {
      console.log(err).json();
      app_error.error(401, "No Admin User Found");
    }
});

exports.authorizeRoles = (...roles) => {
 
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
<<<<<<< HEAD
        return next( app_error.error(401, "Unauthorized") );
=======
        return next( new AppError("Unauthorized", 401) );
>>>>>>> fe41a8de1940202aeac93cd570ccb3ff3b7ed283
    }
   
    next();
 }
};
