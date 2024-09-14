const router = require("express").Router();
const User = require("../controllers/Order");
const { isAuthorized, isAdmin } = require("../lbis/auth");

router.get("/wishlist", isAuthorized, User.getWishlist);
router.get("/cart", isAuthorized, User.getUserCart);
router.get("/:id", isAuthorized, isAdmin, User.getaUser);

module.exports = router;