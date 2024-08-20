const cart = require("./src/routes/cart");
const users = require("./src/routes/user");
const customers = require("./src/routes/customer");
const products = require("./src/routes/product");
const payment = require("./src/routes/payment");
//const order = require("./routes/order");
module.exports = {
    cart:cart,
    users:users,
    customers:customers,
    products:products,
    payment:payment,
    order:order
};