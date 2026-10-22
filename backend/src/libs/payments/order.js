const mongoose = require("mongoose");

/**
 * Marks a local Order as paid after a gateway has CONFIRMED payment
 * (Stripe webhook / PayPal capture response). Never call this from client input.
 *
 * Returns the order, or null when there is nothing to do / the data doesn't match.
 * Throws only on database errors so a webhook can answer 500 and be retried.
 */
exports.markOrderPaid = async (logger, localOrderId, { method, paid, details = {} }) => {
    if (!localOrderId || !mongoose.isValidObjectId(String(localOrderId))) return null;

    const Order = require("../../models/order");
    const order = await Order.findById(localOrderId);

    if (!order) {
        logger.warn(`Payments :: order ${localOrderId} not found, skipping`);
        return null;
    }

    if (order.paymentStatus === "completed") return order; // webhook + capture can both fire

    if (paid != null && Math.abs(Number(order.total) - Number(paid)) > 0.01) {
        logger.error(`Payments :: amount mismatch on order ${localOrderId} (order ${order.total}, paid ${paid}); not marking paid`);
        return null;
    }

    order.paymentMethod = method;
    order.paymentStatus = "completed";
    order.orderStatus = "confirmed";

    Object.entries(details).forEach(([key, value]) => order.set(`paymentDetails.${key}`, value));
    order.set("paymentDetails.paidAt", new Date());

    await order.save(); // pre-save hook appends statusHistory
    logger.info(`Payments :: order ${localOrderId} marked paid via ${method}`);
    return order;
};