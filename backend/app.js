const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
//const AppError = require("/handlers/errorHandlers");
const errors = require("./src/handlers/errorHandlers");

dotenv.config({ path: "./.env" });

// routes
const auth = require("./src/routes/auth");
const users = require("./src/routes/user");
const products = require("./src/routes/product");
//const order = require("./routes/order");
//const payment = require("./routes/payment");

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(errors.developmentErrors);
app.use(fileUpload());
app.use(cors());

app.use("/fear/api", users);
app.use("/fear/api", products);
app.use("/fear/api", auth);
//app.use("/fear/api", order);
//app.use("/fear/api", payment);


app.use(express.static(path.join(path.resolve(), "/frontend")));

app.get("*", (req, res) => {
    console.log('API Route hit :: ' + req.url);
    //res.redirect('http://fear.master.com:3000/home');
    res.sendFile(path.resolve(path.resolve(), "frontend", "src", "index.js"))
});
//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});


module.exports = app;