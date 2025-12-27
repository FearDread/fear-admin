const mongoose = require("mongoose"); // Erase if already required
const Review = require("./review");

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: false, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: false, default: 0 },
    category: { type: mongoose.Schema.Types.String, ref: "Category" },
    brand: { type: mongoose.Schema.Types.String, ref: "Brand" , required: false },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    reviews: [Review.schema],
    isFeatured: {type: Boolean, required: false, default: false},
    images: [{
        public_id: String,
        url: String
      },
    ],
    tags: String,
    ratings: [{
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: { type: Number, default: 0 },
  }, { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
