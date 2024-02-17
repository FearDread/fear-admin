const express  = require("express");
const router  = express.Router();
const Product = require("../controllers/product.controller");

const { isAuthentictedUser, authorizeRoles } = require("../auth");
 
router.route("/product").get(Product.list)

router.route("/admin/product/new")
    .post(isAuthentictedUser, authorizeRoles("admin"), Product.create);

router.route("/admin/products")
    .get(isAuthentictedUser , authorizeRoles("admin") , Product.list);

router.route("/admin/product/:id") 
    .put(isAuthentictedUser, authorizeRoles("admin"), Product.update)
    .delete(isAuthentictedUser, authorizeRoles("admin"), Product.delete);

router.route("/product/:id").get(Product.read);

router.route("/review/new")
    .put(isAuthentictedUser , Product.createProductReview);

router.route("/reviews")
    .get(Product.getProductReviews)

router.route("/product/reviews/delete")
    .delete(isAuthentictedUser , authorizeRoles("admin") , Product.deleteReview);

module.exports = router  