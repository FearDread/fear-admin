const stripe = require('stripe');

  function StripeHandler (fear) {
    const _this = {};
    _this.env = fear.getEnvironment();
    _this.logger = fear.getLogger();

    _this.stripe = stripe(_this.env.STRIPE_SECRET_KEY);
    _this.webhookSecret = _this.env.STRIPE_WEBHOOK_SECRET;

    _this.logger.info('Stripe Payment Handler initialized');
    return {
      createPaymentIntent: async (req, res) => {
      const currency = 'usd';
      const paymentData = req.body;
      console.log('payment data = ', paymentData)

        //this.fear.getLogger().info(`Creating payment intent: ${amount} ${currency}`);
        const paymentIntentParams = {
          amount: paymentData.amount,
          currency: currency.toLowerCase(),
          metadata: paymentData.metadata,
          automatic_payment_methods: { enabled: true }
        };

//        if (paymentData.currentUser) paymentIntentParams.customer = paymentData.currentUser;

        const paymentIntent = await _this.stripe.paymentIntents.create(paymentIntentParams);
        console.log('payment intent = ', paymentIntent);
        //this.logger.info(`Payment intent created: ${paymentIntent.id}`);
        return res.status(200).json({

          success: true,
          result: paymentIntent,
          clientSecret: paymentIntent.client_secret
        });
      },
    };
  }

exports.createPaymentIntent = async (Stripe, req, res) => {
      const currency = 'usd';
      const paymentData = req.body;
      console.log('payment data = ', paymentData)

        //this.fear.getLogger().info(`Creating payment intent: ${amount} ${currency}`);
        const paymentIntentParams = {
          amount: paymentData.amount,
          currency: currency.toLowerCase(),
          metadata: paymentData.metadata,
          automatic_payment_methods: { enabled: true }
        };

        if (paymentData.currentUser) paymentIntentParams.customer = paymentData.currentUser;

        const paymentIntent = await Stripe.stripe.paymentIntents.create(paymentIntentParams);
        console.log('payment intent = ', paymentIntent);
        //this.logger.info(`Payment intent created: ${paymentIntent.id}`);
        return res.status(200).json({

          success: true,
          result: paymentIntent,
          clientSecret: paymentIntent.client_secret
        });

        
        //this.logger.error('Failed to create payment intent:', error);
        return {
          success: false,
          error: error.message
        };
      };

      module.exports = StripeHandler;


