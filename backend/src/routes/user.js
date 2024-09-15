const router = require("express").Router();
const User = require("../controllers/user");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const methods = User.crud;

router.get("/", isAuthorized, methods.list);
router.get("/wishlist", isAuthorized, User.wishlist);
router.get("/cart", isAuthorized, User.cart);

router.route("/:id", isAuthorized)
        .get(methods.read)
        .post(methods.create)
        .put(methods.update)
        .delete(methods.delete);

module.exports = router;