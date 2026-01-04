const mongoose = require("mongoose");
const crypto = require("crypto");

const paymentMethodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true, },
    paymentType: {  type: String, enum: ["razorpay", "paypal", "credit-card", "upi", "netbanking", "stripe"], required: true, },
    paymentToken: { type: String, required: true, },
    isDefault: { type: Boolean, default: false, },
    isActive: { type: Boolean,  default: true, },
    cardDetails: {
      last4: { type: String, maxlength: 4, },
      brand: { type: String, },
      expiryMonth: { type: String, maxlength: 2, },
      expiryYear: { type: String, maxlength: 4, },
      cardholderName: { type: String, },
      fingerprint: { type: String,} 
    },
    paypalDetails: { 
      email: { type: String, },
      payerId: { type: String, },
    },
    upiDetails: {
      vpa: { type: String, },
    },
    billingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true, index: true, },
    metadata: { type: Map,  of: String, },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentMethodSchema.index({ userId: 1, isDefault: 1 });
paymentMethodSchema.index({ userId: 1, isActive: 1 });
paymentMethodSchema.index({ createdAt: -1 });

// Middleware to ensure only one default payment method per user
paymentMethodSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    // Remove default flag from other payment methods for this user
    await mongoose.model("PaymentMethod").updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
        isDefault: true,
      },
      { isDefault: false }
    );
  }
  next();
});
paymentMethodSchema.statics.getDefaultPaymentMethod = async function (userId) {
  return await this.findOne({
    userId,
    isDefault: true,
    isActive: true,
  });
};
paymentMethodSchema.statics.getUserPaymentMethods = async function (userId) {
  return await this.find({
    userId,
    isActive: true,
  }).sort({ isDefault: -1, createdAt: -1 });
};

paymentMethodSchema.methods.setAsDefault = async function () {
  await mongoose.model("PaymentMethod").updateMany(
    {
      userId: this.userId,
      _id: { $ne: this._id },
    },
    { isDefault: false }
  );
  
  this.isDefault = true;
  return await this.save();
};
paymentMethodSchema.methods.softDelete = async function () {
  this.isActive = false;
  if (this.isDefault) {
    this.isDefault = false;
    // Optionally set another method as default
    const otherMethod = await mongoose.model("PaymentMethod").findOne({
      userId: this.userId,
      _id: { $ne: this._id },
      isActive: true,
    });
    if (otherMethod) {
      otherMethod.isDefault = true;
      await otherMethod.save();
    }
  }
  return await this.save();
};

// Virtual for masked card number display
paymentMethodSchema.virtual("displayNumber").get(function () {
  if (this.cardDetails?.last4) {
    return `•••• •••• •••• ${this.cardDetails.last4}`;
  }
  if (this.paypalDetails?.email) {
    return this.paypalDetails.email;
  }
  if (this.upiDetails?.vpa) {
    return this.upiDetails.vpa;
  }
  return "Payment Method";
});

// Virtual for expiry display
paymentMethodSchema.virtual("expiryDisplay").get(function () {
  if (this.cardDetails?.expiryMonth && this.cardDetails?.expiryYear) {
    return `${this.cardDetails.expiryMonth}/${this.cardDetails.expiryYear}`;
  }
  return null;
});

// Virtual for checking if card is expired
paymentMethodSchema.virtual("isExpired").get(function () {
  if (this.cardDetails?.expiryMonth && this.cardDetails?.expiryYear) {
    const now = new Date();
    const expiryDate = new Date(
      parseInt(this.cardDetails.expiryYear),
      parseInt(this.cardDetails.expiryMonth) - 1
    );
    return now > expiryDate;
  }
  return false;
});

// Ensure virtuals are included in JSON
paymentMethodSchema.set("toJSON", { virtuals: true });
paymentMethodSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);