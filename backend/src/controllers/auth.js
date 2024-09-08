const Users = require('../models/user');

exports.isAdmin = () => { return null };
exports.isAuth = () => { return null };

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('login called!');
    await Users.findOne( {email: email} )
      .then((user) => {
        console.log('User Found :: ', user);                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        user.compare(password)
          .then((isMatch) => {
            if (!isMatch) {
              console.log('password dont match');
            }
            res.status(200).send({ user, success: true, token: user.generateToken() })
          })
          .catch((err) => {
              throw err;
          })
      })
      .catch((error) => {
          return next(error);
      });
  }
  
exports.logout = async (req, res) => {
    res.cookie(process.env.JWT_NAME, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200).json({ success: true, message: "User logged out",});
  };

