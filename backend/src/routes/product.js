const express = require("express");
const Product = require("../controllers/product");
const { isAdmin, isAuthorized } = require("../controllers/auth");
const router = express.Router();

router.get("/", Product.list);
router.post("/new", Product.create);
router.route("/:id")
        .get(Product.read)
        .put(Product.update)
        .delete(Product.delete);

//router.put("/wishlist", addToWishlist);
router.put("/rating", Product.rating);
        
module.exports = router;