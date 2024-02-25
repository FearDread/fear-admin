const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");

require("dotenv").config({ path: __dirname + "/../.env" });

module.exports.run = () => {
  mongoose.set("strictQuery", false); 
  mongoose
      .connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        dbName: process.env.DB_NAME
      })
      .then(function () {
          console.log("You successfully connected to MongoDB! Using :: " + process.env.DB_NAME);
      })
      .catch(function (err) {
          console.log("Error connecting to MongoDB", err);
      })
};

module.exports.store = () => {
  MongoStore.create({ mongoUrl: process.env.DB_LINK });
}
