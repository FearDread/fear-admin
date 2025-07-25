const router = require("express").Router();
const { tryCatch } = require("../libs/handler/error");
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");


router.post("/new", tryCatch(Cart.create))
router.get("/all", Cart.read)
router.patch("/user/:id", Cart.update)
router.delete("/user/empty", Cart.delete)
router.patch("/quantity/:id", Cart.updateQuantity);

module.exports = router;