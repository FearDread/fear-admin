const Wish = require("../controllers/wishlist");
const Auth = require("../controllers/auth");

const requireUser = (req, res, next) => {
    console.log('')
    if (req.user && req.user._id) return next();
    return res.status(401).json({ success: false, message: "Please log in to use your wishlist" });
};

module.exports = (fear) => {
    const router = fear.createRouter();

    router.use(Auth.isAuthorized);

    // Collection routes the storefront's RTK Query layer calls...
    router.get("/", Wish.getWishlist);
    router.post("/", Wish.addToWishlist);
    router.delete("/", Wish.clearWishlist);

    // ...plus the /all and /new aliases from the original file.
    // Static paths MUST be declared before "/:id", otherwise DELETE /all
    // is captured by "/:id" and fails the ObjectId check.
    router.get("/all", Wish.getWishlist);
    router.post("/new", Wish.addToWishlist);
    router.delete("/all", Wish.clearWishlist);

    router.delete("/:id", Wish.removeFromWishlist);

    return router;
};