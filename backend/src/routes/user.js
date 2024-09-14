const router = require("express").Router();
const User = require("../controllers/user");
const { isAuthorized, isAdmin } = require("../libs/auth");

/*
router.get("/wishlist", isAuthorized, User.getWishlist);
router.get("/cart", isAuthorized, User.getUserCart);
router.get("/:id", isAuthorized, isAdmin, User.getaUser);
*/

module.exports = router;