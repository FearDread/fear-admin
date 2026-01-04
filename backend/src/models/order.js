const mongoose = require("mongoose");
const Address = require("./address");

const orderItemSchema = new mongoose.Schema({
  productId: {  type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String,  required: true, },
  quantity: { type: Number, required: true, min: 1, },
  price: { type: Number, required: true, },
  discount: { type: Number,  default: 0, },
  tax: { type: Number, default: 0, },
  subtotal: { type: Number, required: true, },
  image: String,
  sku: String,
  attributes: { type: Map, of: String, },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true, },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true, },
    items: [orderItemSchema],
    subtotal: {  type: Number, required: true },
    discount: { type: Number, default: 0, },
    tax: { type: Number, default: 0, },
    shippingCost: { type: Number, default: 0, },
    total: { type: Number, required: true, },
    currency: { type: String,  default: "INR", enum: ["INR", "USD", "EUR", "GBP"], },
    paymentMethod: { type: String, enum: ["razorpay", "paypal", "credit-card", "upi", "netbanking", "cod", "stripe"], required: true, },
    paymentStatus: { type: String, enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"], default: "pending", index: true, },
    paymentDetails: {
      // Razorpay
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      // PayPal
      paypalOrderId: String,
      paypalCaptureId: String,
      // Stripe
      stripeOrderId: String,
      stripePaymentId: String,
      // Common
      transactionId: String,
      paymentMethodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
      },
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded"
      ],
      default: "pending",
      index: true,
    },
    shippingAddress: Address.schema,
    billingAddress: Address.schema,
    shippingProvider: String,
    trackingNumber: String,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    couponCode: String,
    couponDiscount: {
      type: Number,
      default: 0,
    },
    customerNote: String,
    internalNote: String,
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    returnReason: String,
    returnedAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ["none", "pending", "processing", "completed", "failed"],
      default: "none",
    },
    refundedAt: Date,
    refundTransactionId: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ "paymentDetails.razorpayOrderId": 1 });
orderSchema.index({ "paymentDetails.paypalOrderId": 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ shippingAddress: 1 });
orderSchema.index({ billingAddress: 1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to add status history
orderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
    });
  }
  next();
});

// Static method to get orders by user
orderSchema.statics.getUserOrders = async function (userId, options = {}) {
  const { status, limit = 10, skip = 0 } = options;
  const query = { userId };
  
  if (status) {
    query.orderStatus = status;
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("items.productId", "name images")
    .populate("paymentDetails.paymentMethodId")
    .populate("shippingAddress")
    .populate("billingAddress");
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$total" },
      },
    },
  ]);
  
  return stats;
};

// Instance method to mark as paid
orderSchema.methods.markAsPaid = async function (paymentInfo) {
  this.paymentStatus = "completed";
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentInfo,
    paidAt: new Date(),
  };
  this.orderStatus = "confirmed";
  return await this.save();
};

// Instance method to update order status
orderSchema.methods.updateStatus = async function (status, note, updatedBy) {
  this.orderStatus = status;
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy,
  });
  
  // Update specific dates based on status
  if (status === "delivered") {
    this.actualDeliveryDate = new Date();
  } else if (status === "cancelled") {
    this.cancelledAt = new Date();
    this.cancelledBy = updatedBy;
  } else if (status === "returned") {
    this.returnedAt = new Date();
  }
  
  return await this.save();
};

// Instance method to process refund
orderSchema.methods.processRefund = async function (amount, transactionId) {
  this.refundAmount = amount || this.total;
  this.refundStatus = "completed";
  this.refundedAt = new Date();
  this.refundTransactionId = transactionId;
  this.paymentStatus = amount >= this.total ? "refunded" : "partially_refunded";
  this.orderStatus = "refunded";
  return await this.save();
};

// Instance method to add tracking information
orderSchema.methods.addTracking = async function (provider, trackingNumber, estimatedDelivery) {
  this.shippingProvider = provider;
  this.trackingNumber = trackingNumber;
  this.estimatedDeliveryDate = estimatedDelivery;
  this.orderStatus = "shipped";
  return await this.save();
};

// Virtual for order age in days
orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for items count
orderSchema.virtual("itemsCount").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for checking if order can be cancelled
orderSchema.virtual("canCancel").get(function () {
  return ["pending", "confirmed", "processing"].includes(this.orderStatus);
});

// Virtual for checking if order can be returned
orderSchema.virtual("canReturn").get(function () {
  const returnWindow = 7; // days
  return (
    this.orderStatus === "delivered" &&
    this.orderAge <= returnWindow
  );
});

// Ensure virtuals are included in JSON
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);