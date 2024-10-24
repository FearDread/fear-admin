const mongoose = require("mongoose");

module.exports = {
    run: ( env, callback ) => {
        mongoose.set("strictQuery", false); 
        mongoose.connect(env.DB_LINK, {
            dbName: env.DB_NAME,
            useNewUrlParser: true    
        })
        .then(() => {
            console.log("You successfully connected to MongoDB! Using :: " + env.DB_NAME);
            if ( callback ) callback(); })
        .catch((err) => { console.log("Error connecting to MongoDB", err); })
    },
    store: () => {},
    validate: (id) => {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new Error("This id is not valid or not Found");
    }
}
