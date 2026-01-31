const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref:"Product", required:true },  
    username: { type: String, required: true },
    email: { type: String, required: false, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    title: {type, String, trim: true },
    rating: { type:Number, required:true, min:1, max:5 },
    comment: { type:String, required:true },
    createdAt: { type:Date, default:Date.now }
  },
  { timestamps: true, versionKey:false}
); 


module.exports = mongoose.model("Review", reviewSchema);