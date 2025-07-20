const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const User = require("../models/user");
const methods = require("./crud");
const db = require("../libs/db");

exports.addToCart = tryCatch(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;

  db.validate(_id);
  
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      price,
      quantity,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getUserCart = tryCatch(async (req, res) => {
  const { _id } = req.body;
  //db.validate(_id);
  await Cart.find({ userId: _id })
      .populate("productId")
      .then((cart) => {
        console.log('cart data = ', cart);
        return res.status(200).json({success: true, result: cart})
      })
      .catch((error) => {
        throw new Error(error);
      });

});

exports.removeFromCart = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  db.validate(_id);
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

exports.emptyCart = tryCatch(async (req, res) => {
  const { _id } = req.user;
  db.validate(_id);
  try {
    const deleteCart = await Cart.deleteMany({
      userId: _id,
    });

    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateProductQuantityFromCart = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  db.validate(_id);
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

/*
const crud = methods.crudController( Cart );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}
*/