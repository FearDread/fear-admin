const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const {developmentErrors, AppError} = require("./src/_utils/errorHandlers");
const helmet = require("helmet");

/* Middlewares */
const notFound = require("./src/middleware/not-found");
const errorHandler = require("./src/middleware/error-handler");
const isAuth = require("./src/middleware/authentication");


dotenv.config({ path: "./.env" });

// routes
const auth = require("./src/routes/auth");
const cart = require("./src/routes/cart");
const users = require("./src/routes/user");
const customers = require("./src/routes/customer");
const products = require("./src/routes/product");
//const order = require("./routes/order");
//const payment = require("./routes/payment");

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(developmentErrors);
app.use(fileUpload());

app.use(cors());
app.use(helmet());

//Allow all requests from all domains & localhost
app.all('/*', function( req, res, next ) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header("Cross-Origin-Opener-Policy", "unsafe-none");
    next();
});

app.use("/fear/api", auth);
app.use("/fear/api", users);
app.use("/fear/api", products);
app.use("/fear/api", customers);
app.use("/fear/api", isAuth, cart);
//app.use("/fear/api", order);
//app.use("/fear/api", payment);

//app.use(notFound);
app.use(errorHandler);

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/dashboard/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
);

module.exports = app;