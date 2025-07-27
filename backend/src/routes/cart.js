const router = require("express").Router();
const { tryCatch } = require("../libs/handler/error");
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const User = require("../controllers/user");


router.post("/new", tryCatch(Cart.create))

router.patch("/user/:id", Cart.update)
router.delete("/user/empty", Cart.delete)
router.patch("/quantity/:id", Cart.updateQuantity);

router.route("/all").get(Cart.getUserCart);
module.exports = router;