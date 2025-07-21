const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const User = require("../models/user");
const db = require("../libs/db");

exports.create = tryCatch(async (req, res) => {
  const { _id, productId, quantity, price } = req.body;
  //db.validate(_id);
  await new Cart(req.body)
    .save()
    .then((created) => { return res.status(200).json({ success: true, result: created }) })
    .catch(error => new Error(error));
});

exports.read = tryCatch(async (req, res) => {
  const { _id } = req.body;
  //db.validate(_id);
  await Cart.find({ userId: _id })
    .populate("productId")
    .then((cart) => { return res.status(200).json({ success: true, result: cart }) })
    .catch(error => new Error(error));
});

exports.update = tryCatch(async (req, res) => {
  const { _id } = req.params
  const { userId, productId, quantity, price } = req.body;

  await Cart.findByIdAndUpdate(_id, req.body, { new: true })
    .populate('productId')
    .then((resp) => { return res.status(200).json({ success: true, result: resp }) })
    .catch(error => new Error(error));

});

exports.delete = tryCatch(async (req, res) => {
  const { _id } = req.body;
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