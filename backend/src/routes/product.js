const express  = require("express");
const router  = express.Router();
const Product = require("../controllers/product");
const asyncHandler = require("../middleware/async-handler"); 

router.route("/").get(asyncHandler(Product.list))
router.route("/categories").get(asyncHandler(Product.categories));

router.route("/:id") 
    .get(asyncHandler(Product.read))
    .put(asyncHandler(Product.update))
    .delete(asyncHandler(Product.delete));
router.route("/new").post(asyncHandler(Product.create));

router.route("/review/new").put(Product.Review.create);
router.route("/reviews").get(Product.Review.list);
router.route("/reviews/delete").delete(Product.Review.delete);

module.exports = router  