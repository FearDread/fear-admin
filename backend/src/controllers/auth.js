const jwt = require("jsonwebtoken")
const Users = require('../models/user');

exports.isAdmin = () => { return null };
exports.isAuth = () => { return null };

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    await Users.findOne( {email: email} )
      .then((user) => {
        if (user !== null) {
          console.log('User Found :: ', user);

          user.compare(password, user.password)
            .then((isMatch) => {
              if (!isMatch) {
                res.status(201).send({success: false, error:"Password does not match"});
              }

              const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                id: user._id,
              },
              process.env.JWT_SECRET
              );

              res.status(200).send({ user, success: true, token: token });
            }).catch((err) => {
              throw err;
            })
          }
        }).catch((error) => {
          return next(error);
      });
};
  
exports.logout = async (req, res) => {
    res.cookie(process.env.JWT_NAME, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200).json({ success: true, message: "User logged out",});
  };

