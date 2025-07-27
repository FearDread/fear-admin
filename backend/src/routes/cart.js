const router = require("express").Router();
const { tryCatch } = require("../libs/handler/error");
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const User = require("../controllers/user");


router.post("/new", tryCatch(Cart.create))
router.post("/user", Cart.getUserCart);

router.patch("/:userId", Cart.update)
router.delete("/empty", Cart.empty)
router.patch("/quantity/:id", Cart.updateQuantity);

module.exports = router;