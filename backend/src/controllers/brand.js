const Brand = require("../models/brand");
const methods = require("./crud");


const crud = methods.crudController( Brand );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}
