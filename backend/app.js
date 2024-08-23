const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
// routes
const routes = require("./routes");
const mailbag = require('./mail');
dotenv.config({ path: "./.env" });

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(helmet( { contentSecurityPolicy: false, }));

app.use("/fear/api/user", routes.users);
app.use("/fear/api/product", routes.products);
app.use("/fear/api/cart", routes.cart);
app.use("/fear/api", routes.payment);
//app.use("/fear/api", routes.order);

app.use("/fear/api/mail", mailbag);

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/dashboard/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
);

// Serve the client to a requested browser.
// The static middleware is a built-in middleware for serving static resources. 
// __dirname is the directory the current script is in
app.use("/mailbag", express.static(path.join(__dirname, "../mailbag/dist")));

module.exports = app;

/*=================================================
//Allow all requests from all domains & localhost
/*
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

//app.use(notFound);
//app.use(DataError);

*/