const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const cors = require("cors");

// routes
const user = require("./src/routes/user");
const order = require("./routes/order");
const product = require("./routes/product");
const payment = require("./routes/payment");

// for req.cookie to get token while autentication
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(cors());

app.use("/fear/api", product);
app.use("/fear/api", user);
app.use("/fear/api", order);
app.use("/fear/api", payment);

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/frontend")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "frontend", "src", "index.js"))
);


module.exports = app;
