
const models = require("../models");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const errorHandler = require("../handlers/errorHandler");
const asyncWrapper = require('express-async-handler');

exports.isAuthenticatedUser = asyncWrapper(async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const userDetails = await User.findById(deCodeToken.id);

    req.user = userDetails;
    next();
  
    } catch (err) {
      console.log(err).json();
      errorHandler.AppError("No Admin User Found", 401);
    }
});

exports.authorizeRoles = (...roles) => {
 
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
        return next( errorHandler.AppError("Unauthorized", 401) );
    }
   
    next();
 }
};

exports.isValidToken = async (req, res, next) => {
  const msg = '';
  try {
    const token = req.header("x-auth-token");

    if (!token)
      msg = "No authentication token, authorization denied.";
      return (      
        errorHandler.authError(false, null, msg, true)
        )


    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Token verification failed, authorization denied.",
        jwtExpired: true,
      });

    const admin = await Admin.findOne({ _id: verified.id });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });

    if (admin.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin is already logout try to login, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.admin = admin;
      // console.log(req.admin);
      next();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
}