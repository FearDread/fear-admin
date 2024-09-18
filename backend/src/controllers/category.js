const Category = require("../models/category");
const methods = require("./crud");

const crud = methods.crudController( Category );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}