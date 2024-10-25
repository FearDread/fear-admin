const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const methods = require("./crud");
const db = require("../libs/db");


exports.add = tryCatch(async (req, res) => {
    const { productId, quantity, price } = req.body;
    const { userId } = req.user;

    db.validate(userId);

    await new Cart({ userId, productId, price, quantity })
      .save()
      .then((result) => {
        console.log('user cart :: ', response);
        if ( !result ) return res.status(400).json({result: null, success: false, message: "Unable to add to cart" });
        return res.status(200).json({ result, success: true, message: 'Added item to cart' })
      })
      .catch((error) => { throw new Error(error); });
});
  
exports.getCart = tryCatch(async (req, res) => {
    const { userId } = req.user;

    db.validate(userId);

    await Cart.find({ userId })
      .populate("productId")
      .then((result) => { return res.status(200).json({ result, success: true, message:'Found Cart' }); })
      .catch((error) => { throw new Error(error); });
});
  
exports.empty = tryCatch(async (req, res) => {
    const { userId } = req.user;

    db.validate(userId);
    
    await Cart.deleteMany({ userId })
      .then((result) => { return rest.status(200).json({success: true, message:'Emptied User Cart' }); })
      .catch((error) => {throw new Error(error); });
});

exports.deleteFromCart = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const { cartItemId } = req.params;

  db.validate(userId);
  
  await Cart.deleteOne({ userId, _id: cartItemId })
    .then((result) => { return res.status(200).json({ success: true, message: 'Removed item from cart' }); })
    .catch((error) => { throw new Error(error); });
});
  
exports.updateFromCart = tryCatch(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    
    db.validate(_id);
 
    await Cart.findOne({ userId, _id: cartItemId })
      .then((cart) => {
        if ( cart ) {
          cart.quantity = newQuantity;
          cart.save()
            .then((cart) => { return res.status(200).json({result: cart, success: true, message: 'Updated Cart product quantity' }); })
            .catch((err) => { return res.status(400).json({ result: null}); })
        }
      })
      .catch((error) => { throw new Error(error); });
});

const crud = methods.crudController( Cart );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}