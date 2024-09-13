const User = require("../../models/userModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../handler");

exports.authenticate = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired,Please Login again");
    }
  } else {
    throw new Error("THere is no token attached to header");
  }
}

exports.getJWTToken = (user) => {
  const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      id: user._id,
    }, process.env.JWT_SECRET);

  return token;
}

exports.isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("Your are not an admin");
  } else {
    next();
  }
}

module.exports = { authenticate, getJWTToken, isAdmin };