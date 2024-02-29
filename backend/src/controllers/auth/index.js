const jwt = require("jsonwebtoken");
//const AdminModel = require("./src/models/admin");
const UserModel = require("../../models/user");
const asyncHandler = require("../../_utils/asyncHandler");
const { dbError, authError, notFound, AppError } = require("../../_utils/errorHandlers");
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

exports.isAuthenticated = (req, res, next) => {
  let token = ''
  if (req.headers['x-access-token'] || req.headers['authorization']) {
    token = req.headers['x-access-token'] || req.headers['authorization']
  }
  //OAuth 2.0 framework 'bearer' token type
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        let err = new TypedError('token', 401, 'invalid_field', {
          message: "Token is not valid"
        })
        return next(err)
      } else {
        //bind on request
        next()
      }
    })
  } else {
    let err = new TypedError('token', 401, 'invalid_field',
     {message: "Token is not supplied"})
     
    return next(err)
  }
};

exports.authorizedRoles = (...roles) => {
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
      let err = new TypedError('Role', 401, 'Not an Admin');
      return next( err );
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