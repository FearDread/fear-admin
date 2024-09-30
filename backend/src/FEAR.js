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

  app.set("PORT", 4000);
  app.use(helmet());
  app.use(compression());
  app.use(fileUpload());
  app.use(cookieParser());

  this.db = db;
  this.log = logger;
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

  this.env = _config;
  this.cloud = cloud;
  this.logo = " ________  ________   ______   _______        \r\n|        \\|        \\ \/      \\ |       \\       \r\n| $$$$$$$$| $$$$$$$$|  $$$$$$\\| $$$$$$$\\      \r\n| $$__    | $$__    | $$__| $$| $$__| $$      \r\n| $$  \\   | $$  \\   | $$    $$| $$    $$      \r\n| $$$$$   | $$$$$   | $$$$$$$$| $$$$$$$\\      \r\n| $$      | $$_____ | $$  | $$| $$  | $$      \r\n| $$      | $$     \\| $$  | $$| $$  | $$      \r\n \\$$       \\$$$$$$$$ \\$$   \\$$ \\$$   \\$$      \r\n                                          ";

  app.use(morgan);
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  
  app.use(cors({
    origin: ["*", 
      "http://localhost:4001", 
      "http://localhost:4000", 
      "http://localhost:3000",
      "https://fear.serveo.net"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
  }));

  this.app = this.load(app);

  this.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
  this.app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
  );

  this.app.use(errors.notFound);

  return this;

})( express() );


