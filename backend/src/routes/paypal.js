

module.exports = ( fear ) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const paypal = fear.getPaypal();

    router.post('/order', handler.async(paypal.createPayPalOrder))
    router.post('/capture', handler.async(paypal.capturePayPalOrder))

    return router;
}