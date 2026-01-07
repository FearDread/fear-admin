const Payment = require('../models/payment');
const methods = require("./crud");


// Extend with CRUD methods
const crud = methods.crudController(Payment);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}