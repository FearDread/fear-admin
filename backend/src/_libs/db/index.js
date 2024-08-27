import mongoose from "mongoose";
require("dotenv").config({ path: __dirname + "/../.env" });

let db = null;

module.exports = app => {
    return db = {
        run: () => {
            mongoose.set("strictQuery", false); 
            mongoose
                .connect(process.env.DB_LINK, {
                  useNewUrlParser: true,
                  dbName: process.env.DB_NAME
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