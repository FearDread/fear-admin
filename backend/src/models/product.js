const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: false, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String, required: false },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
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
