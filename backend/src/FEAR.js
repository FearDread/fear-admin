const path = require("path"),
      express = require("express"),
      compression = require("compression"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      fileUpload = require("express-fileupload"),
      passport = require("passport"),
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

  this.db = db;
  this.log = logger;
  this.env = _config;
  this.cloud = cloud;
  this.logo = this.env.FEAR_LOGO;
  this.origins = _config.ALLOWED_ORIGINS.split(',').map(item => item.trim());

  this.app.set("PORT", 4000);
  this.app.use(morgan);
  this.app.use(express.json({limit: '10mb'}));
  this.app.use(compression());
  this.app.use(fileUpload());
  this.app.use(cookieParser());
  /*
  this.app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: this.env.SECRETE_KEY,
      store: new MongoStore({ url: this.env.DB_URL, autoReconnect: true }),
    })
  );
  */
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
    const dir = "routes";
    const modPath = path.join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      const module = require(`./${dir}/${file}`);
  
      this.log.info("Route added :: /fear/api/" + name);
      this.app.use('/fear/api/' + name, cors(), module);
    });
  };
  
  this.app.use(passport.initialize());
  this.app.use(passport.session());

  this.app.use(cors(this.cconfig)); 
  this.app.options("*", cors(this.cconfig));

  // Load Routes
  this.loadRoutes();

  this.app.use((req, res, next) => {
    this.log.info( "FEAR API Query :: " + req.url );
    
    res.locals.user = req.user;
    next();
  })

  this.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  this.app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  this.app.use(errors.notFound);
  this.app.use(errors.development);

  return this;

})( express() );


