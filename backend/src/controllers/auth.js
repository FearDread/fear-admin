const jwt = require("jsonwebtoken")
const UserModel = require('../models/user');

const getJWTToken = (user) => {
  const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      id: user._id,
    }, process.env.JWT_SECRET);

  return token;
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    await UserModel.findOne( {email: email} )
      .then((user) => {
        if (user !== null) {
          console.log('User Found :: ', user);

          user.compare(password)
            .then((isMatch) => {
              console.log('paassword match == ', isMatch);
              if (!isMatch) {

                //TODO:: handle incorrect password
                // res.status(201).send({success: false, error:"Password does not match"});
              }
              user.isAuth = true;
              res.status(200).send({ user, success: true, token: getJWTToken(user) });
            }).catch((err) => {
              throw err;
            })
          }
        }).catch((error) => {
          return next(error);
      });
};
  
const logout = async (req, res) => {
    res.cookie(process.env.JWT_NAME, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200).json({ success: true, message: "User logged out",});
  };

module.exports = { login, logout, getJWTToken };