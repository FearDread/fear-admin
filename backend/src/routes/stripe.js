
module.exports = (fear) => {
  const router = fear.createRouter();
  const validator = fear.getValidator();
  const handler = fear.getHandler();
  const Stripe = fear.stripe;

  router.post('/intent', handler.async(Stripe.createPaymentIntent));
  /*
  router.get('/intent/:id', handler.async(stripe.retrievePaymentIntent));
  router.post('/intent/:id/cancel', handler.async(stripe.cancelPaymentIntent));

  router.post('/customer', handler.async(stripe.createCustomer));
  router.get('/customer/:id', handler.async(stripe.retrieveCustomer));
  router.get('/customers', handler.async(stripe.listCustomers));



  router.post('/checkout', handler.async(stripe.createCheckoutSession));

  router.post('/subscription', handler.async(stripe.createSubscription));
  router.post('/subscription/:id/cancel', handler.async(stripe.cancelSubscription));
  router.post('/refund', handler.async(stripe.createRefund));

  //router.post('/webhook', express.raw({ type: 'application/json' }), handler.async(Payment.handleWebhook);
*/
  return router;
};