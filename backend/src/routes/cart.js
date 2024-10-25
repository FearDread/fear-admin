const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.post("/new", Cart.add);
router.get("/mycart", Cart.getCart);

router.route("/:id")
    .get(Cart.read)
    .put(Cart.update)
    .delete(Cart.delete)
/*
router.route("/product/:id")
    .put(Cart.updateProductQuantityFromCart)
    .delete(Cart.removeProductFromCart);
*/

module.exports = router;