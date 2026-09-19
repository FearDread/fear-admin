const mongoose = require("mongoose");
const { Schema } = mongoose;
const GUEST_CART_TTL_SECONDS = 60 * 60 * 24 * 30;

const cartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 99,
        validate: { validator: Number.isInteger, message: "quantity must be an integer" },
    },
    variant: { type: String, default: null, trim: true, maxlength: 100 },

    name: { type: String, required: true },
    slug: { type: String, default: "" },
    image: { type: String, default: "" },
    sku: { type: String, default: null },
    price: { type: Number, required: true, min: 0 }, // unit price, server-derived — never trusted from the client
});

const cartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        guestId: { type: String, default: null },
        items: { type: [cartItemSchema], default: [] },
        couponCode: { type: String, default: null, uppercase: true, trim: true },
    },
    { timestamps: true }
);

cartSchema.pre("validate", function(next) {
    if (!this.userId && !this.guestId) {
        return next(new Error("A cart needs either a userId or a guestId"));
    }
    if (this.userId && this.guestId) {
        return next(new Error("A cart cannot have both a userId and a guestId"));
    }
    next();
});

// Partial indexes: `null` is the default for the "other" owner field, so a
// plain unique index would allow only one guest cart and one user cart total.
cartSchema.index(
    { userId: 1 },
    { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);
cartSchema.index(
    { guestId: 1 },
    { unique: true, partialFilterExpression: { guestId: { $type: "string" } } }
);
// Abandoned guest carts clean themselves up. Logged-in carts are never expired.
cartSchema.index(
    { updatedAt: 1 },
    {
        expireAfterSeconds: GUEST_CART_TTL_SECONDS,
        partialFilterExpression: { guestId: { $type: "string" } },
    }
);

module.exports = mongoose.model("Cart", cartSchema);