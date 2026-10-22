const stripe = require("stripe");
const { markOrderPaid } = require("../payments/order");

const MIN_AMOUNT = 50; // smallest charge Stripe accepts for USD, in cents
const CURRENCY = /^[a-z]{3}$/i;
const PI_ID = /^pi_[A-Za-z0-9_]+$/;

module.exports = function (fear) {
    const env = fear.getEnvironment() || {};
    const logger = fear.getLogger();

    if (!env.STRIPE_SECRET_KEY) {
        throw new Error("Missing STRIPE_SECRET_KEY. Please update .env");
    }

    const client = stripe(env.STRIPE_SECRET_KEY);
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    logger.warn("Stripe Payment Handler initialized");

    // ── helpers ────────────────────────────────────────────────────────────
    // (the old handleError/handleSuccess were called with 4-5 args but took 3)
    const fail = (res, status, message, error) => {
        if (error) logger.error(`Stripe Error :: ${message} :: ${error.message}`);
        return res.status(status).json({ success: false, message, code: error && error.code });
    };

    const stripeFail = (res, message, error) =>
        fail(res, error.statusCode && error.statusCode < 500 ? error.statusCode : 500, message, error);

    const ok = (res, result, message = "Stripe Success", status = 200) =>
        res.status(status).json({ success: true, message, result });

    const idempotency = (req) => {
        const key = req.get("Idempotency-Key");
        return key ? { idempotencyKey: key } : undefined;
    };

    // Only flat string metadata, capped, so a client can't stuff arbitrary data in.
    const cleanMetadata = (metadata, orderId) => {
        const out = {};
        if (metadata && typeof metadata === "object") {
            Object.entries(metadata).slice(0, 20).forEach(([k, v]) => {
                out[String(k).slice(0, 40)] = String(v).slice(0, 500);
            });
        }
        if (orderId) out.orderId = String(orderId);
        return out;
    };

    // Never include client_secret in logs or in GET responses.
    const publicIntent = (pi, withSecret = false) => ({
        id: pi.id,
        status: pi.status,
        amount: pi.amount,
        currency: pi.currency,
        ...(withSecret && { clientSecret: pi.client_secret }),
        ...(pi.last_payment_error && { error: pi.last_payment_error.message }),
    });

    return {
        // ── GET /config — publishable key for loadStripe() in Next ───────────
        getConfig: (req, res) => {
            if (!env.STRIPE_PUBLISHABLE_KEY) return fail(res, 503, "Stripe publishable key not configured");
            return ok(res, { publishableKey: env.STRIPE_PUBLISHABLE_KEY });
        },

        // ── POST /intent  { amount (cents), currency?, orderId?, metadata?, receiptEmail?, description? }
        createPaymentIntent: (req, res) => {
            const { amount, currency = "usd", orderId, metadata, receiptEmail, description } = req.body || {};
            const cents = Number(amount);

            if (!Number.isInteger(cents) || cents < MIN_AMOUNT) {
                return fail(res, 400, `Amount must be an integer number of cents (minimum ${MIN_AMOUNT})`);
            }
            if (!CURRENCY.test(String(currency))) return fail(res, 400, "Invalid currency");

            const params = {
                amount: cents,
                currency: String(currency).toLowerCase(),
                automatic_payment_methods: { enabled: true },
                metadata: cleanMetadata(metadata, orderId),
            };
            if (receiptEmail) params.receipt_email = String(receiptEmail);
            if (description) params.description = String(description).slice(0, 300);

            return client.paymentIntents
                .create(params, idempotency(req))
                .then((pi) => {
                    logger.info(`Stripe intent created :: ${pi.id}`);
                    return ok(res, publicIntent(pi, true), "Payment intent created", 201);
                })
                .catch((error) => stripeFail(res, "Failed to create payment intent", error));
        },

        // ── GET /intent/:id — status check after redirect (no client secret returned)
        retrievePaymentIntent: (req, res) => {
            const { id } = req.params;
            if (!PI_ID.test(id)) return fail(res, 400, "Invalid payment intent ID");

            return client.paymentIntents
                .retrieve(id)
                .then((pi) => ok(res, publicIntent(pi)))
                .catch((error) => stripeFail(res, "Failed to retrieve payment intent", error));
        },

        // ── PUT /intent/:id  { amount?, metadata? } — cart changed before payment
        updatePaymentIntent: (req, res) => {
            const { id } = req.params;
            const { amount, metadata } = req.body || {};
            if (!PI_ID.test(id)) return fail(res, 400, "Invalid payment intent ID");

            const params = {};
            if (amount !== undefined) {
                const cents = Number(amount);
                if (!Number.isInteger(cents) || cents < MIN_AMOUNT) {
                    return fail(res, 400, `Amount must be an integer number of cents (minimum ${MIN_AMOUNT})`);
                }
                params.amount = cents;
            }
            if (metadata) params.metadata = cleanMetadata(metadata);
            if (!Object.keys(params).length) return fail(res, 400, "Nothing to update");

            return client.paymentIntents
                .update(id, params)
                .then((pi) => ok(res, publicIntent(pi, true), "Payment intent updated"))
                .catch((error) => stripeFail(res, "Failed to update payment intent", error));
        },

        // ── POST /intent/:id/cancel
        cancelPaymentIntent: (req, res) => {
            const { id } = req.params;
            if (!PI_ID.test(id)) return fail(res, 400, "Invalid payment intent ID");

            return client.paymentIntents
                .cancel(id)
                .then((pi) => ok(res, publicIntent(pi), "Payment intent cancelled"))
                .catch((error) => stripeFail(res, "Failed to cancel payment intent", error));
        },

        // ── POST /webhook — needs req.rawBody (see FEAR.js json verify hook)
        handleWebhook: async (req, res) => {
            const sig = req.headers["stripe-signature"];
            if (!sig) return fail(res, 400, "Missing stripe-signature header");
            if (!webhookSecret) return fail(res, 500, "Webhook secret not configured");
            if (!req.rawBody) return fail(res, 500, "Raw request body unavailable");

            let event;
            try {
                event = client.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
            } catch (error) {
                return fail(res, 400, "Webhook signature verification failed", error);
            }

            logger.info(`Stripe webhook :: ${event.type}`);

            try {
                const pi = event.data.object;

                if (event.type === "payment_intent.succeeded") {
                    await markOrderPaid(logger, pi.metadata && pi.metadata.orderId, {
                        method: "stripe",
                        paid: pi.amount_received / 100,
                        details: { stripePaymentId: pi.id, transactionId: pi.latest_charge || pi.id },
                    });
                } else if (event.type === "payment_intent.payment_failed") {
                    logger.warn(`Stripe payment failed :: ${pi.id} :: ${pi.last_payment_error && pi.last_payment_error.message}`);
                }
            } catch (error) {
                // DB problem: answer 500 so Stripe retries the event.
                return fail(res, 500, "Webhook handling failed", error);
            }

            return res.status(200).json({ success: true, received: true });
        },

        // ── Admin-only helpers (routed behind isAuthorized + admin role) ─────
        createRefund: (req, res) => {
            const { paymentIntentId, amount, reason } = req.body || {};
            if (!PI_ID.test(String(paymentIntentId || ""))) return fail(res, 400, "Valid payment intent ID is required");

            const params = { payment_intent: paymentIntentId };
            if (amount) params.amount = Number(amount);
            if (reason) params.reason = reason;

            return client.refunds
                .create(params, idempotency(req))
                .then((r) => ok(res, r, "Refund created"))
                .catch((error) => stripeFail(res, "Failed to create refund", error));
        },

        listCustomers: (req, res) => {
            const limit = Number(req.query.limit || 10);
            if (!Number.isInteger(limit) || limit < 1 || limit > 100) return fail(res, 400, "Limit must be 1-100");

            return client.customers
                .list({ limit })
                .then((r) => res.status(200).json({ success: true, message: "Customers retrieved", result: r.data, count: r.data.length }))
                .catch((error) => stripeFail(res, "Failed to list customers", error));
        },

        createCustomer: (req, res) => {
            const { email, name, metadata } = req.body || {};
            if (!email) return fail(res, 400, "Email is required");

            return client.customers
                .create({ email, name, metadata: cleanMetadata(metadata) })
                .then((r) => ok(res, r, "Customer created"))
                .catch((error) => stripeFail(res, "Failed to create customer", error));
        },

        retrieveCustomer: (req, res) =>
            client.customers
                .retrieve(req.params.id)
                .then((r) => ok(res, r, "Customer retrieved"))
                .catch((error) => stripeFail(res, "Failed to retrieve customer", error)),

        saveStripePayment: (req, res) => {
            const { paymentMethodId, customerId } = req.body || {};
            if (!paymentMethodId || !customerId) return fail(res, 400, "Payment method ID and customer ID are required");

            return client.paymentMethods
                .attach(paymentMethodId, { customer: customerId })
                .then(() => client.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } }))
                .then((r) => ok(res, { id: r.id }, "Payment method saved"))
                .catch((error) => stripeFail(res, "Failed to save payment method", error));
        },
    };
};