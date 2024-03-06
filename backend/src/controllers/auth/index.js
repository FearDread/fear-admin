const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user");
const asyncHandler = require("../../_utils/asyncHandler");
const { dbError, authError, notFound, AppError } = require("../../_utils/errorHandlers");
const TypedError = require("../../_utils/ErrorHandler");
require("dotenv").config({ path: __dirname + "../.env" });

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new TypedError('login err',400, 'Missing field'))
  }

  var user = await UserModel.findOne({email: email});
  console.log('User Found :: ', user);
  
  if (!user) {
    let err = new TypedError('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
    return next(err);
  }

  await user.compare(password)
    .then((isMatch) => {
      console.log('Compare call', isMatch);
      if (!isMatch) {
        let err = new TypedError('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
      }

      this.sendJWTToken(user, 200, res);
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
  let token = req.headers['x-auth-token'] || req.headers['authorization'];
  console.log("IsAuth token ::" + token);

  if ( token.startsWith('Bearer ')) {
    token = token.slice( 7, token.length )
  }
  if (token) {
    jwt.verify( token, process.env.JWT_SECRET, ( error, decoded ) => {
        if (decoded) {
          next();
        }
        return next( error )
      })
  } else {
    let err = new TypedError('token', 401, 'invalid_field',
     {message: "Token is not supplied"})
     
    return next( err )
  }
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

exports.isValidToken = async (req, res, next) => {
  const token = req.header("x-auth-token");
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

exports.sendJWTToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const opts = {
    expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  console.log("Token: " + token);

  res.cookie(process.env.JWT_NAME, token, opts)
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