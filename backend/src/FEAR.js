const path = require("path"),
      express = require("express"),
      compression = require("compression"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      fileUpload = require("express-fileupload"),
      cors = require("cors"),
      __dirname1 = path.resolve();


module.exports = FEAR = (( app ) => {
  const env = require("dotenv").config({ path:"backend/.env"});
  if ( !env || env.error ) throw env.error;
  
  const logger = require("./libs/logger");
  const morgan = require("./libs/logger/morgan");
  const errors = require("./libs/handler/error");
  const cloud = require("./libs/cloud");
  const db = require("./libs/db"),
        {parsed: _config} = env;
      
  this.app = app;

  this.app.set("PORT", 4000);
  this.app.use(compression());
  this.app.use(fileUpload());
  this.app.use(cookieParser());

  this.db = db;
  this.log = logger;
  this.env = _config;
  this.cloud = cloud;
  this.origins = this.env.ALLOWED_ORIGINS.split(',').map(item => item.trim());

  this.cconfig = {
    origin: (origin, callback) => {
      if (!origin || this.origins.indexOf(origin) !== -1) { 
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }
  this.loadRoutes = () => {
    const dir = "routes";
    const modPath = path.join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      const module = require(`./${dir}/${file}`);
  
      this.log.info("Route added :: /fear/api/" + name);
      this.app.use('/fear/api/' + name, module);
    });
  };
  
  this.logo = this.env.FEAR_LOGO;
  
  this.app.use(morgan);
  this.app.use(express.json());
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: true }));
  this.app.use(passport.initialize());

  this.app.use(cors(this.cconfig));
  this.app.options("*", cors());

  // Load Routes
  this.loadRoutes();
  
  this.app.use((req, res, next) => {
    this.log.info("FEAR API REQ :: " + req.url);
    next();
  });
;
  this.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  this.app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  this.app.use(errors.notFound);
  this.app.use(errors.development);

  return this;

})( express() );


