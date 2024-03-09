const router = require("express").Router();

// import controllers
const {
   getAllProductInAUserCart,
   addProductToAUserCart,
   deleteProductFromAUserCart,
   deleteAllProductsFromAUserCart,
   incrementCartItem,
   decrementCartItem,
   checkout,
   checkOutCallBack,
   placeOrder,
} = require("../controllers/cart");

// define routes

//  get all products in a user's cart
router.route("/cart").get(getAllProductInAUserCart);

//  add to cart
router.route("/cart/add").post(addProductToAUserCart);

//  remove from cart
router.route("/delete/:product_id").delete(deleteProductFromAUserCart);

// clear cart
router.route("/delete_all").delete(deleteAllProductsFromAUserCart);

// increment cart item
router.route("/increment").patch(incrementCartItem);

// decrement cart item
router.route("/decrement").patch(decrementCartItem);

// checkout
router.route("/checkout").post(checkout);

// checkout callback
router.route("/paystack/checkout").get(checkOutCallBack);

// add shipping details
router.route("/checkout/shipping").post(placeOrder);

module.exports = router;
