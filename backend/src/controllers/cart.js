const Cart = require("../models/cart");
const methods = require("./crud");
const asyncHandler = require("../libs/handler/async");
const db = require("../libs/db");

exports.crud = methods.crudController( Cart );

exports.userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
  
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      let newCart = await new Cart({
        userId: _id,
        productId,
        color,
        price,
        quantity,
      }).save();
      res.json(newCart);
    } catch (error) {
      throw new Error(error);
    }
});
  
exports.getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const cart = await Cart.find({ userId: _id })
        .populate("productId")
        .populate("color");
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
});
  
exports.removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongoDbId(_id);
    try {
      const deleteProductFromcart = await Cart.deleteOne({
        userId: _id,
        _id: cartItemId,
      });
  
      res.json(deleteProductFromcart);
    } catch (error) {
      throw new Error(error);
    }
});
  
exports.emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const deleteCart = await Cart.deleteMany({
        userId: _id,
      });
  
      res.json(deleteCart);
    } catch (error) {
      throw new Error(error);
    }
});
  
exports.updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    
    db.validateId(_id);
    try {
      const cartItem = await Cart.findOne({
        userId: _id,
        _id: cartItemId,
      });

      cartItem.quantity = newQuantity;
      cartItem.save();

      res.json(cartItem);
    } catch (error) {
      throw new Error(error);
    }
});
