const path = require("path");
const express = require("express");


const FEAR = (( app ) => {
  const env = require("dotenv").config({ path:"backend/.env"});
  if ( !env || env.error ) throw env.error;

  const compression = require("compression"),
        passport = require("passport"),
        bodyParser = require("body-parser"),
        cookieParser = require("cookie-parser"),
        fileUpload = require("express-fileupload"),
        cors = require("cors"),
        helmet = require("helmet"),
        __dirname1 = path.resolve();
  
  const db = require("./libs/db"),
        {_loadRoutes} = require("./libs/loader"),
        {parsed: _config} = env;

  app.set("PORT", 4000);
  app.use(cors({
      origin: ["http://localhost:4000", "http://fear.master.com:4000", "http://localhost:4001"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
  }));

  app.use(helmet());
  app.use(compression());
  app.use(fileUpload());
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());

  app.use((req, res, next) => {
    delete req.body.id;

    res.locals.admin = req.admin || null;
    res.locals.currentPath = req.path;
    next();
  });

  const routes = _loadRoutes( "./routes/*.js" );

  app.use("/fear/api", routes);
  app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  return {
    db,
    app,
    env: _config,
    init: () => {},
    cluster: () => {}
  }
})( express() );

module.exports = FEAR;