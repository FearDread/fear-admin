const router  = require("express").Router();
const Product = require("../controllers/product");
const { sync } = require("../libs/handler"); 

router.route("/product").get( sync(Product.list) )
router.route("/product/categories").get( sync(Product.categories) );
router.route("/product/new").post( sync(Product.create) );
router.route("/product/:id") 
    .get( sync(Product.read) )
    .put( sync(Product.update) )
    .delete( sync(Product.delete) );


router.route("/review").get(Product.Review.list);
router.route("/review/new").put(Product.Review.create);
router.route("/reviews/delete").delete(Product.Review.delete);

module.exports = router  