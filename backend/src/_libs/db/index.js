const mongoose = require("mongoose");
const dotenv = require("dotenv");

let db = null;
dotenv.config({ path: __dirname + "/../.env" });

module.exports = (app) => {
    return db = {
        run: () => {
            mongoose.set("strictQuery", false); 
            mongoose.connect(process.env.DB_LINK,
            {
                dbName: process.env.DB_NAME,
                useNewUrlParser: true    
            })
            .then(() => {
                console.log("You successfully connected to MongoDB! Using :: " + process.env.DB_NAME);
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB", err);
            })
        }
    }
}