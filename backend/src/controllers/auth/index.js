const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user");
const TypedError = require("../../_utils/ErrorHandler");
const { dbError, AuthError, CustomError } = require("../../errors");
require("dotenv").config({ path: __dirname + "../.env" });

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError('Missing field'))
  }

  var user = await UserModel.findOne({email: email});
  console.log('User Found :: ', user);
  
  if (!user) {
    return next(new CustomError("Incorrect email or password"));
  }

  await user.compare(password)
    .then((isMatch) => {
      if (isMatch) {
        this.sendJWTToken(user, 200, res);
      }
      return next(new CustomError("Incorrect email or password"));
    })
    .catch((err) => {
      return next(err);
    });
}

exports.logout = async (req, res) => {
  res.cookie(process.env.JWT_NAME, null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
};

exports.isAuthenticated = ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     return next(new AuthError("Authentication invalid"));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify( token, process.env.JWT_SECRET )
    .then(( decoded ) => {
      req.user = decoded
      next();
    })
    .catch((error) => {
      return next( error )
    });
};

exports.authorizedRoles = ( ...roles ) => {
  return ( req , res , next ) => {
    if ( roles.includes( req.user.role ) === false) { 
      let err = new TypedError('Role', 401, 'Not an Admin');
      return next( err );
    }
    next();
  }
};

exports.sendJWTToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const opts = {
    expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie(process.env.JWT_TOKEN, token, opts)
     .status(statusCode).json({
      success: true,
      result: {
        token,
        user,
        isLoggedIn: true
      },
      message: "Successfully login admin"
  });
};

/*
exports.isValidToken = async (req, res, next) => {
  const token = req.header(process.env.JWT_TOKEN);
  if ( !token ) {
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
*/
