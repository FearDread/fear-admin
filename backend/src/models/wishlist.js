const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true, trim: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, min: 0 },
        rating: { type: Number, min: 0, max: 5 },
        sku: { type: String, trim: true },
        category: { type: String, trim: true },
    },
    { timestamps: { createdAt: "addedAt", updatedAt: true } }
);

// One row per (user, product). Makes POST idempotent and stops duplicates
// under double-clicks / concurrent requests. Its `user` prefix also serves
// "all items for this user" lookups, so no separate `user` index is needed.
wishlistSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);