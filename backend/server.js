import express from "express";
import consign from "consign";

const app = express();

consign({verbose: false})
  .include("src/_libs/db")
  .then("src/_libs/auth")
  .then("src/app.js")
  .then("src/routes")
  .then("boot.js")
  .into(app);


module.exports = app;


/*
const app = require("./app");
const db = require("./src/data/db");
const cloudinary = require("cloudinary");
const session = require("express-session");
require("dotenv").config({ path: "./.env" });

// connect to db //
db.run();

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: db.store(),
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`FEAR API Server is listening on PORT ${PORT}`);
  console.log("MailBag server open for requests");
});
*/

