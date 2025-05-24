const User = require("../../models/user");
//const passport = require('../../libs/passport');
const jwt = require("jsonwebtoken");
/*
exports.passportLogin = async (req, res) => {
  const { email, password } = req.body;
  passport.authenticate("login", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  })
  let cart = await Cart.findOne({ user: req.user._id });
  // if there is a cart session and user has no cart, save it to the user's cart in db
  if (req.session.cart && !cart) {
    await new Cart(req.session.cart)
      .then((cart) => {
        cart.user = req.user._id;
        cart.save(); }
      )
      .catch((error) => {
        console.log(err);
        req.flash("error", err.message);
        
        return res.redirect("/");
      });
  }
  req.session.cart = cart;

  // redirect to old URL before signing in
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/user/profile");
  }
}*/
/**
 * GET /fear/api/auth/login
 * @summary Authorize user to reach Admin / Dashboard 
 * @tags login
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
exports.login = async (req, res) => {
  const { email, password } = req.body; 
  
  try {
  let user = await User.findOne({ email });
  if (user) {

      let isMatch = user.compare(password);
      isMatch.then((pass) => {

        if ( !pass ) return res.status(400).json({success: false, error: 'Invalid Credientials'})

        let token = this.getJWTToken(res, user);
        return res.status(200).json({ user, success: true, token});
      })
      .catch((error) => { throw new Error(error); });
    }
  } catch (error) {
    throw new Error("Could Not find User", error)
  }
}

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "");
}

exports.register = async (req, res) => {
  const email = req.body.email;
  const name = req.body.firstname ? req.body.firstname + " " + req.body.lastname : req.body.name;
  const newUser = await User.findOne({ email: email });

  if (!newUser) {
    req.body.name = name;
    await User.create(req.body)
      .then((user) => { 
        let token = this.getJWTToken(res, user);
        return res.status(200).json({user, success: true, token }); })
      .catch((error) => { throw new Error(error);}).next();

  } else {
    throw new Error("User Already Exists");
  }
};

exports.isAuthorized = async (req, res, next) => {
  console.log("Cecking Authorization :: ", req.cookies);
  if ( req.cookies && req.cookies["jwt"] ) {
    let token = req.cookies.jwt;

    const deCodeToken = jwt.verify(token, process.env.JWT_SECRET);
    await userModel.findById(deCodeToken.id)
        .then((user) => { req.user = user; next(); })
        .catch((error) => { throw new Error(error); }); 

  } else {
    return res.status(401).json({success: false, message: "No Token Cookie"});
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

exports.authorizeRoles = (...roles) => {
  return (req , res , next) => {
      if (roles.includes(req.user.role) === false) { 
        throw new Error(`Role: ${req.user.role} is not allowed to access this resouce `);
      }
     next();
  }
 }  