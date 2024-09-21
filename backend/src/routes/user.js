const router = require("express").Router();
const User = require("../controllers/user");
const { isAuthorized, isAdmin, authorizeRoles } = require("../controllers/auth");
//const methods = User.crud;

router.get("/all", User.all); 
router.get("/wishlist", isAuthorized, User.wishlist);
router.get("/cart", isAuthorized, User.cart);

router.route("/:id", isAuthorized)
        .get(User.read)
        .post(User.create)
        .put(User.update)
        .delete(User.delete);

module.exports = router;