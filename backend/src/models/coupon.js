const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        type: { type: String, enum: ["percent", "fixed"], required: true },
        value: { type: Number, required: true, min: 0 }, // percent: 10 = 10% off · fixed: dollars off
        minSubtotal: { type: Number, default: 0, min: 0 },
        maxDiscount: { type: Number, default: null, min: 0 }, // optional cap for percent coupons
        startsAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null },
        usageLimit: { type: Number, default: null, min: 0 }, // null = unlimited
        usedCount: { type: Number, default: 0, min: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);