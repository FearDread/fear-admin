const User = require("../../models/user");
const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  await User.findOne({ email })
    .then((user) => {
      if (user && (user.compare(password))) {
        return res.status(200).json({ user, success: true, token: this.getJWTToken(user) });
      }
      return res.status(201).json({success: false, err: 'invalid Credientials'})
    })
    .catch((error) => { throw new Error("Could Not find User")});
}

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  await User.findOne({ email })
    .then((user) => {
      if (user && (user.compare(password))) {
        res.status(200).json({ user, success: true });
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
        console.log("user created ::", user);
        return res.status(200).json({user, success: true, token: this.getJWTToken(user)})})
      .catch((error) => { throw new Error(error);})

  } else {
    throw new Error("User Already Exists");
  }
};

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