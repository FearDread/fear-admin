
const config = require( "../config" );
const mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

module.exports = {
    url: config.url,
    mongoose: mongoose,
    client: new mongoose.client( this.url ),
    /* Database Schemas */
    users: require( "./user.model.js" ),
    products: require( "./product.model.js" ),
    orders: require( "./order.model.js" )
};
