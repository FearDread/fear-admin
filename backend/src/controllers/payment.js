const stripe = require("stripe");

// process the payment
exports.process = async (req, res, next) => {
  const client = stripe(process.env.STRIPE_SECRET_KEY);

  const myPayment = await client.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res.status(200).send({ sucess: true, client_secret: myPayment.client_secret });
};

exports.stripeKey = async (req, res, next) => {
  res.status(200).send({ stripeApiKey: process.env.STRIPE_API_KEY });
};
