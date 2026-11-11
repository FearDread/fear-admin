const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Build the snapshot from the Product doc — never trust client-supplied
// price/title/image.
const snapshotFromProduct = (p) => ({
    title: p.title ?? p.name ?? 'Untitled',
    image: p.images?.[0]?.url ?? p.image ?? '',
    price: p.salePrice ?? p.price ?? 0,
    originalPrice: p.salePrice && p.salePrice < p.price ? p.price : undefined,
    rating: p.rating,
    sku: p.sku,
    category: p.category,
});

// Shape the client's WishlistItem expects: id + string productId.
const serialize = (row, product) => {
    const live = product ? snapshotFromProduct(product) : {};
    return {
        id: String(row._id),
        productId: String(row.productId),
        title: live.title ?? row.title,
        image: live.image || row.image,
        price: live.price ?? row.price,
        originalPrice: live.originalPrice ?? row.originalPrice,
        rating: live.rating ?? row.rating,
        sku: live.sku ?? row.sku,
        category: live.category ?? row.category,
        addedAt: row.addedAt,
    };
};

// GET /wishlist
exports.getWishlist = async (req, res) => {
    try {
        const rows = await Wishlist.find({ user: req.user._id }).sort({ addedAt: -1 }).lean();

        const products = await Product.find({ _id: { $in: rows.map((r) => r.productId) } })
            .select('title name price salePrice images image category rating sku')
            .lean();
        const byId = new Map(products.map((p) => [String(p._id), p]));

        const result = rows.map((r) => serialize(r, byId.get(String(r.productId))));
        return res.json({ result, success: true, message: 'Wishlist fetched', count: result.length });
    } catch (err) {
        console.error('[wishlist] getWishlist:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
    }
};

// POST /wishlist   body: { productId }  (other fields are ignored)
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body ?? {};
        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'A valid productId is required' });
        }

        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Atomic upsert: safe against double-clicks and concurrent requests,
        // and returns the existing row if it's already saved.
        const row = await Wishlist.findOneAndUpdate(
            { user: req.user._id, productId: product._id },
            { $setOnInsert: { user: req.user._id, productId: product._id, ...snapshotFromProduct(product) } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        ).lean();

        return res.status(201).json({
            result: serialize(row, product),
            success: true,
            message: 'Added to wishlist',
        });
    } catch (err) {
        console.error('[wishlist] addToWishlist:', err);
        return res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
    }
};

// DELETE /wishlist/:id   (id = wishlist entry id)
exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid wishlist id' });
        }

        // Scoped to the session user so one user can't delete another's rows.
        // Idempotent: a missing row still returns success so a double-click or
        // an optimistic-update retry doesn't surface as an error.
        await Wishlist.deleteOne({ _id: id, user: req.user._id });

        return res.json({ result: { id }, success: true, message: 'Removed from wishlist' });
    } catch (err) {
        console.error('[wishlist] removeFromWishlist:', err);
        return res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
    }
};

// DELETE /wishlist   (optional — clear everything)
exports.clearWishlist = async (req, res) => {
    try {
        await Wishlist.deleteMany({ user: req.user._id });
        return res.json({ result: null, success: true, message: 'Wishlist cleared' });
    } catch (err) {
        console.error('[wishlist] clearWishlist:', err);
        return res.status(500).json({ success: false, message: 'Failed to clear wishlist' });
    }
};