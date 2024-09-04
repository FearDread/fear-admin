
const express = require("express")
const app = express();

const _load = ( dir ) => {
  let mods = {}.;
  const glob = require("glob");
  const path = require("path");
  console.log('Loading into FEAR :: ' + dir);

  glob.sync("./" + dir + "/*.js").forEach(( file ) => {
    console.log("Require module :: " + file);
    mods[require(path.resolve( file ))];
  });
  console.log("loaded mods ::", mods);
  return mods;
}

const FEAR = ( app ) => {
  require("dotenv").config();

  const db = require("./libs/db");
  const compression = require("compression"),
        passport = require("passport"),
        bodyParser = require("body-parser"),
        cookieParser = require("cookie-parser"),
        fileUpload = require("express-fileupload"), // used for image and other files
        cors = require("cors"),
        helmet = require("helmet");

  app.set("PORT", 4000);

  app.use(cors({
      origin: ["http://localhost:4000", "http://fear.master.com:4000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
  }));
  app.use(helmet());
  app.use(compression());
  app.use(fileUpload());
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());

  const fs = require("fs");
  const routes = fs.readFileSync("./routes");
  
  for (const route of routes) {
    app.use("/fear/api/" + route, require("./" + route));
  }

  app.use((req, res, next) => {
    delete req.body.id;

    res.locals.admin = req.admin || null;
    res.locals.currentPath = req.path;
    next();
  });

  const _this = this;
  const __dirname1 = path.resolve();

  app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  return {
    db,
    app,
    crud: require("./libs/crud"),
    auth: require( "./libs/auth")( _this ),
    models: _load("./models"),
    controllers: _load("./controllers"),

    init: () => {
       console.log('FEAR.init() Called ::', _this);
    }
  };
};

module.exports = FEAR( app );