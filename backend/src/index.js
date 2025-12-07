
const FEAR = require("./FEAR");
const FearServer = require("./FEARServer");

exports.FearFactory = () => new FearServer()

module.exports = { FEAR, FearServer }
