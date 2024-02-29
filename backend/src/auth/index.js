const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin");
const UserModel = require("../models/user");
const asyncHandler = require("../_helpers/asyncHandler");
const { dbError, authError, notFound, AppError } = require("../_helpers/errorHandlers");
require("dotenv").config({ path: __dirname + "../.env" });

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Enter Email & Password", 400));
  }
  
  const user = await UserModel.findOne({ email }).select("+password")

      console.log("Found USER: " + user);
      const isPasswordMatched = user.compare(password);
      if (!isPasswordMatched) {
        return next(new AppError("Invalid email or password", 401));
      }
      this.sendJWTToken(user, 200, res);
});

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

exports.isAuthenticated = asyncHandler(async ( req, res, next ) => {
  console.log("IsAuthentecated REQUEST MADE");
  
  const { token } = req.token;
  //const token = req.token;
  //const token = req.header("token");

  //f (!token) {
  //  return next(new AppError("Token Not Found", 401));
  //}
  
  const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  const userData = await UserModel.findById(decodeToken.id);

  req.user = userData;
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
      authError(req, req);
      //return next( authError(res, req.user) );
    }
    next();
  }
};

exports.isValidToken = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return ( authError(res, req) );
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return (authError(res, verified));
    }

    await UserModel.findOne({ _id: verified.id })
      .then((admin) => {
        req.admin = admin;
        next();
      })
      .catch((error) => {
        dbError(res, error);
      });
  } catch (err) {
    authError(res, err);
  }
}

exports.sendJWTToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  console.log("Token: " + token);

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      token
    });
};