const cart = require("./cart");
const users = require("./user");
const customers = require("./customer");
const products = require("./product");
const payment = require("./payment");
//const order = require("./routes/order");
//const mailbag = require("./routes/mail");
module.exports = {
    "/cart":cart,
    "/users":users,
    "/customers":customers,
    "/products":products,
    "/payment":payment,

    //order:order
};