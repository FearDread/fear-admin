const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const cors = require("cors");
const app_error = require("./src/middleware");
require("dotenv").config({ path: "./config/config.env" });

// routes
const user = require("./src/routes/user");
//const product = require("./src/routes/product");
//const order = require("./routes/order");
//const payment = require("./routes/payment");

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(app_error.error);
app.use(fileUpload());
app.use(cors());

app.use("/fear/api", user);
//app.use("/fear/api", product);
//app.use("/fear/api", order);
//app.use("/fear/api", payment);

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/frontend")));

app.get("*", (req, res) => {
    console.log('API Route hit :: ' + req.url);
    //res.redirect('http://fear.master.com:3000/home');
    res.sendFile(path.resolve(__dirname1, "frontend", "src", "index.js"))
});

module.exports = app;