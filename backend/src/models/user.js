const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config({ path: __dirname + "../.env" });

const schema = mongoose.Schema ({
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
      isAdmin: { type: Boolean, default: false, required: false },
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
    {
      timestamps: true,
    });

    schema.pre("save", async function( next ) {
      if ( this.isModified( "password" ) === false ) {
        next();
      }

      bcrypt.genSalt(10, function (err, salt) { 
          this.password = bcrypt.hash(this.password, salt, function (err, hash) {
            next();
          });
      });
    });
      
    schema.methods.compare = async function ( password ) {
      return await bcrypt.compare(password, this.password); 
    };

    schema.methods.generateToken = function () {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    };

    schema.methods.getRESETToken = function () {
      const reset_token = crypto.randomBytes(20).toString("hex"); 

      this.reset_token = crypto
        .createHash("sha256")
        .update(resetPassToken)
        .toString("hex");
      
      this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
      return reset_token;
    };

module.exports = mongoose.model("user", schema);