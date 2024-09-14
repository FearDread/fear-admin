const Order = require("../models/order");
const methods = require("../libs/crud");

const crud = methods.crudController( Order );

const orderController = {
    crud,
};

module.exports = orderController;