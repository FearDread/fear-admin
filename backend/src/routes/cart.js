const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../libs/auth");

router.post("/cart/create-order", isAuthorized, Cart.create);


module.exports = router;