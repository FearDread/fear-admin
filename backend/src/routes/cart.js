const router = require("express").Router();
const Cart = require("../controllers/cart");

router.post("/new", Cart.createCartItem);
router.post("/user", Cart.getUserCart);
router.delete("/empty", Cart.emptyUserCart);
router.patch("/quantity/:id", Cart.updateQuantity);

module.exports = router;