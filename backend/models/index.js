const mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

module.exports = {
    db: mongoose,
    /* Database Schemas */
    users: require( "./user.model" ),
    products: require( "./product.model" ),
    orders: require( "./order.model" )
};