/*
const StripeHandler = (function () {



  StripeHandler.prototype = {
    constructor: StripeHandler,
    /**
     * Create a payment intent
     * @param {Object} params - Payment parameters
     * @param {number} params.amount - Amount in cents
     * @param {string} params.currency - Currency code (e.g., 'usd')
     * @param {Object} params.metadata - Optional metadata
     * @param {string} params.customer - Optional customer ID
     * @param {string} params.description - Optional description
     * @returns {Promise<Object>} Payment intent object
     */


    /**
     * Retrieve a payment intent
     * @param {string} paymentIntentId - Payment intent ID
     * @returns {Promise<Object>} Payment intent object
     *
    async retrievePaymentIntent(paymentIntentId) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return {
          success: true,
          data: paymentIntent
        };
      } catch (error) {
        this.logger.error('Failed to retrieve payment intent:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Cancel a payment intent
     * @param {string} paymentIntentId - Payment intent ID
     * @returns {Promise<Object>} Cancelled payment intent
     *
    async cancelPaymentIntent(paymentIntentId) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
        this.logger.info(`Payment intent cancelled: ${paymentIntentId}`);
        return {
          success: true,
          data: paymentIntent
        };
      } catch (error) {
        this.logger.error('Failed to cancel payment intent:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Create a customer
     * @param {Object} params - Customer parameters
     * @param {string} params.email - Customer email
     * @param {string} params.name - Customer name
     * @param {Object} params.metadata - Optional metadata
     * @returns {Promise<Object>} Customer object
     *
    async createCustomer({ email, name, metadata = {} }) {
      try {
        this.logger.info(`Creating customer: ${email}`);

        const customer = await this.stripe.customers.create({
          email,
          name,
          metadata
        });

        this.logger.info(`Customer created: ${customer.id}`);
        return {
          success: true,
          data: customer
        };
      } catch (error) {
        this.logger.error('Failed to create customer:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    /**
     * Retrieve a customer
     * @param {string} customerId - Customer ID
     * @returns {Promise<Object>} Customer object
     *
    async retrieveCustomer(customerId) {
      try {
        const customer = await this.stripe.customers.retrieve(customerId);
        return {
          success: true,
          data: customer
        };
      } catch (error) {
        this.logger.error('Failed to retrieve customer:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    /**
     * Create a refund
     * @param {Object} params - Refund parameters
     * @param {string} params.paymentIntentId - Payment intent ID
     * @param {number} params.amount - Optional amount to refund (defaults to full refund)
     * @param {string} params.reason - Optional reason
     * @returns {Promise<Object>} Refund object
     *
    async createRefund({ paymentIntentId, amount, reason }) {
      try {
        this.logger.info(`Creating refund for payment intent: ${paymentIntentId}`);

        const refundParams = {
          payment_intent: paymentIntentId
        };

        if (amount) refundParams.amount = Math.round(amount);
        if (reason) refundParams.reason = reason;

        const refund = await this.stripe.refunds.create(refundParams);

        this.logger.info(`Refund created: ${refund.id}`);
        return {
          success: true,
          data: refund
        };
      } catch (error) {
        this.logger.error('Failed to create refund:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Create a checkout session
     * @param {Object} params - Checkout session parameters
     * @param {Array} params.lineItems - Line items for checkout
     * @param {string} params.successUrl - Success redirect URL
     * @param {string} params.cancelUrl - Cancel redirect URL
     * @param {Object} params.metadata - Optional metadata
     * @ret
    async createCheckoutSession({ lineItems, successUrl, cancelUrl, metadata = {}, customer }) {
      try {
        this.logger.info('Creating checkout session');

        const sessionParams = {
          line_items: lineItems,
          mode: 'payment',
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata
        };

        if (customer) sessionParams.customer = customer;

        const session = await this.stripe.checkout.sessions.create(sessionParams);

        this.logger.info(`Checkout session created: ${session.id}`);
        return {
          success: true,
          data: session,
          url: session.url
        };
      } catch (error) {
        this.logger.error('Failed to create checkout session:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Handle Stripe webhook events
     * @param {Object} req - Express request object
     * @param {string} endpointSecret - Optional webhook secret (uses env var if not provided)
     * @returns {Promise<Object>} Event processing result
     *
    async handleWebhook(req, endpointSecret = null) {
      const secret = endpointSecret || this.webhookSecret;

      if (!secret) {
        this.logger.warn('Webhook secret not configured');
        return {
          success: false,
          error: 'Webhook secret not configured'
        };
      }

      try {
        const signature = req.headers['stripe-signature'];
        const event = this.stripe.webhooks.constructEvent(
          req.body,
          signature,
          secret
        );

        this.logger.info(`Webhook received: ${event.type}`);

        // Handle different event types
        switch (event.type) {
          case 'payment_intent.succeeded':
            await this.handlePaymentSuccess(event.data.object);
            break;
          case 'payment_intent.payment_failed':
            await this.handlePaymentFailed(event.data.object);
            break;
          case 'customer.created':
            await this.handleCustomerCreated(event.data.object);
            break;
          case 'charge.refunded':
            await this.handleRefund(event.data.object);
            break;
          default:
            this.logger.info(`Unhandled event type: ${event.type}`);
        }

        return {
          success: true,
          event
        };
      } catch (error) {
        this.logger.error('Webhook error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    /**
     * Handle successful payment
     * @param {Object} paymentIntent - Payment intent object
     *
    async handlePaymentSuccess(paymentIntent) {
      this.logger.info(`Payment succeeded: ${paymentIntent.id}`);
      // Add your custom logic here (e.g., update database, send email)
    },
    /**
     * Handle failed payment
     * @param {Object} paymentIntent - Payment intent object
     *
    async handlePaymentFailed(paymentIntent) {
      this.logger.error(`Payment failed: ${paymentIntent.id}`);
      // Add your custom logic here
    },

    /**
     * Handle customer created
     * @param {Object} customer - Customer object
     *
    async handleCustomerCreated(customer) {
      this.logger.info(`Customer created: ${customer.id}`);
      // Add your custom logic here
    },
    /**
     * Handle refund
     * @param {Object} charge - Charge object
     *
    async handleRefund(charge) {
      this.logger.info(`Refund processed: ${charge.id}`);
      // Add your custom logic here
    },

    /**
     * List all customers
     * @param {number} limit - Number of customers to retrieve
     * @returns {Promise<Object>} List of customers
     *
    async listCustomers(limit = 10) {
      try {
        const customers = await this.stripe.customers.list({ limit });
        return {
          success: true,
          data: customers.data
        };
      } catch (error) {
        this.logger.error('Failed to list customers:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Create a subscription
     * @param {Object} params - Subscription parameters
     * @param {string} params.customerId - Customer ID
     * @param {string} params.priceId - Price ID
     * @param {Object} params.metadata - Optional metadata
     * @returns {Promise<Object>} Subscription object
     *
    async createSubscription({ customerId, priceId, metadata = {} }) {
      try {
        this.logger.info(`Creating subscription for customer: ${customerId}`);

        const subscription = await this.stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          metadata
        });

        this.logger.info(`Subscription created: ${subscription.id}`);
        return {
          success: true,
          data: subscription
        };
      } catch (error) {
        this.logger.error('Failed to create subscription:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Cancel a subscription
     * @param {string} subscriptionId - Subscription ID
     * @eturns {Promise<Object>} Cancelled subscription
     *
    async cancelSubscription(subscriptionId) {
      try {
        const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
        his.logger.info(`Subscription cancelled: ${subscriptionId}`);
        return {
          success: true,
          data: subscription
        };
      } catch (error) {
        this.logger.error('Failed to cancel subscription:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }, 
  }

  return StripeHandler;


})();

module.exports = StripeHandler;
*/