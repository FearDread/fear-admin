import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + "../.env" });

interface Avatar {
  public_id?: string;
  url?: string;
}

interface Seller {
  name?: string;
  logo?: string;
  description?: string;
  rating?: number;
  numReviews?: number;
}

interface User extends Document {
  name: string;
  username?: string;
  email: string;
  password: string;
  avatar?: Avatar;
  role: string;
  isAdmin?: boolean;
  isSeller?: boolean;
  cart: mongoose.Types.ObjectId;
  createdAt: Date;
  seller?: Seller;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  compare(password: string): Promise<boolean>;
  generateToken(): string;
  getRESETToken(): string;
}

const schema: Schema<User> = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: false, unique: true },
    email: { type: String, unique: true, validate: [validator.isEmail, "Please Enter a valid Email"] },
    password: { type: String, required: true, select: true },
    avatar: {
      public_id: { type: String, required: false },
      url: { type: String, required: false }
    },
    role: { type: String, default: "admin" },
    isAdmin: { type: Boolean, default: false, required: false },
    isSeller: { type: Boolean, default: false, required: false },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
    createdAt: { type: Date, default: Date.now },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: false },
      numReviews: { type: Number, default: 0, required: false },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

schema.pre<User>("save", async function (next) {
  if (this.isModified("password") === false) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.compare = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

schema.methods.generateToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

schema.methods.getRESETToken = function (): string {
  const reset_token = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(reset_token)
    .toString("hex");

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  return reset_token;
};

export default mongoose.model<User>("user", schema);