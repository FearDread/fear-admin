const mongoose  = require("mongoose");
const reviewSchema = require("./review");

module.exports = mongoose.model("product", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, maxLength: 8 },
  info: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  department: { type: String },
  images: [{
    product_id: { type: String, required: true },
    url: { type: String, required: true },
  }],
  category: { type: String, required: true },
  Stock: { type: Number, required: true, maxLength: 4, default: 1 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [],
  user: { type: mongoose.Schema.ObjectId, ref: "user", required: false },
  createdAt: { type: Date, default: Date.now },
},
{
  timestamps: true
}))