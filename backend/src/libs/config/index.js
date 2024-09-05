const dotenv = require("dotenv");
const result = dotenv.config({ path: "../../.env"})

if ( !result || result.error ) {
    throw result.error;
}

const {parsed: config} = result;
console.log(".ENV VALUES =", config);

module.exports = config;