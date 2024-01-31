const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = mongoose => {

  var schema = mongoose.Schema ({
      name: {
        type: String,
        required: [true, "Please Enter Your Name"]-
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
      },
      email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
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
      role: {
        type: String,
        default: "user",
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

      this.password = await bcrypt.hash(this.password, 10);
    });

    schema.methods.toJSON = function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;

      return object;
    };

    schema.methods.getJWTToken = function () {
    
      return jwt.sign(
        { id: this._id },
        { expiresIn: config.JWT_EXPIRE },
        config.JWT_SECRET
      );
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
    
    schema.methods.compare_pass = async function ( password ) {
      return await bcrypt.compare(password, this.password); 
    };

    const User = mongoose.model("users", schema);
    return User;
};

