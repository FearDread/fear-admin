const FEAR = require("../FEAR");
const router = require("express").Router();
const Cart = FEAR.controllers.cart;

router.route("/cart").get(Cart.list);
router.route("/cart/add").post(Cart.add);
router.route("/cart/delete/:product_id").delete(Cart.delete);
router.route("/cart/delete").delete(Cart.deleteAll);
router.route("/cart/increment").patch(Cart.increment);
router.route("/cart/decrement").patch(Cart.decrement);
router.route("/cart/checkout").post(Cart.checkout);

router.route("/paystack/checkout").get(Cart.callback);
router.route("/checkout/shipping").post(Cart.placeOrder);

module.exports = router;
