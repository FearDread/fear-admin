const Stripe = require('../libs/stripe');
const Payment = require('../controllers/payment')

module.exports = (fear) => {
  const router = fear.createRouter();
  const validator = fear.getValidator();
  const handler = fear.getHandler();

  // Initialize Stripe payment handler and controller
const stripeHandler = new Stripe(fear);


  router.post('/intent', handler.async(Payment.createPaymentIntent));
  router.get('/intent/:id', handler.async(Payment.retrievePaymentIntent));
  router.post('/intent/:id/cancel', handler.async(Payment.cancelPaymentIntent));

  router.post('/customer', handler.async(Payment.createCustomer));
  router.get('/customer/:id', handler.async(Payment.retrieveCustomer));
  router.get('/customers', handler.async(Payment.listCustomers));



  router.post('/checkout', handler.async(Payment.createCheckoutSession));

  router.post('/subscription', handler.async(Payment.createSubscription));
  router.post('/subscription/:id/cancel', handler.async(Payment.cancelSubscription));
  router.post('/refund', handler.async(Payment.createRefund));

  //router.post('/webhook', express.raw({ type: 'application/json' }), handler.async(Payment.handleWebhook);

  return router;
};