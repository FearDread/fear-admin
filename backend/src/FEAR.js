const path = require("path"),
      express = require("express"),
      compression = require("compression"),
      cookieParser = require("cookie-parser"),
      fileUpload = require("express-fileupload"),
      //passport = require("passport"),
      cors = require("cors");


module.exports = FEAR = (( app ) => {
  const env = require("dotenv").config({ path:".env"});
  if ( !env || env.error ) throw env.error;

  const logger = require("./libs/logger");
  const morgan = require("./libs/logger/morgan");
  const cloud = require("./libs/cloud");
  const db = require("./libs/db"),
        {parsed: _config} = env;
      
  this.app = app;

  this.db = db;
  this.log = logger;
  this.env = _config;
  this.cloud = cloud;
  this.logo = this.env.FEAR_LOGO;
  this.origins = (_config.ALLOWED_ORIGINS) ? _config.ALLOWED_ORIGINS.split(',').map(item => item.trim()) : {};

  this.app.set("PORT", 4000);
  this.app.set("DREAD_PORT", 5000);
  this.app.use(morgan);
  this.app.use(express.json({limit: '10mb'}));
  this.app.use(compression());
  this.app.use(fileUpload());
  this.app.use(cookieParser());

  this.cconfig = {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || this.origins.indexOf(origin) !== -1) { 
        callback(null, true)
      } else {
        this.log.error("Origin :: " + origin + " :: Not allowed by CORS");
        callback(new Error("Not allowed by CORS"));
      }
    }
  }

  this.loadRoutes = () => {
    const _this = this;
    const dir = "routes";
    const modPath = path.join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      const module = require(`./${dir}/${file}`);
  
      this.log.info("Route added :: /fear/api/" + name);
      this.app.use('/fear/api/' + name, cors(_this.cconfig), module);
    });
  };

  this.shutdown = () => {
    // 1. Stop accepting new connections
    this.app.listen().close((err) => {
      if (err) {
        this.log.error('Error closing server:', err);
        process.exit(1); // Exit with error code if server close fails
      }
      this.log.warn('HTTP server closed.');

      this.log.warn('Closing database connections...');
      this.db.close(() => {
        this.log.warn('Closed DB Connection');
      })

      this.log.warn('All resources released. Exiting process.');
      process.exit(0); // Exit with success code
    });
  }
  
  this.app.use((req, res, next) => {
    this.log.info( "FEAR API Query :: " + req.url );

    res.locals.user = req.user;
    next();
  })

  // Load Routes
  this.loadRoutes();

  return this;

})( express() );


