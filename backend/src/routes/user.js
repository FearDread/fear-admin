const router = require("express").Router();
const User = require("../controllers/user");
const { isAuthorized, isAdmin } = require("../controllers/auth");
//const methods = User.crud;

router.get("/", isAuthorized, User.list);
router.get("/wishlist", isAuthorized, User.wishlist);
router.get("/cart", isAuthorized, User.cart);

router.route("/:id", isAuthorized)
        .get(User.read)
        .post(User.create)
        .put(User.update)
        .delete(User.delete);

module.exports = router;