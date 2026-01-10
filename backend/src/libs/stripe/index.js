const stripe = require('stripe');

module.exports = function ( fear ) {
  const _this = {};
  _this.env = fear.getEnvironment();
  _this.logger = fear.getLogger();

  if (!_this.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY. Please update .env');
  }

  _this.stripe = stripe(_this.env.STRIPE_SECRET_KEY);
  _this.webhookSecret = _this.env.STRIPE_WEBHOOK_SECRET;
  _this.logger.warn('Stripe Payment Handler initialized');

  _this.handleError = (res, statusCode, error) => {
    _this.logger.error(`Stripe Error :: `, error);
    return res.status(statusCode).json({ success: false, message: error.message, error });
  };

  _this.handleSuccess = (res, statusCode, data) => {
    _this.logger.info(`Stripe Success ::`, data);
    return res.status(statusCode).json({ success: true, message: "Stripe Success", result: data });
  };

  return {

    createPaymentIntent: (req, res) => {
      const { currency, amount, metadata } = req.body;

      if (!amount || amount <= 0) {
        return _this.handleError(res, 400, {message: 'Amount is required and must be greater than 0'})
      }
      const paymentIntentParams = {
        amount,
        metadata,
        currency: (currency) ? currency.toLowerCase() : 'usd',
        automatic_payment_methods: { enabled: true }
      };

      return _this.stripe.paymentIntents
        .create(paymentIntentParams)
        .then(result => _this.handleSuccess(res, 200, result))
        .catch(error => _this.handleError(res, 500, error));
    },

    retrievePaymentIntent: (req, res) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false,  message: 'Payment intent ID is required'});
      }

      return _this.stripe.paymentIntents.retrieve(id)
        .then(result => _this.handleSuccess(res, 200, result))
        .catch(error => _this.handleError(res, 500, error));
    },

    cancelPaymentIntent: (req, res) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required'
        });
      }

      return _this.stripe.paymentIntents.cancel(id)
        .then(result => {
          return _this.handleSuccess(res, 200, 'Payment intent cancelled', result);
        })
        .catch(error => {
          return _this.handleError(res, error.statusCode || 500, 'Failed to cancel payment intent', error, 'Error cancelling payment intent');
        });
    },

    createCustomer: (req, res) => {
      const { email, name, metadata } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      return _this.stripe.customers.create({
        email,
        name,
        metadata
      })
        .then(result => {
          return _this.handleSuccess(res, 200, 'Customer created successfully', result);
        })
        .catch(error => {
          return _this.handleError(res, 500, 'Failed to create customer', error, 'Error creating customer');
        });
    },

    retrieveCustomer: (req, res) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      return _this.stripe.customers.retrieve(id)
        .then(result => {
          return _this.handleSuccess(res, 200, 'Customer retrieved', result);
        })
        .catch(error => {
          return _this.handleError(res, error.statusCode || 500, 'Failed to retrieve customer', error, 'Error retrieving customer');
        });
    },

    listCustomers: (req, res) => {
      const { limit = 10 } = req.query;
      const parsedLimit = Number(limit);

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be a positive number'
        });
      }

      return _this.stripe.customers.list({ limit: parsedLimit })
        .then(result => {
          _this.logger.info(`Customers retrieved :: count: ${result.data.length}`);
          return res.status(200).json({
            success: true,
            message: 'Customers retrieved',
            result: result.data,
            count: result.data.length
          });
        })
        .catch(error => {
          return _this.handleError(res, 500, 'Failed to list customers', error, 'Error listing customers');
        });
    },

    createRefund: (req, res) => {
      const { paymentIntentId, amount, reason } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required'
        });
      }

      const refundParams = {
        payment_intent: paymentIntentId
      };

      if (amount) refundParams.amount = amount;
      if (reason) refundParams.reason = reason;

      return _this.stripe.refunds.create(refundParams)
        .then(result => {
          return _this.handleSuccess(res, 200, 'Refund created successfully', result);
        })
        .catch(error => {
          return _this.handleError(res, error.statusCode || 500, 'Failed to create refund', error, 'Error creating refund');
        });
    },

    createCheckoutSession: (req, res) => {
      const { lineItems, successUrl, cancelUrl, metadata, customer } = req.body;

      if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Line items are required and must be a non-empty array'
        });
      }

      if (!successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          message: 'Success and cancel URLs are required'
        });
      }

      const sessionParams = {
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl
      };

      if (metadata) sessionParams.metadata = metadata;
      if (customer) sessionParams.customer = customer;

      return _this.stripe.checkout.sessions.create(sessionParams)
        .then(result => {
          return _this.handleSuccess(res, 200, 'Checkout session created', result);
        })
        .catch(error => {
          return _this.handleError(res, error.statusCode || 500, 'Failed to create checkout session', error, 'Error creating checkout session');
        });
    },

    createSubscription: (req, res) => {
      const { customerId, priceId, metadata } = req.body;

      if (!customerId || !priceId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID and Price ID are required'
        });
      }

      const subscriptionParams = {
        customer: customerId,
        items: [{ price: priceId }]
      };

      if (metadata) subscriptionParams.metadata = metadata;

      return _this.stripe.subscriptions.create(subscriptionParams)
        .then(result => {
          return _this.handleSuccess(res, 200, 'Subscription created successfully', result);
        })
        .catch(error => {
          return _this.handleError(res, error.statusCode || 500, 'Failed to create subscription', error, 'Error creating subscription');
        });
    },

    cancelSubscription: (req, res) => {
      const { id } = req.params;

      if (!id) {
        return _this.handleError(res, 400, {message: 'Subscription ID is required'})
      }

      return _this.stripe.subscriptions.cancel(id)
        .then(result =>  _this.handleSuccess(res, 200, 'Subscription cancelled', result))
        .catch(error => _this.handleError(res, error.statusCode || 500, 'Failed to cancel subscription', error, 'Error cancelling subscription'));
    },

    handleWebhook: (req, res) => {
      const sig = req.headers['stripe-signature'];

      if (!sig) {
        return res.status(400).json({
          success: false,
          message: 'Missing stripe-signature header'
        });
      }

      if (!_this.webhookSecret) {
        _this.logger.warn('Webhook secret not configured');
        return res.status(400).json({
          success: false,
          message: 'Webhook secret not configured'
        });
      }

      let event;

      try {
        event = _this.stripe.webhooks.constructEvent(
          req.body,
          sig,
          _this.webhookSecret
        );
      } catch (error) {
        return _this.handleError(res, 400, 'Webhook signature verification failed', error, 'Webhook verification error');
      }

      _this.logger.info(`Webhook received: ${event.type}`);

      return res.status(200).json({
        success: true,
        received: true
      });
    },

    saveStripePayment: (req, res) => {
      const { paymentMethodId, customerId } = req.body;

      if (!paymentMethodId || !customerId) {
        return res.status(400).json({success: false, message: 'Payment method ID and customer ID are required' });
      }

      return _this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })
        .then(() => {
          return _this.stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          });
        })
        .then((result) => {
          _this.logger.info('Stripe payment method saved :: ', result.id);
          return _this.handleSuccess(res, 200, result)
        })
        .catch(error => _this.handleError(res, error.statusCode || 500, 'Failed to save payment method', error, 'Error saving payment method'));
    }
  };
};