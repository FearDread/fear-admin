const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const methods = require("./crud");

exports.createCartItem = tryCatch(async (req, res) => {
  const { userId, productId, quantity, price } = req.body;

  await new Cart(req.body)
    .save()
    .then((created) => { return res.status(200).json({ success: true, result: created }) })
    .catch(error => { throw new Error(error)});
});

exports.getUserCart = tryCatch(async (req, res) => {
  const { id } = req.body;

  await Cart.find({ userId: id })
    .populate("productId")
    .then((cart) => { return res.status(200).json({ success: true, result: cart }) })
    .catch(error => { throw new Error(error)});
});

exports.emptyUserCart = tryCatch(async (req, res) => {
  const { id } = req.body;
 // db.validate(_id);
  await Cart.deleteMany({ userId: _id })
    .then((resp) => { return res.status(203).json({ success: true }) })
    .catch(error => new Error(error));
});

exports.updateQuantity = tryCatch(async (req, res) => {
  const { _id } = req.params;
  const { userId, cartItemId, newQuantity } = req.body;
  const item = await Cart.findOne({ _id: cartItemId, userId: _id });

  item.quantity = newQuantity;
  item
    .save()
    .then((resp) => { return res.status(200).json({ success: true, result: resp }) })
    .catch(error => new Error(error));
});

const crud = methods.crudController( Cart );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}