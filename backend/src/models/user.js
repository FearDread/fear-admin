const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config({ path: __dirname + "../.env" });

const schema = mongoose.Schema ({
      name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        minLength: [4, "Name should have more than 4 characters"],
      },
      email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have more than 8 characters"],
        select: false, 
      },
      avatar: {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
      role: {
        type: String,
        default: "user",
      },
      cart: {
        type: Object
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
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

    schema.methods.read = function (id, cb) {
        this.findOne({_id: id}, cb);
    };

    schema.methods.readByEmail = function (email, cb) {
      this.findOne({email: email}, cb);
    };

    schema.methods.list = function (cb) {
        this.find(cb);
    };
        
    schema.methods.compare = async function ( password ) {
      return await bcrypt.compare(password, this.password); 
    };

    schema.methods.getJWTToken = function () {
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

module.exports = mongoose.model("Users", schema);