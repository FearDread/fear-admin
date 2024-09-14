const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: false, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: Object, required: false, default: {
      public_id: '',
      secure_url: ''
    }},
    role: { type: String, default: "user" },
    isBlocked: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    address: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: { type: String },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date
    },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.compare = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.methods.token = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resettoken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
