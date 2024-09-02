const cart = require("./cart");
const users = require("./user");
const customers = require("./customer");
const products = require("./product");
const payment = require("./payment");
//const order = require("./routes/order");
//const mailbag = require("./routes/mail");

module.exports = ( app ) => {
    app.use("/cart", cart);
    app.use("/users", users);
    app.use("/products", products);
    app.use("/pay", payment);
    app.use("/customers", customers);
   // app.use("/order", order);
    //app.use("/mail", mailbag);
    return app;
};

/* 
const fs = require('fs')    
const files = fs.readdirSync('./routes')
for (const file of files) {
  require('./'+file)
}
// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./' + file);
  }
});
*/