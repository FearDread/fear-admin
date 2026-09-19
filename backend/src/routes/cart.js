const Cart = require("../controllers/cart");

module.exports = (fear) => {
  const router = fear.createRouter();
  const validator = fear.getValidator();
  const handler = fear.getHandler();

  router.get("/shipping-estimate", cart.getShippingEstimate);
  router.get("/count", cart.getCartCount);
  router.route("/coupon").post(cart.applyCoupon).delete(cart.removeCoupon);
  router.post("/items", cart.addItem);
  router.route("/items/:itemId").patch(cart.updateItem).delete(cart.removeItem);
  router.route("/").get(cart.getCart).delete(cart.clearCart);

  router.post("/new", validator.request, handler.async(Cart.createCartItem));
  router.post("/user", validator.request, handler.async(Cart.getUserCart));
  router.delete("/empty", validator.request, handler.async(Cart.emptyUserCart));
  router.patch("/quantity/:id", validator.request, handler.async(Cart.updateQuantity))

  return router;
};