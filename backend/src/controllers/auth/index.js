const jwt = require("jsonwebtoken");
//const AdminModel = require("./src/models/admin");
const UserModel = require("../../models/user");
const asyncHandler = require("../../_utils/asyncHandler");
const { dbError, authError, notFound, AppError } = require("../../_utils/errorHandlers");
const TypedError = require("../../_utils/ErrorHandler");
require("dotenv").config({ path: __dirname + "../.env" });
/*
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ msg: "Not all fields have been entered." });
  
  await UserModel.findOne({ email }).select("+password")
    .then((user) => { 
      console.log("Found USER: " + user);
      
      const isPasswordMatched = UserModel.compare(password);
      if (!isPasswordMatched) {
        return res.status(400).json({ msg: "password does not match." });
      }

      const token = UserModel.getJWTToken();
      
      res.status(200)
      .cookie("token", token, options)
      .json({
        data: {
          success: true,
          result: user,
          token
        }
      });
    })
    .catch((err) => {
      res
      .status(500)
      .json({ success: false, result: null, message: err.message });
    })
};

*/

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const admin = await UserModel.findOne({ email: email }).select("+password");

    console.log("Found USER: " + admin);
    return res.status(200).json({
      success: true,
      result: {
        token,
        user: admin,
        isLoggedIn: true
      },
      message: "Successfully login admin",
    });
    return admin;
    if (!admin)
      return res.status(400).json({
        success: false,
        result: null,
        message: "No account with this email has been registered.",
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });

    const token = UserModel.getJWTToken()
      console.log("Token " + token);
    const result = await UserModel.findOneAndUpdate(
      { _id: admin._id },
      { isLoggedIn: true },
      {new: true}
    ).exec();

    res.json({
      success: true,
      result: {
        token,
        admin,
        isLoggedIn: result.isLoggedIn
      },
      message: "Successfully login admin",
    });
  } catch (err) {
    res
    .status(500)
    .json({ success: false, result: null, message: err.message });
  }
};


exports.register = async (req, res) => {
  try {
    let { email, password, passwordCheck, name } = req.body;

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: passwordHash
    });
    const savedAdmin = await newAdmin.save();
    res.status(200).send({
      success: true,
      admin: {
        id: savedAdmin._id,
        name: savedAdmin.name
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
    });
  }
};

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
      data: {
        success: true,
        result: user,
        token
      }
    });
};