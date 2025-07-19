const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.post("/", Cart.userCart);
router.get("/all", Cart.getUserCart);
router.get("/user/cart/:id", Cart.getUserCart);

router.delete(
  "/product/delete/:id",
  Cart.removeFromCart
);
router.delete(
  "/product/update/:id/:quantity",
  Cart.updateProductQuantityFromCart
);

router.delete("/empty", Cart.emptyCart);

module.exports = router;