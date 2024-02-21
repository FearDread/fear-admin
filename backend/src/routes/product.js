const express  = require("express");
const router  = express.Router();
const Product = require("../controllers/product");

const { isAuthenticted, authorizeRoles, isValidToken } = require("../auth");
 
router.route("/product").get(Product.list)
router.route("/admin/product/new").post(Product.create);
router.route("/admin/products").get(Product.list);
router.route("/product/:id").get(Product.read);
router.route("/admin/product/:id") 
    .put(Product.update)
    .delete(Product.delete);



/*
router.route("/review/new").put(Product.createProductReview);
router.route("/reviews")
    .get(ProductgetProductReviews)
     
router.route("/product/reviews/delete")
    .delete(isAuthenticted , authorizeRoles("admin") , Product.deleteReview);
*/

module.exports = router  