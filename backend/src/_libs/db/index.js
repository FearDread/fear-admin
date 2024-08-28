import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";


let db = null;
dotenv.config({ path: __dirname + "/../.env" });

module.exports = app => {
    return {
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