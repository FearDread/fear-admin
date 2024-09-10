const router  = require("express").Router();
const Product = require("../controllers/product");
const { asyncHandler } = require("../libs/handler"); 

router.route("/").get( asyncHandler(Product.list) )
router.route("/categories").get( asyncHandler(Product.categories) );
router.route("/new").post( asyncHandler(Product.create) );
router.route("/:id") 
    .get( asyncHandler(Product.read) )
    .put( asyncHandler(Product.update) )
    .delete( asyncHandler(Product.delete) );

/*
router.route("/review").get(Product.Review.list);
router.route("/review/new").put(Product.Review.create);
router.route("/reviews/delete").delete(Product.Review.delete);
*/
module.exports = router  