
const config = require( "../config/db.config.js" );
const mongoose = require( "mongoose" );


mongoose.Promise = global.Promise;

const fear_db = {
    url: config.url,
    mongoose: mongoose,
    client: new mongoose.client( this.url ),
    /* Database Schemas */
    users: require( "./user.model.js" ),
    products: require( "./product.model.js" ),
    orders: require( "./order.model.js" )
};

module.exports = fear_db;