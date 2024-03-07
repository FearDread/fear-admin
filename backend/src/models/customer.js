const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CustomerSchema = mongoose.Schema({
   firstName: {
      type: String,
      required: [true, "please enter first name"],
   },
   lastName: {
      type: String,
      required: [true, "please enter last name"],
   },
   email: {
      type: String,
      required: [true, "please enter email"],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         "Please provide a valid email",
      ],
      unique: true,
   },
   username: {
      type: String,
      required: [true, "please enter username"],
      unique: true,
   },

   password: {
      type: String,
      required: [true, "please enter password"],
   },
   address: String,
   city: String,
   postalCode: String,
   country: String,
   hasOpenOrder: {
      type: Boolean,
      default: false,
   },
});

//hash password before saving to the dbs
CustomerSchema.pre("save", async function () {
   const salt = await bcrypt.genSalt(12);
   this.password = await bcrypt.hash(this.password, salt);
});

// create token
CustomerSchema.methods.createJWT = function () {
   return jwt.sign({ user_id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
   });
};

// compare password with hash in db
CustomerSchema.methods.comparePasswords = async function (candidatePassword) {
   const isMatch = await bcrypt.compare(candidatePassword, this.password);
   return isMatch;
};

const Customer = mongoose.model("customers", CustomerSchema);

module.exports = Customer;
