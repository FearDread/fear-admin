const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const {developmentErrors, AppError} = require("./src/_helpers/errorHandlers");

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
app.use(developmentErrors);
app.use(fileUpload());
app.use(cors());

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    
    next();
});

app.use("/fear/api", auth);
app.use("/fear/api", users);
app.use("/fear/api", products);
//app.use("/fear/api", order);
//app.use("/fear/api", payment);

const __dirname1 = path.resolve();
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_LINK }),
  })
);

app.use(express.static(path.join(__dirname1, "/dashboard/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
);

module.exports = app;