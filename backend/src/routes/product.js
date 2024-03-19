const express  = require("express");
const router  = express.Router();
const Product = require("../controllers/product");
const asyncHandler = require("../middleware/async-handler"); 

router.route("/").get(asyncHandler(Product.list))
router.route("/:id").get(asyncHandler(Product.read));
router.route("/categories").get(asyncHandler(Product.categories));

router.route("/admin").get(asyncHandler(Product.list));
router.route("/admin/:id") 
    .get(asyncHandler(Product.read))
    .put(asyncHandler(Product.update))
    .delete(asyncHandler(Product.delete));
router.route("/admin/new").post(asyncHandler(Product.create));

/*
router.route("/review/new").put(Product.createProductReview);
router.route("/reviews")
    .get(ProductgetProductReviews)
     
router.route("/product/reviews/delete")
    .delete(isAuthenticted , authorizeRoles("admin") , Product.deleteReview);
*/

module.exports = router  