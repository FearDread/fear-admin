const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.post("/cart/create-order", isAuthorized, Cart.crud.create);


module.exports = router;