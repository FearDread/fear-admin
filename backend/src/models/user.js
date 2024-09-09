const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config({ path: __dirname + "../.env" });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: false, unique: true },
  email: { type: String, unique: true, 
    validate: [validator.isEmail, "Please Enter a valid Email"]},
  password: { type: String, required: true, select: true },
  avatar: { 
    public_id: { type: String, required: false },
    url: { type: String, required: false }
  },
  role: { type: String, default: "admin" },
  isAdmin: { type: Boolean, default: true, required: false },
  isSeller: { type: Boolean, default: false, required: false },
  cart: {  type: mongoose.Schema.Types.ObjectID, ref: 'cart' },
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
{timestamps: true});

UserSchema.pre("save", async (next) => {
    bcrypt.genSalt(10, function (err, salt) { 
        this.password = bcrypt.hash(this.password, salt, function (err, hash) {
          next();
        });
    });
});

UserSchema.methods.compare = async (password, match) => {
  return await bcrypt.compare(password, match); 
};

UserSchema.methods.getRESETToken = () => {
      const reset_token = crypto.randomBytes(20).toString("hex"); 

      this.reset_token = crypto
        .createHash("sha256")
        .update(resetPassToken)
        .toString("hex");
      
      this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
      return reset_token;
    };

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel;