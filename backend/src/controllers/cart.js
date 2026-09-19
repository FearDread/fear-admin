"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const methods = require("./crud");

const GUEST_COOKIE = "efear_cart";
const GUEST_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; 
const GUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_LINE_QUANTITY = 99;

const SHIPPING_RATES = {
    domestic: [
        { method: "Standard Shipping", cost: 0, estimatedDays: 7 },
        { method: "Express Shipping", cost: 10, estimatedDays: 3 },
        { method: "Overnight Delivery", cost: 25, estimatedDays: 1 },
    ],
    international: [{ method: "International Shipping", cost: 35, estimatedDays: 15 }],
};

// ─────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────

const money = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const sendError = (res, status, message) => res.status(status).json({ success: false, message });

const sendCart = (res, view, message, status = 200) =>
    res.status(status).json({ success: true, message, result: view });

const isObjectId = (value) =>
    typeof value === "string" && value.length === 24 && mongoose.isValidObjectId(value);

const emptyView = () => ({
    id: "",
    items: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    coupon: null,
});

function readCookie(req, name) {
    if (req.cookies && req.cookies[name]) return req.cookies[name];
    const header = req.headers && req.headers.cookie;
    if (!header) return null;
    for (const part of header.split(";")) {
        const idx = part.indexOf("=");
        if (idx === -1 || part.slice(0, idx).trim() !== name) continue;
        try {
            return decodeURIComponent(part.slice(idx + 1).trim());
        } catch {
            return null;
        }
    }
    return null;
}

const guestCookieOptions = () => ({
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: GUEST_COOKIE_MAX_AGE_MS,
    path: "/",
});

/**
 * Who owns the cart for this request?
 *   logged in  → { userId }
 *   guest      → { guestId } (cookie is issued on first write when `create`)
 *   neither    → null (nothing to read yet)
 */
function resolveOwner(req, res, { create = false } = {}) {
    if (req.user && req.user._id) return { userId: req.user._id };

    let guestId = readCookie(req, GUEST_COOKIE);
    if (!guestId || !GUEST_ID_PATTERN.test(guestId)) guestId = null;

    if (!guestId && create) {
        guestId = crypto.randomUUID();
        res.cookie(GUEST_COOKIE, guestId, guestCookieOptions());
    }
    return guestId ? { guestId } : null;
}

/**
 * Product documents in this codebase use title / salePrice / quantity (see the
 * storefront's types/product.ts). The old cart controller selected
 * name / discountPrice / stock, so accept both rather than guess.
 */
function normalizeProduct(p) {
    const base = Number(p.price) || 0;
    const sale = Number(p.salePrice ?? p.discountPrice) || 0;
    const stockRaw = p.quantity ?? p.stock;
    let stock = stockRaw == null ? Infinity : Math.max(0, Number(stockRaw) || 0);
    if (p.inStock === false) stock = 0;

    return {
        id: String(p._id),
        name: p.title ?? p.name ?? "Product",
        slug: p.slug ?? String(p._id),
        sku: p.sku ?? null,
        image: (p.images && p.images[0] && p.images[0].url) || p.image || "",
        price: sale > 0 && sale < base ? sale : base,
        stock,
        active: p.isActive !== false,
    };
}

/** Returns { ok: true, amount } or { ok: false, reason }. */
function evaluateCoupon(coupon, subtotal) {
    const now = new Date();
    if (!coupon) return { ok: false, reason: "Invalid coupon code" };
    if (!coupon.active) return { ok: false, reason: "This coupon is no longer active" };
    if (coupon.startsAt && coupon.startsAt > now) return { ok: false, reason: "This coupon is not active yet" };
    if (coupon.expiresAt && coupon.expiresAt < now) return { ok: false, reason: "This coupon has expired" };
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        return { ok: false, reason: "This coupon has reached its usage limit" };
    }
    if (subtotal < (coupon.minSubtotal || 0)) {
        return { ok: false, reason: `Add $${money(coupon.minSubtotal - subtotal).toFixed(2)} more to use this coupon` };
    }

    let amount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount != null) amount = Math.min(amount, coupon.maxDiscount);
    return { ok: true, amount: money(Math.min(amount, subtotal)) };
}

/**
 * Turns a Cart document into the `Cart` shape the storefront expects, after
 * re-syncing it with reality:
 *   - products that were deleted / deactivated / sold out are dropped
 *   - quantities are clamped to current stock
 *   - unit prices follow the live product price
 *   - a coupon that is no longer valid (expired, below minimum) is removed
 * Changes are persisted, so the cart self-heals on read.
 */
async function buildView(cart) {
    if (!cart) return emptyView();

    const productIds = cart.items.map((i) => i.productId);
    const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).lean() : [];
    const live = new Map(products.map((p) => [String(p._id), normalizeProduct(p)]));

    for (const item of [...cart.items]) {
        const p = live.get(String(item.productId));
        if (!p || !p.active || p.stock <= 0) {
            cart.items.pull(item._id);
            continue;
        }
        item.name = p.name;
        item.slug = p.slug;
        item.image = p.image;
        item.sku = p.sku;
        item.price = p.price;
        if (item.quantity > p.stock) item.quantity = p.stock;
    }

    const subtotal = money(cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0));

    let discount = 0;
    if (cart.couponCode) {
        if (cart.items.length === 0) {
            cart.couponCode = null;
        } else {
            const coupon = await Coupon.findOne({ code: cart.couponCode }).lean();
            const result = evaluateCoupon(coupon, subtotal);
            if (result.ok) discount = result.amount;
            else cart.couponCode = null;
        }
    }

    if (cart.isModified()) {
        try {
            await cart.save();
        } catch (err) {
            // A concurrent request already healed the same cart; the view we built is still correct.
            if (err.name !== "VersionError") throw err;
        }
    }

    const items = cart.items.map((i) => ({
        id: String(i._id),
        productId: String(i.productId),
        name: i.name,
        slug: i.slug || String(i.productId),
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        variant: i.variant ?? null,
        lineTotal: money(i.price * i.quantity),
    }));

    return {
        id: String(cart._id),
        items,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal,
        discount,
        total: money(subtotal - discount),
        coupon: cart.couponCode ? { code: cart.couponCode, amount: discount } : null,
    };
}

async function upsertAndMutate(owner, mutate) {
    for (let attempt = 0; attempt < 2; attempt++) {
        const cart = (await Cart.findOne(owner)) || new Cart(owner);
        const error = mutate(cart);
        if (error) return { error };
        try {
            await cart.save();
            return { cart };
        } catch (err) {
            if (err.code === 11000 && attempt === 0) continue;
            throw err;
        }
    }
    return { error: { status: 409, message: "Could not update cart, please try again" } };
}

const sameLine = (item, productId, variant) =>
    String(item.productId) === productId && (item.variant ?? null) === variant;

const quantityInCart = (cart, productId, exceptItemId = null) =>
    cart.items
        .filter((i) => String(i.productId) === productId && String(i._id) !== String(exceptItemId))
        .reduce((sum, i) => sum + i.quantity, 0);

// ─────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────

/** GET /cart — always 200; a visitor with no cart yet gets an empty one. */
const getCart = tryCatch(async (req, res) => {
    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner) : null;
    return sendCart(res, await buildView(cart), "Cart retrieved successfully");
});

/**
 * POST /cart/items   { productId, quantity?, variant? }
 * Extra fields the storefront sends (name, image, price, sku) are ignored on
 * purpose — the server looks them up.
 */
const addItem = tryCatch(async (req, res) => {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity ?? 1, 10);
    const variant = req.body.variant ? String(req.body.variant).trim().slice(0, 100) : null;

    if (!isObjectId(productId)) return sendError(res, 400, "A valid productId is required");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
        return sendError(res, 400, `Quantity must be between 1 and ${MAX_LINE_QUANTITY}`);
    }

    const product = await Product.findById(productId).lean();
    const live = product && normalizeProduct(product);
    if (!live || !live.active) return sendError(res, 404, "Product not found");
    if (live.stock <= 0) return sendError(res, 409, "This product is out of stock");

    const owner = resolveOwner(req, res, { create: true });

    const { cart, error } = await upsertAndMutate(owner, (c) => {
        if (quantityInCart(c, live.id) + quantity > live.stock) {
            return { status: 409, message: `Only ${live.stock} in stock` };
        }
        const line = c.items.find((i) => sameLine(i, live.id, variant));
        if (line) {
            if (line.quantity + quantity > MAX_LINE_QUANTITY) {
                return { status: 400, message: `You can add at most ${MAX_LINE_QUANTITY} of one item` };
            }
            line.quantity += quantity;
        } else {
            c.items.push({
                productId: live.id,
                quantity,
                variant,
                name: live.name,
                slug: live.slug,
                image: live.image,
                sku: live.sku,
                price: live.price,
            });
        }
        return null;
    });
    if (error) return sendError(res, error.status, error.message);

    return sendCart(res, await buildView(cart), "Item added to cart", 201);
});

/** PATCH /cart/items/:itemId   { quantity } */
const updateItem = tryCatch(async (req, res) => {
    const itemId = req.params.itemId ?? req.params.cartItemId; // old route param name still works
    const quantity = Number.parseInt(req.body.quantity ?? req.body.newQuantity, 10);

    if (!isObjectId(itemId)) return sendError(res, 400, "Invalid cart item ID");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
        return sendError(res, 400, `Quantity must be between 1 and ${MAX_LINE_QUANTITY}`);
    }

    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner) : null;
    const item = cart && cart.items.id(itemId);
    if (!item) return sendError(res, 404, "Cart item not found");

    const product = await Product.findById(item.productId).lean();
    const live = product && normalizeProduct(product);
    if (!live || !live.active || live.stock <= 0) {
        cart.items.pull(item._id);
        await cart.save();
        return sendError(res, 409, "This product is no longer available");
    }
    if (quantityInCart(cart, live.id, item._id) + quantity > live.stock) {
        return sendError(res, 409, `Only ${live.stock} in stock`);
    }

    item.quantity = quantity;
    await cart.save();
    return sendCart(res, await buildView(cart), "Cart item updated");
});

/** DELETE /cart/items/:itemId */
const removeItem = tryCatch(async (req, res) => {
    const itemId = req.params.itemId ?? req.params.cartItemId;
    if (!isObjectId(itemId)) return sendError(res, 400, "Invalid cart item ID");

    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner) : null;
    if (!cart || !cart.items.id(itemId)) return sendError(res, 404, "Cart item not found");

    cart.items.pull(itemId);
    if (cart.items.length === 0) cart.couponCode = null;
    await cart.save();
    return sendCart(res, await buildView(cart), "Item removed from cart");
});

/** DELETE /cart */
const clearCart = tryCatch(async (req, res) => {
    const owner = resolveOwner(req, res);
    if (owner) await Cart.deleteOne(owner);
    return sendCart(res, emptyView(), "Cart cleared");
});

/** POST /cart/coupon   { code } */
const applyCoupon = tryCatch(async (req, res) => {
    const code = String(req.body.code ?? "").trim().toUpperCase();
    if (!code) return sendError(res, 400, "A coupon code is required");

    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner) : null;
    if (!cart || cart.items.length === 0) return sendError(res, 400, "Your cart is empty");

    const current = await buildView(cart); // prunes/re-prices first so the minimum check uses real numbers
    if (current.items.length === 0) return sendError(res, 400, "Your cart is empty");

    const coupon = await Coupon.findOne({ code }).lean();
    const result = evaluateCoupon(coupon, current.subtotal);
    if (!result.ok) return sendError(res, 400, result.reason);

    cart.couponCode = coupon.code;
    await cart.save();
    return sendCart(res, await buildView(cart), "Coupon applied");
});

/** DELETE /cart/coupon */
const removeCoupon = tryCatch(async (req, res) => {
    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner) : null;
    if (cart && cart.couponCode) {
        cart.couponCode = null;
        await cart.save();
    }
    return sendCart(res, await buildView(cart), "Coupon removed");
});

/** GET /cart/shipping-estimate?postalCode=&country= */
const getShippingEstimate = tryCatch(async (req, res) => {
    const postalCode = String(req.query.postalCode ?? "").trim();
    const country = String(req.query.country ?? "United States").trim();

    if (!postalCode) return sendError(res, 400, "postalCode is required");

    const domestic = /^(us|usa|united states( of america)?)$/i.test(country);
    if (domestic && !/^\d{5}(-\d{4})?$/.test(postalCode)) {
        return sendError(res, 400, "Enter a valid US ZIP code");
    }

    const rates = domestic ? SHIPPING_RATES.domestic : SHIPPING_RATES.international;
    return res.status(200).json({
        success: true,
        message: "Shipping options retrieved successfully",
        result: rates,
        count: rates.length,
    });
});

/** GET /cart/count — total units in the cart (for a header badge without the full payload). */
const getCartCount = tryCatch(async (req, res) => {
    const owner = resolveOwner(req, res);
    const cart = owner ? await Cart.findOne(owner).lean() : null;
    const count = cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    return res.status(200).json({ success: true, message: "Cart count retrieved successfully", result: { count } });
});

/**
 * Not a route handler — call it from your login / register / Google-login
 * controllers right after the session is established:
 *
 *   await cartController.mergeGuestCart(req, res, user._id);
 *
 * Moves whatever the visitor put in their cart before signing in into their
 * account cart, then drops the guest cart and cookie. It never throws, so a
 * cart problem can't block a login.
 */
async function mergeGuestCart(req, res, userId) {
    try {
        const guestId = readCookie(req, GUEST_COOKIE);
        if (!guestId || !GUEST_ID_PATTERN.test(guestId)) return;

        const guest = await Cart.findOne({ guestId });
        if (guest && guest.items.length > 0) {
            const userCart = (await Cart.findOne({ userId })) || new Cart({ userId });

            for (const g of guest.items) {
                const productId = String(g.productId);
                const variant = g.variant ?? null;
                const existing = userCart.items.find((i) => sameLine(i, productId, variant));
                if (existing) {
                    existing.quantity = Math.min(existing.quantity + g.quantity, MAX_LINE_QUANTITY);
                } else {
                    userCart.items.push({
                        productId: g.productId,
                        quantity: g.quantity,
                        variant,
                        name: g.name,
                        slug: g.slug,
                        image: g.image,
                        sku: g.sku,
                        price: g.price,
                    });
                }
            }
            if (!userCart.couponCode && guest.couponCode) userCart.couponCode = guest.couponCode;

            await userCart.save(); // stock/price/coupon get re-validated on the next read
        }

        if (guest) await Cart.deleteOne({ _id: guest._id });
        res.clearCookie(GUEST_COOKIE, { path: "/" });
    } catch (err) {
        console.error("mergeGuestCart failed:", err);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────

// Generic CRUD stays available for the admin side; the explicit handlers win on any name clash.
const crud = methods.crudController(Cart);

module.exports = {
    ...crud,

    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getShippingEstimate,
    getCartCount,
    mergeGuestCart,

    // Legacy names, so an existing routes file keeps loading while you migrate it.
    // Note: they no longer take a :userId — the owner always comes from the session/cookie.
    createCartItem: addItem,
    getUserCart: getCart,
    emptyUserCart: clearCart,
    updateQuantity: updateItem,
    syncCartPrices: getCart, // every read already re-syncs prices
};