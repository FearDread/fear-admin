const HipcomicItem = require("../models/hipcomic");
const methods = require("./crud");

const crud = methods.crudController(HipcomicItem);
for (prop in crud) {
    if (crud.hasOwnProperty(prop)) {
        module.exports[prop] = crud[prop];
    }
}