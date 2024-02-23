const express  = require("express");
const router  = express.Router();
const Product = require("../controllers/product");

const { isAuthenticted, authorizeRoles, isValidToken } = require("../auth");
const { catchErrors } = require("../_helpers/errorHandlers");
 
router.route("/product").get(catchErrors(Product.list))
router.route("/product/:id").get(catchErrors(Product.read));

router.route("/admin/product/new").post(catchErrors(Product.create));
router.route("/admin/products").get(catchErrors(Product.list));
router.route("/admin/product/:id") 
    .put(catchErrors(Product.update))
    .delete(catchErrors(Product.delete));



/*
router.route("/review/new").put(Product.createProductReview);
router.route("/reviews")
    .get(ProductgetProductReviews)
     
router.route("/product/reviews/delete")
    .delete(isAuthenticted , authorizeRoles("admin") , Product.deleteReview);
*/

module.exports = router  