const path = require("path");
const express = require("express")
const app = express();

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

const FEAR = ( app ) => {
  require("dotenv").config();
  const os = require("os");
  const compression = require("compression"),
        passport = require("passport"),
        bodyParser = require("body-parser"),
        cookieParser = require("cookie-parser"),
        fileUpload = require("express-fileupload"),
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

  app.use((req, res, next) => {
    delete req.body.id;

    res.locals.admin = req.admin || null;
    res.locals.currentPath = req.path;
    next();
  });

  const _this = this;
  const __dirname1 = path.resolve();
  //const routes = fs.readFileSync("./backend/src/routes");
  /*
  glob.sync("./routes/*.js").forEach(( file ) => {
    console.log("route = ", file);
    app.use("/fear/api/" + file, require("./" + file));
  })
*/
  app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  return {
    app,
    db: require("./libs/db"),
    models: _load("models"),
    crud: require("./libs/crud"),
    handler: require("./libs/handler"),
    //controllers: _load("controllers"),
    auth: require( "./libs/auth")( FEAR ),
    config: require("./libs/config"),
    load: _load,
    init: () => {},
    cluster: () => {}
  }
};

module.exports = FEAR( app );