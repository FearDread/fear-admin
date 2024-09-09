const crypto = require("crypto");
const {getJWTToken} = require("./auth");
const cloudinary = require("cloudinary");
const UserModel = require('../models/user');

/* User CRUD methods */
/* -------------------- */
exports.read = async (req, res) => {
  console.log("readUser :: CALLED");

  await UserModel.findById(req.params.id)
    .then((user) => {
      res.status(200).send({ success: true, user });
    })
    .catch((error) => {
      throw error;
    });
};

exports.create = async (req, res) => {
  // TODO: make sure username is uniuqe and has no white spaces, only _, - , . , etc..
  const { name, username, email, password } = req.body;
  let myCloud = { public_id: '', secure_url: ''};

  if (req.body && req.body.avatar) {
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  }

  await UserModel.create({
    name, username: username || name, email, password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }})
    .then((user) => {
      if (user) {
        console.log("User Created  ::", user);
        res.status(201).send({ user, success: true, token: getJWTToken(user) })
      } else {
        res.status(500).send({success: false, error:"Unable to create user..."});
      }
    })
    .catch((error) => {
       throw error;
    });
};

exports.list = async (req, res, next) => {
  await UserModel.find({})
    .then((users) => {
      if (users && users.length > 0) {
        res.status(201).send({ success: true, users });
      } else {
        res.sttaus(500).send({success: false, users:[], error: "No Users Found"});
      }
    })
    .catch((error) => {
      throw error;
    }
  );
};

exports.update = async (req, res, next) => {
  // object with user new data
  const newUser = {};

  if (req.body.avatar !== "") {
    const user = await UserModel.findById(req.user.id);
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatar",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  newUser.name = req.body.name;
  newUser.email = req.body.email;

  // set new value of user
  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  .then((user) => {
    user.save();
    res.status(200).json({ success: true, user});
  })
  .catch((error) => {
    DataError(res, error);
  });
};

/* Admin User Methods */
/* ------------------ */

exports.delete = async (req, res, next) => {
  await UserModel.findById(req.params.id)
    .then((user) => {
      const imageId = user.avatar.public_id;
      cloudinary.v2.uploader.destroy(imageId);

      user.remove();
      res.status(200).send({ success: true });
    }).catch((error) => {
      DataError(res, error);
    })
};

exports.updateRole = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    .then((user) => {
      res.status(200).json({
        success: true,
        user: user
      });
    })
    .catch((error) => {
      //dbError(res, error);
    });
};


/* Password Methods ( reset, forgot, update ) */
/* ------------------------------------------ */
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
   // return next(new AppError("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  let resetPasswordUrl = "";

  const isLocal = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  if (isLocal) {
    resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  } else {
    resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  }

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  /*
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // if there any Error then  user.resetPasswordToken and user.resetPasswordExpire has value saved already then undefined both od them for fresh value if user want to try again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    //return next(new AppError(error.message, 500));
  }
      */
};

exports.resetPassword = async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    //return next(new AppError("Password does not equal to confirmPassword", 400));
  }
  if (!req.params.token) {
    //return next(new AppError("Reset Password Token is invalid or has been expired", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .toString("hex");

  await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }})
    .then((user) => {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;   
      user.save();

      Auth.sendJWTToken(updated, 200, res);
    }).catch((error) => {
      //dbError(res, error);
    });
};

exports.updatePassword = async (req, res, next) => {
  if (req.body.newPassword !== req.body.confirmPassword) {
    //return next(new AppError("password does not match", 400));
  }

  await UserModel.findById(req.user.id)
    .select("+password")
    .then((user) => {
      const isPasswordMatched = user.compare(req.body.oldPassword);
      if (!isPasswordMatched) {
       // return next(new AppError("Old password is incorrect", 400));
      }

      user.password = req.body.newPassword;
      user.save();

      //Auth.sendJWTToken(user, 200, res);
    }).catch((error) => {
      //dbError(res, error);
    });
};
