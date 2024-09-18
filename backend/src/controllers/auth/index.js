const User = require("../../models/user");
const jwt = require("jsonwebtoken");

/**
 * GET /fear/api/auth/login
 * @summary Authorize user to reach Admin / Dashboard 
 * @tags login
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  await User.findOne({ email })
    .then((user) => {
      let isMatch = user.compare(password);
      isMatch.then((pass) => {
        if ( !pass ) {
          return res.status(400).json({success: false, error: 'Invalid Credientials'})
        }
        return res.status(200).json({ user, success: true, token: this.getJWTToken(res, user) });
      })
      .catch((error) => { throw new Error(error); });
    })
    .catch((error) => { throw new Error("Could Not find User")});
}

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  await User.findOne({ email })
    .then((user) => {
      if (user && (user.compare(password))) {
        
        res.status(200).json({ user, success: true, token: this.getJWTToken(user) });
      }
      res.status(300).json({success: false, err: 'invalid Credientials'})
    })
    .catch((error) => { throw new Error(error)});
}

exports.logout = async (req, res, next) => {

}

exports.register = async (req, res) => {
  const email = req.body.email;
  const newUser = await User.findOne({ email: email });

  if (!newUser) {

    await User.create(req.body)
      .then((user) => { 
        return res.status(200).json({user, success: true, token: this.getJWTToken(user)})})
      .catch((error) => { throw new Error(error);})

  } else {
    throw new Error("User Already Exists");
  }
};

exports.isAuthorized = async (req, res, next) => {
  let token = req.cookies.jwt;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
}

exports.getJWTToken = (res, user) => {
  const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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