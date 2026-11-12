const Address = require("../models/address");
const methods = require("./crud");


const send = (res, status, result, message = '') =>
    res.status(status).json({
        result,
        success: status < 400,
        message,
        ...(Array.isArray(result) ? { count: result.length } : {}),
    });

const fail = (res, status, message, errors) =>
    res.status(status).json({ result: null, success: false, message, ...(errors ? { errors } : {}) });

// ── handlers ─────────────────────────────────────────────────────────────────

exports.list = (req, res) => {
    Address.find({ userId: req.user._id })
        .sort({ isDefault: -1, createdAt: -1 })
        .then((addresses) =>  send(res, 200, addresses))
        .catch((err) => console.log('list address error: ', err));
};

const crud = methods.crudController(Address);
for (prop in crud) {
    if (crud.hasOwnProperty(prop)) {
        module.exports[prop] = crud[prop];
    }
}