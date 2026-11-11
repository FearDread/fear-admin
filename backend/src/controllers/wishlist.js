"use strict";

const mongoose = require("mongoose");
const { tryCatch } = require("../libs/handler/error");
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

const PRODUCT_FIELDS =
    "title name price salePrice discountPrice images image category rating sku isActive";

const sendError = (res, status, message) => res.status(status).json({ success: false, message });

const isObjectId = (value) =>
    typeof value === "string" && value.length === 24 && mongoose.isValidObjectId(value);

/**
 * Same pricing rule as controllers/cart.js normalizeProduct: a sale price only
 * counts when it is > 0 and below the base price.
 */
function snapshotFromProduct(p) {
    const base = Number(p.price) || 0;
    const sale = Number(p.salePrice ?? p.discountPrice) || 0;
    const onSale = sale > 0 && sale < base;

    const rating = Number(p.rating);
    const category =
        typeof p.category === "string" ? p.category : p.category?.title ?? p.category?.name;

    return {
        title: p.title ?? p.name ?? "Untitled",
        image: (p.images && p.images[0] && p.images[0].url) || p.image || "",
        price: onSale ? sale : base,
        originalPrice: onSale ? base : undefined,
        rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : undefined,
        sku: p.sku || undefined,
        category: category || undefined,
    };
}

// Shape the storefront's WishlistItem expects. Live product data wins over the
// stored snapshot so sale prices / renamed titles show up without re-saving.
function serialize(row, product) {
    const live = product ? snapshotFromProduct(product) : {};
    return {
        id: String(row._id),
        productId: String(row.productId),
        title: live.title ?? row.title,
        image: live.image || row.image,
        price: live.price ?? row.price,
        originalPrice: live.originalPrice,
        rating: live.rating ?? row.rating,
        sku: live.sku ?? row.sku,
        category: live.category ?? row.category,
        addedAt: row.addedAt,
    };
}

/** GET /wishlist (also /wishlist/all) */
const getWishlist = tryCatch(async (req, res) => {
    const rows = await Wishlist.find({ user: req.user._id }).sort({ addedAt: -1 }).lean();

    const products = rows.length
        ? await Product.find({ _id: { $in: rows.map((r) => r.productId) } })
            .select(PRODUCT_FIELDS)
            .lean()
        : [];
    const live = new Map(products.map((p) => [String(p._id), p]));

    const result = [];
    const orphanIds = [];
    for (const row of rows) {
        const product = live.get(String(row.productId));
        if (!product) {
            orphanIds.push(row._id); // product was deleted — self-heal
            continue;
        }
        if (product.isActive === false) continue; // hidden, but keep the row in case it returns
        result.push(serialize(row, product));
    }

    if (orphanIds.length) {
        Wishlist.deleteMany({ _id: { $in: orphanIds } }).catch((err) =>
            console.error("[wishlist] orphan cleanup failed:", err)
        );
    }

    return res.status(200).json({
        success: true,
        message: "Wishlist retrieved successfully",
        result,
        count: result.length,
    });
});

/**
 * POST /wishlist (also /wishlist/new)   { productId }
 * Everything except productId is ignored on purpose — title/price/image are
 * looked up server-side, never trusted from the client. Idempotent.
 */
const addToWishlist = tryCatch(async (req, res) => {
    const { productId } = req.body ?? {};
    if (!isObjectId(productId)) return sendError(res, 400, "A valid productId is required");

    const product = await Product.findById(productId).lean();
    if (!product || product.isActive === false) return sendError(res, 404, "Product not found");

    const filter = { user: req.user._id, productId: product._id };
    // user/productId come from the filter on insert; only the snapshot goes in $setOnInsert.
    const update = { $setOnInsert: snapshotFromProduct(product) };
    const options = { new: true, upsert: true };

    let row;
    try {
        row = await Wishlist.findOneAndUpdate(filter, update, options).lean();
    } catch (err) {
        // Two concurrent upserts can race on the unique index; the loser just reads the winner's row.
        if (err.code !== 11000) throw err;
        row = await Wishlist.findOne(filter).lean();
    }

    return res.status(201).json({
        success: true,
        message: "Added to wishlist",
        result: serialize(row, product),
    });
});

/** DELETE /wishlist/:id — id is the wishlist entry id. Idempotent. */
const removeFromWishlist = tryCatch(async (req, res) => {
    const { id } = req.params;
    if (!isObjectId(id)) return sendError(res, 400, "Invalid wishlist id");

    // Scoped to the session user so nobody can delete another user's rows.
    await Wishlist.deleteOne({ _id: id, user: req.user._id });

    return res.status(200).json({ success: true, message: "Removed from wishlist", result: { id } });
});

/** DELETE /wishlist (also /wishlist/all) */
const clearWishlist = tryCatch(async (req, res) => {
    await Wishlist.deleteMany({ user: req.user._id });
    return res.status(200).json({ success: true, message: "Wishlist cleared", result: null });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };