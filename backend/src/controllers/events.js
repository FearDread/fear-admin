const Events = require("../models/events");
const methods = require("./crud");

const crud = methods.crudController( Events );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}