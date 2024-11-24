const methods = require("./crud");
const Review = require("../models/review");

const crud = methods.crudController( Review );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}