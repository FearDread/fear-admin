const Calendar = require("../models/calendar");
const methods = require("./crud");


const crud = methods.crudController( Calendar );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}