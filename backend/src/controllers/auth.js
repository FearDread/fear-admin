const UserModel = require('../models/user');
const auth = require("../libs/auth");

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    await UserModel.findOne({email: email}).then((user) => {
        if (user !== null) {
          console.log('User Found :: ', user);
          const isMatch = user.compare(password);
          console.log('paassword match == ', isMatch);
          if (!isMatch) {
            res.status(201).send({success: false, error:"Password does not match"});
          }
          
          res.status(200).send({ user, success: true, token: auth.getJWTToken(user) });
        }}).catch((error) => {
          return next(error);
      });
};
  
exports.logout = async (req, res, next) => {
    res.cookie(process.env.JWT_NAME, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200).json({ success: true, message: "User logged out",});
};