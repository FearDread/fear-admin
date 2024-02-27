const crypto = require("crypto");
const cloudinary = require("cloudinary");
const Auth = require("../auth");
const UserModel = require('../models/user');
const { dbError, AppError } = require("../_helpers/errorHandlers");
const { sendEmail } = require("../_helpers/mailHandler");

/* User CRUD methods */
/* -------------------- */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const myCloud = { public_id: '', secure_url: ''};

  if (req.body && req.body.avatar) {
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatar",
      width: 150,
      crop: "scale",
    });  
  }

  await UserModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }})
    .then((user) => {
      Auth.sendJWTToken(user, 201, res);
    })
    .catch((error) => {
      dbError(res, error);
    });
};

exports.read = async (req, res, next) => {
  console.log("READ REQUEST :: " + req.params);
  /*
  await UserModel.findById(req.user.id)
    .then((user) => {
      res.status(200).json({
        success: true,
        user
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
    */
    if (!req.params.id) {
      return next(dbError());
    }

    const user = await userModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
};

exports.list = async (req, res, next) => {
  await UserModel.find()
    .then((users) => {
      res.status(201).json({
        success: true,
        users: users,
      });
    }).catch((error) => {
      dbError(res, error);
    });
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
    res.status(200).json({
      success: true,
      user: user,
    });
  })
  .catch((error) => {
    dbError(res, error);
  });
};

/* Admin User Methods */
/* ------------------ */
exports.readUser = async (req, res) => {

  console.log("readUser :: CALLED");
  const user = await UserModel.findById(req.user.id); // user.id because we set that user into as user.req when user gose autentiction. becauae all data of users set into req.user. only user when logged in then access this function
  res.status(200).json({
    success: true,
    user, // profile details of user
  });
  /*
  if (!req.params.id) {
    return next(new AppError(`User does not exist with Id: ${req.params.id}`));
  }

  await UserModel.findById(req.params.id)
    .then((user) => {
      res.status(200).json({
        success: true,
        user: user,
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
    */
};

exports.delete = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError(`User does not exist with Id: ${req.params.id}`, 400));
  }

  await UserModel.findById(req.params.id)
    .then((user) => {
      const imageId = user.avatar.public_id;
      cloudinary.v2.uploader.destroy(imageId);

      user.remove();

      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    })
    .catch((error) => {
      dbError(res, error);
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
      dbError(res, error);
    });
};


/* Password Methods ( reset, forgot, update ) */
/* ------------------------------------------ */
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken(); // we made this method into userModel for hash resetToken
  //when we call this metod  getResetPasswordToken  . so in userModel resetPasswordToken has reset token added and resetPasswordExprie also exprie value added but not saved to data base
  await user.save({ validateBeforeSave: false }); // now save

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
    return next(new AppError(error.message, 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("Password does not equal to confirmPassword", 400));
  }
  if (!req.params.token) {
    return next(new AppError("Reset Password Token is invalid or has been expired", 400));
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
      dbError(res, error);
    });
};

exports.updatePassword = async (req, res, next) => {
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new AppError("password does not match", 400));
  }

  await UserModel.findById(req.user.id)
    .select("+password")
    .then((user) => {
      const isPasswordMatched = user.compare_pass(req.body.oldPassword);
      if (!isPasswordMatched) {
        return next(new AppError("Old password is incorrect", 400));
      }

      user.password = req.body.newPassword;
      user.save();

      Auth.sendJWTToken(user, 200, res);
    }).catch((error) => {
      dbError(res, error);
    });
};
