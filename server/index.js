import express from "express";
import consign from "consign";

const app = express();

consign({verbose: false})
  .include("libs/config.js")
  .then("src/db")
  .then("src/auth")
  .then("src/libs/middlewares.js")
  .then("src/routes")
  .then("src/libs/boot.js")
  .into(app);

module.exports = app;
