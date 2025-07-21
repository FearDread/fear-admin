const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");


router.post("/", Cart.create)
router.get("/user/all", Cart.read)
router.patch("/user/:id", Cart.update)
router.delete("/user/empty", Cart.delete)
router.patch("/quantity/:id", Cart.updateQuantity);

module.exports = router;