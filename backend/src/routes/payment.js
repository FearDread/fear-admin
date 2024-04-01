const express = require("express");
const Payment = require("../controllers/payment");
const asyncHandler = require("../middleware/async-handler");
const { isAuth } = require("../auth");
const router  = express.Router();

router.route("/payment/process").post(isAuth, asyncHandler(Payment.process));

router.route("/stripe/key").get(asyncHandler(Payment.stripeKey));

module.exports = router