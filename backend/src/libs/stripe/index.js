const stripe = require('stripe');
require("dotenv").config();

const StripeHandler = function(fear) {
  const _this = {};
  _this.env = fear.getEnvironment();
  _this.logger = fear.getLogger();

  _this.stripe = stripe(_this.env.STRIPE_SECRET_KEY);
  _this.webhookSecret = _this.env.STRIPE_WEBHOOK_SECRET;

  _this.logger.info('Stripe Payment Handler initialized');

  return {

    createPaymentIntent: (req, res) => {
      const currency = 'usd';
      const paymentData = req.body;

      // Validate required fields
      if (!paymentData.amount || paymentData.amount <= 0) {
        return res.status(400).json({success: false, message: 'Amount is required and must be greater than 0'});
      }
      //this.fear.getLogger().info(`Creating payment intent: ${amount} ${currency}`);
      const paymentIntentParams = {
        amount: paymentData.amount,
        currency: currency.toLowerCase(),
        metadata: paymentData.metadata,
        automatic_payment_methods: { enabled: true }
      };
      
      console.log('payment data = ', paymentIntentParams)

      return _this.stripe.createPaymentItent(paymentIntentParams)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
          }
          return res.status(200).json({ success: true, message: 'Payment intent created successfully', result: result.data });
        })
        .catch(error => {
          res.status(500).json({ success: false, message: 'Failed to create payment intent', error: error.message});
        });
    },


    retrievePaymentIntent: (req, res) => {
      const { id } = req.params;

      return _this.stripe.retrievePaymentIntent(id)
        .then(result => {
          if (!result.success) {
            return res.status(404).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Payment intent retrieved',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to retrieve payment intent',
            error: error.message
          });
        });
    },

    cancelPaymentIntent: (req, res) => {
      const { id } = req.params;

      return _this.stripe.cancelPaymentIntent(id)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Payment intent cancelled',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to cancel payment intent',
            error: error.message
          });
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

      return _this.stripe.createCustomer({
        email,
        name,
        metadata
      })
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Customer created successfully',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
          });
        });
    },

    retrieveCustomer: (req, res) => {
      const { id } = req.params;

      return _this.stripe.retrieveCustomer(id)
        .then(result => {
          if (!result.success) {
            return res.status(404).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Customer retrieved',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to retrieve customer',
            error: error.message
          });
        });
    },

    listCustomers: (req, res) => {
      const { limit = 10 } = req.query;

      return _this.stripe.listCustomers(Number(limit))
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Customers retrieved',
            result: result.data,
            count: result.data.length
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to list customers',
            error: error.message
          });
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

      return _this.stripe.createRefund({
        paymentIntentId,
        amount,
        reason
      })
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Refund created successfully',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to create refund',
            error: error.message
          });
        });
    },

    createCheckoutSession: (req, res) => {
      const { lineItems, successUrl, cancelUrl, metadata, customer } = req.body;

      if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Line items are required'
        });
      }

      if (!successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          message: 'Success and cancel URLs are required'
        });
      }

      return _this.stripe.createCheckoutSession({
        lineItems,
        successUrl,
        cancelUrl,
        metadata,
        customer
      })
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Checkout session created',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to create checkout session',
            error: error.message
          });
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

      return _this.stripe.createSubscription({
        customerId,
        priceId,
        metadata
      })
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Subscription created successfully',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to create subscription',
            error: error.message
          });
        });
    },

    cancelSubscription: (req, res) => {
      const { id } = req.params;

      return _this.stripe.cancelSubscription(id)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Subscription cancelled',
            result: result.data
          });
        })
        .catch(error => {
          return res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription',
            error: error.message
          });
        });
    },

    handleWebhook: (req, res) => {
      return _this.stripe.handleWebhook(req)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error
            });
          }
          return res.status(200).json({
            success: true,
            received: true
          });
        })
        .catch(error => {
          return res.status(400).json({
            success: false,
            message: 'Webhook error',
            error: error.message
          });
        });
    },
  };
}


exports.StripeFactory = () => stripe(process.env.STRIPE_SECRET_KEY);



module.exports = StripeHandler;
