const stripeHandler = require("../libs/stripe");

exports.createPaymentIntent =  (req, res) => {
    const { amount, currency, metadata, customer, description } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    return stripeHandler.createPaymentIntent({
      amount,
      currency,
      metadata,
      customer,
      description
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
          message: 'Payment intent created successfully',
          result: result.data
        });
      })
      .catch(error => {
        return res.status(500).json({
          success: false,
          message: 'Failed to create payment intent',
          error: error.message
        });
      });
  };

exports.retrievePaymentIntent =  (req, res) => {
    const { id } = req.params;

    return stripeHandler.retrievePaymentIntent(id)
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
  };

exports.cancelPaymentIntent =  (req, res) => {
    const { id } = req.params;

    return stripeHandler.cancelPaymentIntent(id)
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
  };

exports.createCustomer =  (req, res) => {
    const { email, name, metadata } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    return stripeHandler.createCustomer({
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
  };

exports.retrieveCustomer =  (req, res) => {
    const { id } = req.params;

    return stripeHandler.retrieveCustomer(id)
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
  };


exports.listCustomers =  (req, res) => {
    const { limit = 10 } = req.query;

    return stripeHandler.listCustomers(Number(limit))
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
  };

exports.createRefund =  (req, res) => {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    return stripeHandler.createRefund({
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
  };

exports.createCheckoutSession =  (req, res) => {
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

    return stripeHandler.createCheckoutSession({
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
  };

exports.createSubscription =  (req, res) => {
    const { customerId, priceId, metadata } = req.body;

    if (!customerId || !priceId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID and Price ID are required'
      });
    }

    return stripeHandler.createSubscription({
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
  };

exports.cancelSubscription =  (req, res) => {
    const { id } = req.params;

    return stripeHandler.cancelSubscription(id)
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
  };


exports.handleWebhook =  (req, res) => {
    return stripeHandler.handleWebhook(req)
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
  };
