const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");

//router.post("/new", Cart.add);
router.get("/mycart", Cart.getCart);
router.route("/product/:id")
    .post(Cart.add)
    .put(Cart.updateFromCart)
    .delete(Cart.deleteFromCart);

module.exports = router;