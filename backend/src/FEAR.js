const path = require("path"),
      express = require("express"),
      compression = require("compression"),
     // passport = require("passport-local"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      fileUpload = require("express-fileupload"),
      cors = require("cors"),
      __dirname1 = path.resolve();


module.exports = FEAR = (( app ) => {
  const env = require("dotenv").config({ path:"backend/.env"});
  if ( !env || env.error ) throw env.error;
  
  const validator = require("./libs/validator");
  const logger = require("./libs/logger");
  const morgan = require("./libs/logger/morgan");
  const errors = require("./libs/handler/error");
  const cloud = require("./libs/cloud");
  const passport = require("./libs/passport");
  const db = require("./libs/db"),
        {parsed: _config} = env;
      
  this.app = app;

  this.app.set("PORT", 4000);
  this.app.use(compression());
  this.app.use(fileUpload());
  this.app.use(cookieParser());

  this.db = db;
  this.passport = passport;
  this.log = logger;
  this.env = _config;
  this.cloud = cloud;
  this.validator = validator;
  this.origins = _config.ALLOWED_ORIGINS.split(',').map(item => item.trim());
  this.cconfig = {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || this.origins.indexOf(origin) !== -1) { 
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  }

  this.loadRoutes = () => {
    const dir = "routes";
    const modPath = path.join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      const module = require(`./${dir}/${file}`);
  
      this.log.info("Route added :: /fear/api/" + name);
      this.app.use('/fear/api/' + name, cors(this.cconfig), module);
    });
  };
  
  this.logo = this.env.FEAR_LOGO;
  
  this.app.use(morgan);
  this.app.use(express.json());
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: true }));

  this.app.use(this.passport);
  this.app.use(cors(this.cconfig));  
  this.app.use((req, res, next) => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", this.env.ALLOWED_HEADERS );
    res.setHeader( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE" );
    
    this.log.info( "FEAR API Query :: " + req.query );
    next();
  });
  this.app.options("*", cors());
  // Load Routes
  this.loadRoutes();

  this.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  this.app.get("*", cors(this.cconfig), (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  this.app.use(errors.notFound);
  this.app.use(errors.development);

  return this;

})( express() );


