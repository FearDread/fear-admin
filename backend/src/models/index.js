
const config = require( "../config" );
const mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

module.exports = {
    url: config.url,
    mongoose: mongoose,
    /* Database Schemas */
    users: require( "./user.model.js" ),
    products: require( "./product.model.js" ),
    orders: require( "./order.model.js" )
};
