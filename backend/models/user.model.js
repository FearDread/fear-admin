

//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const crypto = require('crypto');
import mongoose from 'mongoose';
//simport validator from 'validator';
import { isEmail } from 'validator';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should have more than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  /* admin, seller, or user */
  role: {
    type: String,
    default: "user",
  },
  seller: {
    name: String,
    logo: String,
    description: String,
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {
    if ( this.isModified( "password" ) === false ) {
      next();
    }

    this.password = await bcrypt.hash(this.password, 10);
  });

  userSchema.methods.to_json = function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;

    return object;
  };

  userSchema.methods.get_jwt_token = function () {
    return jwt.sign(
      { id: this._id },
      { expiresIn: process.env.JWT_EXPIRE },
      process.env.JWT_SECRET
    );
  }

  userSchema.methods.get_reset_token = function () {
    const reset_token = crypto.randomBytes(20).toString("hex");

    this.reset_token = crypto
      .createHash("sha256")
      .update(resetPassToken)
      .toString("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return reset_token;
  }

  userSchema.methods.compare_pass = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

const User = mongoose.model("users", userSchema);
export default User;