const Auth = require("../controllers/auth");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const logger = fear.getLogger();
    const Stripe = fear.getStripe();

    // Payments disabled or misconfigured: fail cleanly instead of crashing on null.
    if (!Stripe) {
        logger.warn("Stripe routes mounted in disabled mode (fear.stripe not initialised)");
        router.use((req, res) => res.status(503).json({ success: false, message: "Stripe is not available" }));
        return router;
    }

    const admin = [Auth.isAuthorized, Auth.authorizeRoles("admin")];

    router.get("/config", Stripe.getConfig);

    router.post("/intent", handler.async(Stripe.createPaymentIntent));
    router.get("/intent/:id", handler.async(Stripe.retrievePaymentIntent));
    router.put("/intent/:id", handler.async(Stripe.updatePaymentIntent));
    router.post("/intent/:id/cancel", handler.async(Stripe.cancelPaymentIntent));

    router.post("/webhook", handler.async(Stripe.handleWebhook));

    router.post("/refund", ...admin, handler.async(Stripe.createRefund));
    router.get("/customers", ...admin, handler.async(Stripe.listCustomers));
    router.post("/customer", ...admin, handler.async(Stripe.createCustomer));
    router.get("/customer/:id", ...admin, handler.async(Stripe.retrieveCustomer));

    return router;
};