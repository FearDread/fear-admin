const User = require("../../models/user");
const jwt = require("jsonwebtoken");


exports.isAuthorized = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        await User.findById(decoded?.id)
          .then((user) => { req.user = user; next();})
          .catch((error) => {
            throw new Error("Could not verify Token");
        });
      }
  } else {
    throw new Error("There is no token attached to header");
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