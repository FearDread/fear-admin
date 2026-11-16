const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");
const request = require("./request");

const PRODUCT_FIELDS =
    "title name price salePrice discountPrice images image category rating sku isActive";

const isObjectId = (value) =>
    typeof value === "string" && value.length === 24 && mongoose.isValidObjectId(value);

/** Terminal .catch for every handler: log, then answer 500 (detail only reaches the client in development). */
const serverError = (res, message) => (err) => {
    console.error(`[wishlist] ${message}:`, err);
    return request.fail(res, 500, message, err);
};

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

/** GET /wishlist (also /wishlist/all) → { result: [...], count } */
const getWishlist = (req, res) =>
    Wishlist.find({ user: req.user._id }).sort({ addedAt: -1 }).lean()
        .then((rows) => {
            if (!rows.length) return { rows, products: [] };

            return Product.find({ _id: { $in: rows.map((r) => r.productId) } })
                .select(PRODUCT_FIELDS)
                .lean()
                .then((products) => ({ rows, products }));
        })
        .then(({ rows, products }) => {
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

            return request.send(res, 200, result, "Wishlist retrieved successfully"); // count is automatic
        })
        .catch(serverError(res, "Could not load wishlist"));

/**
 * POST /wishlist (also /wishlist/new)   { productId }
 * Everything except productId is ignored on purpose — title/price/image are
 * looked up server-side, never trusted from the client. Idempotent.
 */
const addToWishlist = (req, res) => {
    const { productId } = req.body ?? {};
    if (!isObjectId(productId)) return request.fail(res, 400, "A valid productId is required");

    return Product.findById(productId).lean()
        .then((product) => {
            if (!product || product.isActive === false) return request.fail(res, 404, "Product not found");

            const filter = { user: req.user._id, productId: product._id };
            // user/productId come from the filter on insert; only the snapshot goes in $setOnInsert.
            const update = { $setOnInsert: snapshotFromProduct(product) };
            const options = { new: true, upsert: true };

            return Wishlist.findOneAndUpdate(filter, update, options).lean()
                .catch((err) => {
                    // Two concurrent upserts can race on the unique index; the loser just reads the winner's row.
                    if (err.code !== 11000) throw err;
                    return Wishlist.findOne(filter).lean();
                })
                .then((row) => request.created(res, serialize(row, product), "Added to wishlist"));
        })
        .catch(serverError(res, "Could not add to wishlist"));
};

/** DELETE /wishlist/:id — id is the wishlist entry id. Idempotent. */
const removeFromWishlist = (req, res) => {
    const { id } = req.params;
    if (!isObjectId(id)) return request.fail(res, 400, "Invalid wishlist id");

    // Scoped to the session user so nobody can delete another user's rows.
    return Wishlist.deleteOne({ _id: id, user: req.user._id })
        .then(() => request.ok(res, { id }, "Removed from wishlist"))
        .catch(serverError(res, "Could not remove from wishlist"));
};

/** DELETE /wishlist (also /wishlist/all) */
const clearWishlist = (req, res) =>
    Wishlist.deleteMany({ user: req.user._id })
        .then(() => request.ok(res, null, "Wishlist cleared"))
        .catch(serverError(res, "Could not clear wishlist"));

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };