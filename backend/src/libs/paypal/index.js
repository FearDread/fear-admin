const axios = require("axios");
const crypto = require("crypto");
const { markOrderPaid } = require("../payments/order");

const ORDER_ID = /^[A-Za-z0-9_-]{8,64}$/;
const CURRENCY = /^[A-Za-z]{3}$/;

/**
 * Talks to the PayPal Orders v2 REST API directly with axios.
 * The old file required `paypal-rest-sdk` but used the `@paypal/checkout-server-sdk`
 * API (paypal.core / paypal.orders), and called `.exeute` — none of it could run.
 */
module.exports = function (fear) {
    const env = fear.getEnvironment() || {};
    const logger = fear.getLogger();

    const clientId = env.PAYPAL_CLIENT_ID;
    const clientSecret = env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Missing PayPal client ID or client secret. Please update .env");
    }

    const live = ["live", "production"].includes(String(env.PAYPAL_ENV || "").toLowerCase());
    const base = live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const defaultCurrency = (env.PAYPAL_CURRENCY || "USD").toUpperCase();

    logger.warn(`PayPal Payment Handler initialized (${live ? "live" : "sandbox"})`);

    // ── OAuth token (cached until shortly before expiry) ───────────────────
    let tokenCache = { token: null, expiresAt: 0, pending: null };

    const getAccessToken = () => {
        if (tokenCache.token && tokenCache.expiresAt > Date.now() + 60000) return Promise.resolve(tokenCache.token);
        if (tokenCache.pending) return tokenCache.pending;

        tokenCache.pending = axios
            .post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
                auth: { username: clientId, password: clientSecret },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                timeout: 15000,
            })
            .then(({ data }) => {
                tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000, pending: null };
                return tokenCache.token;
            })
            .catch((err) => {
                tokenCache.pending = null;
                throw err;
            });

        return tokenCache.pending;
    };

    const api = (method, path, data, headers = {}) =>
        getAccessToken().then((token) =>
            axios({
                method,
                url: `${base}${path}`,
                data,
                timeout: 15000,
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...headers },
            }).then((r) => r.data)
        );

    // ── response helpers ───────────────────────────────────────────────────
    const fail = (res, status, message, error) => {
        const detail = error && error.response && error.response.data;
        if (error) logger.error(`PayPal Error :: ${message} :: ${detail ? JSON.stringify(detail) : error.message}`);
        return res.status(status).json({
            success: false,
            message,
            code: detail && ((detail.details && detail.details[0] && detail.details[0].issue) || detail.name),
        });
    };

    // 422 (e.g. INSTRUMENT_DECLINED) must reach the client so it can restart the flow;
    // anything else upstream is a gateway problem.
    const upstreamFail = (res, message, error) => {
        const status = error && error.response && error.response.status;
        return fail(res, status === 422 || status === 404 ? status : 502, message, error);
    };

    const validId = (id) => ORDER_ID.test(String(id || ""));

    return {
        // ── GET /config — client id for <PayPalScriptProvider> in Next ───────
        getConfig(req, res) {
            return res.status(200).json({
                success: true,
                result: { clientId, currency: defaultCurrency, environment: live ? "live" : "sandbox" },
            });
        },

        // ── POST /order  { amount (dollars), currency?, orderId?, description? }
        // Returns { id } — hand `id` back from createOrder().
        createPayPalOrder(req, res) {
            const { amount, currency = defaultCurrency, orderId, description } = req.body || {};
            const value = Number(amount);

            if (!Number.isFinite(value) || value <= 0) {
                return fail(res, 400, "Invalid amount. Must be a positive number.");
            }
            if (!CURRENCY.test(String(currency))) return fail(res, 400, "Invalid currency");

            const unit = { amount: { currency_code: String(currency).toUpperCase(), value: value.toFixed(2) } };
            if (orderId) unit.custom_id = String(orderId).slice(0, 127); // local Order _id, comes back on capture
            if (description) unit.description = String(description).slice(0, 127);

            return api(
                "POST",
                "/v2/checkout/orders",
                { intent: "CAPTURE", purchase_units: [unit] },
                { "PayPal-Request-Id": req.get("Idempotency-Key") || crypto.randomUUID() }
            )
                .then((order) => {
                    logger.info(`PayPal order created :: ${order.id}`);
                    return res.status(201).json({ success: true, id: order.id, orderId: order.id, status: order.status });
                })
                .catch((error) => upstreamFail(res, "Error creating PayPal order", error));
        },

        // ── GET /order/:id
        getPayPalOrder(req, res) {
            const { id } = req.params;
            if (!validId(id)) return fail(res, 400, "Invalid order ID");

            return api("GET", `/v2/checkout/orders/${id}`)
                .then((order) => {
                    const unit = (order.purchase_units && order.purchase_units[0]) || {};
                    return res.status(200).json({
                        success: true,
                        result: { id: order.id, status: order.status, amount: unit.amount, customId: unit.custom_id },
                    });
                })
                .catch((error) => upstreamFail(res, "Error retrieving PayPal order", error));
        },

        // ── POST /capture  { orderId }  (react-paypal-js's `orderID` also accepted)
        capturePayPalOrder(req, res) {
            const orderId = (req.body || {}).orderId || (req.body || {}).orderID;
            if (!validId(orderId)) return fail(res, 400, "Invalid or missing orderId");

            return api("POST", `/v2/checkout/orders/${orderId}/capture`, {}, { "PayPal-Request-Id": `capture-${orderId}` })
                .then(async (result) => {
                    const unit = (result.purchase_units && result.purchase_units[0]) || {};
                    const capture = unit.payments && unit.payments.captures && unit.payments.captures[0];
                    const completed = result.status === "COMPLETED" && capture && capture.status === "COMPLETED";

                    logger.info(`PayPal order captured :: ${result.id} :: ${result.status}`);

                    if (completed) {
                        try {
                            await markOrderPaid(logger, capture.custom_id || unit.custom_id, {
                                method: "paypal",
                                paid: Number(capture.amount && capture.amount.value),
                                details: { paypalOrderId: result.id, paypalCaptureId: capture.id, transactionId: capture.id },
                            });
                        } catch (err) {
                            // Money has moved; don't tell the shopper it failed. Log for reconciliation.
                            logger.error(`PayPal captured ${capture.id} but local order update failed :: ${err.message}`);
                        }
                    }

                    return res.status(200).json({
                        success: !!completed,
                        orderId: result.id,
                        status: result.status,
                        captureId: capture && capture.id,
                        amount: capture && capture.amount,
                        payerEmail: result.payer && result.payer.email_address,
                    });
                })
                .catch((error) => upstreamFail(res, "Error capturing PayPal order", error));
        },
    };
};