const Task = require("../models/task");
const methods = require("./crud");


const crud = methods.crudController( Task );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}