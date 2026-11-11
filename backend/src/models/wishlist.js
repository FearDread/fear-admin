const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true, trim: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, min: 0 },
        rating: { type: Number, min: 0, max: 5 },
        sku: { type: String, trim: true },
        category: { type: String, trim: true },
    },
    { timestamps: { createdAt: 'addedAt', updatedAt: true } },
);

// One row per (user, product). This is what makes POST idempotent and
// prevents duplicates even under double-clicks / concurrent requests.
wishlistSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);