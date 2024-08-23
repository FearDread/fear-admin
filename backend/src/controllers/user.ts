import crypto from 'crypto';
import cloudinary from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import { sendEmail } from "../middleware/mail-handler";
import DataError from "../middleware/error-handler";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  await UserModel.findOne({ email: email })
    .then((user: any) => {
      console.log('User Found :: ', user);
      user.compare(password)
        .then((isMatch: boolean) => {
          if (!isMatch) {
            console.log('password dont match');
          }
          res.status(200).send({ user, success: true, token: user.generateToken() });
        })
        .catch((err: Error) => {
          DataError(res, err);
        });
    })
    .catch((error: Error) => {
      return next(error);
    });
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie(process.env.JWT_NAME as string, null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
};

export const read = async (req: Request, res: Response): Promise<void> => {
  console.log("readUser :: CALLED");

  await UserModel.findById(req.params.id)
    .then((user: any) => {
      res.status(200).send({ success: true, user });
    })
    .catch((error: Error) => {
      DataError(res, error);
    });
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;
  let myCloud: { public_id: string; secure_url: string } = { public_id: '', secure_url: '' };

  if (req.body && req.body.avatar) {
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatar",
      width: 150,
      crop: "scale",
    });
  }

  await UserModel.create({
    name, email, password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  })
    .then((user: any) => {
      console.log("User Created  ::", user);
      res.status(201).send({ user, success: true, token: user.generateToken() });
    })
    .catch((error: Error) => {
      DataError(res, error);
    });
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await UserModel.find({})
    .then((users: any) => {
      res.status(201).send({ success: true, users });
    })
    .catch((error: Error) => {
      DataError(res, error);
    });
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const newUserData: { name?: string; email?: string; avatar?: { public_id: string; url: string } } = {};

  if (req.body.avatar !== "") {
    const user: any = await UserModel.findById(req.user.id);
    const imageId: string = user.avatar.public_id;

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
  newUserData.name = req.body.name;
  newUserData.email = req.body.email;

  await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((user: any) => {
      user.save();
      res.status(200).json({ success: true, user });
    })
    .catch((error: Error) => {
      DataError(res, error);
    });
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await UserModel.findById(req.params.id)
    .then((user: any) => {
      const imageId: string = user.avatar.public_id;
      cloudinary.v2.uploader.destroy(imageId);

      user.remove();
      res.status(200).send({ success: true });
    }).catch((error: Error) => {
      DataError(res, error);
    });
};

export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const newUserData: { name: string; email: string; role: string } = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((user: any) => {
      res.status(200).json({
        success: true,
        user: user
      });
    })
    .catch((error: Error) => {
      //dbError(res, error);
    });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user: any = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    // return next(new AppError("User not found", 404));
  }

  const resetToken: string = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  let resetPasswordUrl: string = "";

  const isLocal: boolean = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  if (isLocal) {
    resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  } else {
    resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  }

  const message: string = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

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
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    //return next(new AppError(error.message, 500));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.body.password !== req.body.confirmPassword) {
    //return next(new AppError("Password does not equal to confirmPassword", 400));
  }
  if (!req.params.token) {
    //return next(new AppError("Reset Password Token is invalid or has been expired", 400));
  }

  const resetPasswordToken: string = crypto
    .createHash("sha256")
    .update(req.params.token)
    .toString("hex");

  await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
    .then((user: any) => {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.save();

      //Auth.sendJWTToken(updated, 200, res);
    }).catch((error: Error) => {
      //dbError(res, error);
    });
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.body.newPassword !== req.body.confirmPassword) {
    //return next(new AppError("password does not match", 400));
  }

  await UserModel.findById(req.user.id)
    .select("+password")
    .then((user: any) => {
      const isPasswordMatched: boolean = user.compare(req.body.oldPassword);
      if (!isPasswordMatched) {
        // return next(new AppError("Old password is incorrect", 400));
      }

      user.password = req.body.newPassword;
      user.save();

      //Auth.sendJWTToken(user, 200, res);
    }).catch((error: Error) => {
      //dbError(res, error);
    });
};