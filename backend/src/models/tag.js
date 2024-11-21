const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true, index: true }
    
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);