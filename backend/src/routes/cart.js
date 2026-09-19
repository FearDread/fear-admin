const Cart = require("../controllers/cart");

module.exports = (fear) => {
  const router = fear.createRouter();
  const validator = fear.getValidator();
  const handler = fear.getHandler();

    router.get("/shipping-estimate", Cart.getShippingEstimate);
    router.get("/count", Cart.getCartCount);
    router.route("/coupon").post(Cart.applyCoupon).delete(Cart.removeCoupon);
    router.post("/items", Cart.addItem);
    router.route("/items/:itemId").patch(Cart.updateItem).delete(Cart.removeItem);
    router.route("/").get(Cart.getCart).delete(Cart.clearCart);

  router.post("/new", validator.request, handler.async(Cart.createCartItem));
  router.post("/user", validator.request, handler.async(Cart.getUserCart));
  router.delete("/empty", validator.request, handler.async(Cart.emptyUserCart));
  router.patch("/quantity/:id", validator.request, handler.async(Cart.updateQuantity))

  return router;
};