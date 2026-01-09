const paypal = require('paypal');

module.exports = function (fear) {
    const _this = {};
    _this.logger = fear.getLogger();
    _this.validator = fear.getValidator();
    _this.env = fear.getEnvironment();

    _this.clientId = _this.env.PAYPAL_CLIENT_ID;
    _this.clientSecret = _this.env.PAYPAL_CLIENT_SECRET;

    if (!_this.clientId || !_this.clientSecret) {
        throw new Error('Missing PayPal client ID or client secret. Please update .env');
    }
    _this.initEnvironment = () => {
        return new paypal.core.SandboxEnvironment(_this.clientId, _this.clientSecret);
    };
    _this.initClient = () => {
        return new paypal.core.PayPalHttpClient(_this.initEnvironment());
    };
    _this.handleError = (res, statusCode, message, error) => {
        _this.logger.error(`PayPal Error :: `, error);
        return res.status(statusCode).json({ success: false, message: message, error: error.message || error });
    };

    return {
        createPayPalOrder(req, res) {
            const { amount, currency = "USD" } = req.body;

            // Validate required fields
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ success: false, message: "Invalid amount. Must be a positive number." });
            }

            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toString(),
                    },
                }],
            });

            return _this.initClient()
                .exeute(request)
                .then((result) => {
                    _this.logger.info(`PayPal order created successfully: ${result.id}`);
                    return res.status(200).json({success: true, orderId: result.id, order: result });
                })
                .catch(error => _this.handleError( res, 500, "Error creating PayPal order", error ));
        },

        capturePayPalOrder(req, res) {
            const { orderId } = req.body;

            if (!orderId || typeof orderId !== 'string') {
                return res.status(400).json({ success: false, message: "Invalid or missing orderId" });
            }

            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});

            return _this.initClient()
                .execute(request)
                .then((result) => {
                    _this.logger.info(`PayPal order captured successfully: ${result.id}`);
                    return res.status(200).json({
                        success: true,
                        captureId: result.id,
                        status: result.status,
                        capture: result
                    });
                })
                .catch(error => _this.handleError( res, 500, "Error capturing PayPal order", error ));
        }
    };
};