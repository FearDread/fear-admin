const path = require("path"),
      express = require("express"),
      compression = require("compression"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      fileUpload = require("express-fileupload"),
      cors = require("cors"),
      helmet = require("helmet"),
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
  this.load = ( app ) => {
    const dir = "routes";
    const modPath = require('path').join( __dirname, dir );
  
    require('fs').readdirSync(modPath).forEach(( file ) => {
      const name = file.replace(/\.js$/, '');
      const module = require(`./${dir}/${file}`);
      
      this.log.info("Route added :: /fear/api/" + name);
      app.use('/fear/api/' + name, module);
    });
  
    return app;
  }
  this.logo = " ________  ________   ______   _______        \r\n|        \\|        \\ \/      \\ |       \\       \r\n| $$$$$$$$| $$$$$$$$|  $$$$$$\\| $$$$$$$\\      \r\n| $$__    | $$__    | $$__| $$| $$__| $$      \r\n| $$  \\   | $$  \\   | $$    $$| $$    $$      \r\n| $$$$$   | $$$$$   | $$$$$$$$| $$$$$$$\\      \r\n| $$      | $$_____ | $$  | $$| $$  | $$      \r\n| $$      | $$     \\| $$  | $$| $$  | $$      \r\n \\$$       \\$$$$$$$$ \\$$   \\$$ \\$$   \\$$      \r\n                                          ";

  this.app.use(morgan);
  this.app.use(express.json());
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: true }));
  this.app.use(passport.initialize());

  this.app.use((req, res, next) => {
    this.log.info("FEAR API REQ :: " + req.url);
    this.user = req.user;

    res.locals.user = req.user;
    next();
  });

  this.app.use(cors({
    origin: ["http://localhost:4001", "http://localhost:4000", "http://localhost:3000","https://fear.serveo.net","http://fear.master.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
  }));

  this.app.options("*", cors());

  // Load Routes
  this.app = this.load(app);

  this.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  this.app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  this.app.use(errors.notFound);
  this.app.use(errors.development);

  return this;

})( express() );


