const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const db = require("./src/data/db");
// routes
const cart = require("./src/routes/cart");
const users = require("./src/routes/user");
const customers = require("./src/routes/customer");
const products = require("./src/routes/product");
//const order = require("./routes/order");
//const payment = require("./routes/payment");
/* Middlewares */
const notFound = require("./src/middleware/not-found");
const DataError = require("./src/middleware/error-handler");
const { isAuth } = require("./src/auth");

dotenv.config({ path: "./.env" });

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

app.use(cors());
app.use(helmet());
//app.options("*", cors());


// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});
//Allow all requests from all domains & localhost

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://fear.ekomix.com", "/");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, x-auth-token, Content-Type, X-Requested-With, Range"
  );
  
  next();
});

app.use("/fear/api/users", users);
app.use("/fear/api/product", products);
app.use("/fear/api", cart);
//app.use("/fear/api", order);
//app.use("/fear/api", payment);

//app.use(notFound);
//app.use(DataError);

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/dashboard/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
);

module.exports = app;