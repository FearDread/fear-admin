const router = require("express").Router();
const Cart = require("../controllers/cart");
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.post("/new", Cart.create);
router.get("/mycart", Cart.getUserCart);

router.route("/:id")
    .get(Cart.read)
    .put(Cart.update)
    .delete(Cart.delete)

router.route("/product/:id")
    .put(Cart.updateProductQuantityFromCart)
    .delete(Cart.removeProductFromCart);

module.exports = router;