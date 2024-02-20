
const config = require( "../config" );
const mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

module.exports = {
    url: config.url,
    mongoose: mongoose,
    /* Database Schemas */
    users: require( "./user.js" ),
    products: require( "./product.js" ),
    orders: require( "./order.model.js" )
};
