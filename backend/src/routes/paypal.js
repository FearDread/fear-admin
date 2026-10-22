
module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const logger = fear.getLogger();
    const paypal = fear.getPaypal();

    if (!paypal) {
        logger.warn("PayPal routes mounted in disabled mode (fear.paypal not initialised)");
        router.use((req, res) => res.status(503).json({ success: false, message: "PayPal is not available" }));
        return router;
    }

    router.get("/config", paypal.getConfig);
    router.post("/order", handler.async(paypal.createPayPalOrder));
    router.get("/order/:id", handler.async(paypal.getPayPalOrder));
    router.post("/capture", handler.async(paypal.capturePayPalOrder));

    return router;
};