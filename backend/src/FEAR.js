const path = require("path");
const express = require("express")


const FEAR = (( app ) => {
  const env = require("dotenv").config({ path:"backend/.env"});
  if ( !env || env.error ) throw env.error;
  const {parsed: _config} = env;

  const _load = ( dir ) => {
    console.log('Loading into FEAR :: ' + dir);
    let obj = {};
    const modPath = require('path').join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      obj[name] = require(`./${dir}/${file}`);
    });
  
    console.log("loaded mods ::", obj);
    return obj;
  }
  
  const compression = require("compression"),
        passport = require("passport"),
        bodyParser = require("body-parser"),
        cookieParser = require("cookie-parser"),
        fileUpload = require("express-fileupload"),
        cors = require("cors"),
        helmet = require("helmet"),
        __dirname1 = path.resolve();

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

  app.use((req, res, next) => {
    delete req.body.id;

    res.locals.admin = req.admin || null;
    res.locals.currentPath = req.path;
    next();
  });

  const routes = _load( "routes" );
  app.use("/fear/api", routes);

  app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  return {
    app,
    env: _config,
    load: _load,
    db: require("./libs/db"),
    init: () => {},
    cluster: () => {}
  }
})( express() );

module.exports = FEAR;