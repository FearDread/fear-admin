const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    run: ( env, callback ) => {
        mongoose.set("strictQuery", false); 
        mongoose.connect(env.DB_LINK, {
            dbName: env.DB_NAME,
            useNewUrlParser: true    
        })
        .then(() => {
            console.log("You successfully connected to MongoDB! Using :: " + env.DB_NAME);
            if ( callback ) callback();
        })
        .catch((err) => { console.log("Error connecting to MongoDB", err); })
    },
    close: (callback) => {
        mongoose.disconnect((err) => {
            console.log("You successfully disconnected to MongoDB! Using :: " + env.DB_NAME);
            callback();
        })
    },
    store: () => {},
    wrapId: (id) => {
        return ObjectId(id);
    },
    validate: (id) => {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        //if (!isValid) id = this.wrapId(id);
        //return id;
        if (!isValid) throw new Error("This id is not valid or not Found");
    }
}
