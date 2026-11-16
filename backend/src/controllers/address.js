const Address = require("../models/address");
const methods = require("./crud");
const request = require("./request");

exports.list = (req, res) => {
    Address.find({ userId: req.user._id })
        .sort({ isDefault: -1, createdAt: -1 })
        .then((addresses) =>  request.send(res, 200, addresses))
        .catch((err) => request.fail(res, 'Address listings error'))
};

const crud = methods.crudController(Address);
for (prop in crud) {
    if (crud.hasOwnProperty(prop)) {
        module.exports[prop] = crud[prop];
    }
}