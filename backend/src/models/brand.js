const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    logo: { type: Object, required: false, default:
        { public_id: '', secure_url: ''}},
    isActive: { type: Boolean, default: true }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
