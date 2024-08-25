import express from "express";
import consign from "consign";

const app = express();
 
consign().include("src/models")
    .then("src/routes")
    .then("src/libs/middlewares.js")
    .then("src/libs/boot.js")
    .into(app);