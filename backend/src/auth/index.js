const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin");
const UserModel = require("../models/user");

const { authError, notFound, AppError } = require("../handlers/errorHandlers");
const asyncWrapper = require('express-async-handler');


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Enter Email & Password", 400));
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new AppError("Invalid email or password", 401));
  }

  this.sendJWTToken(user, 200, res);
};

// logOut

exports.logout = async (req, res) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
};

exports.isAuthenticated = async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const token = req.header("x-auth-token");
  const msg = '';
  
  if (!token) {
    msg = "No authentication token, authorization denied.";
    return (authError(false, null, msg, true));
  }
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const userDetails = await UserModel.findById(decodeToken.id);

    req.user = userDetails;
    next();
  
  } catch (err) {
    console.log(err).json();
    notFound();
  }
};

exports.authorizeRoles = (...roles) => {
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
        return next( authError(false, res, "Unauthorized", true) );
    }
   
    next();
  }
};

exports.isValidToken = async (req, res, next) => {
  const msg = '';
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      msg = "No authentication token, authorization denied.";
      return ( authError(false, null, msg, true ))
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      msg = "Token verification failed, authorization denied.";
      return ( authError(false, null, msg, true ));
    }
 

    const admin = await AdminModel.findOne({ _id: verified.id });
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

exports.sendJWTToken = (user, status, res) => {
  const token = user.getJWTToken();
  
  const options = {
      expires: new Date(
          Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
  });
};