const mongoose = require("mongoose");

module.exports = {
    run: ( env, cb ) => {
        mongoose.set("strictQuery", false); 
        mongoose.connect(env.DB_LINK, {
            dbName: env.DB_NAME,
            useNewUrlParser: true    
        })
        .then(() => {
            console.log("You successfully connected to MongoDB! Using :: " + env.DB_NAME);
            if ( callback ) {
                callback();
            }
        })
        .catch((err) => {
            console.log("Error connecting to MongoDB", err);
        })
    },
    store: () => {

    }
}
