const Address = require("../models/address");
const methods = require("./crud");

const crud = methods.crudController( Address );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}