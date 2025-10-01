const path = require("path");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

module.exports = FEAR = (() => {
  // Private constants
  const DEFAULT_PORT = 4000;
  const DEFAULT_JSON_LIMIT = '10mb';
  const DEFAULT_ROUTE_PATH = '/fear/api';

  // Constructor function
  function FEAR() {
    this.app = express();
    this.Router = express.Router;
    this.server = null;
    this.registeredRouters = [];
    this.env = null;
    this.logger = null;
    this.morgan = null;
    this.cloud = null;
    this.db = null;
    this.handler = null;
    this.validator = null;
    this.logo = null;
    this.origins = [];
    this.corsConfig = null;

    // Initialize
    this.setupEnvironment();
    this.setupDependencies();
    this.setupMiddleware();
    this.corsConfig = this.getCorsConfig();
    this.setupRoutes();
  }

  // Prototype methods for setup
  FEAR.prototype.setupEnvironment = function() {
    const envResult = require("dotenv").config({ path: ".env" });

    if (!envResult || envResult.error) {
      throw new Error(`Environment configuration error: ${envResult?.error?.message || 'Unknown error'}`);
    }

    this.env = envResult.parsed;
  };

  FEAR.prototype.setupDependencies = function() {
    this.logger = require("./libs/logger");
    this.morgan = require("./libs/logger/morgan");
    this.cloud = require("./libs/cloud");
    this.db = require("./libs/db");
    this.handler = require("./libs/handler");
    this.validator = require("./libs/validator");
    this.logo = this.env.FEAR_LOGO;
    this.origins = this.getAllowedOrigins();
  };

  FEAR.prototype.setupMiddleware = function() {
    this.app.set("PORT", this.env.NODE_PORT || DEFAULT_PORT);

    this.app.use(this.morgan);
    this.app.use(express.json({ limit: DEFAULT_JSON_LIMIT }));
    this.app.use(compression());
    this.app.use(fileUpload());
    this.app.use(cookieParser());

    const self = this;
    this.app.use((req, res, next) => {
      self.logger.info(`FEAR API Query :: ${req.url}`);
      res.locals.user = req.user;
      next();
    });
  };

  FEAR.prototype.getAllowedOrigins = function() {
    if (!this.env.ALLOWED_ORIGINS) return [];

    return this.env.ALLOWED_ORIGINS
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);
  };

  FEAR.prototype.getCorsConfig = function() {
    const self = this;
    return {
      credentials: true,
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (self.origins.includes(origin)) {
          callback(null, true);
        } else {
          self.logger.error(`Origin :: ${origin} :: Not allowed by CORS`);
          callback(new Error("Not allowed by CORS"));
        }
      }
    };
  };

  FEAR.prototype.setupRoutes = function() {
    const routesDir = path.join(__dirname, "routes");

    if (!fs.existsSync(routesDir)) {
      this.logger.warn(`Routes directory does not exist: ${routesDir}`);
      return;
    }

    try {
      const routeFiles = fs.readdirSync(routesDir)
        .filter(file => file.endsWith('.js'));

      routeFiles.forEach(file => {
        try {
          const routeName = file.replace(/\.js$/, '');
          const routeModule = require(`./routes/${file}`);
          const routePath = `${DEFAULT_ROUTE_PATH}/${routeName}`;

          this.useRouter(routeModule(this), routePath);

        } catch (error) {
          this.logger.error(`Failed to load route ${file}:`, error);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to read routes directory:`, error);
    }
  };

  // Router management methods
  FEAR.prototype.useRouter = function(router, routePath = DEFAULT_ROUTE_PATH, corsOptions = null) {
    if (!router || typeof router !== 'function') {
      throw new Error('Router must be a valid Express router instance');
    }

    const corsConfig = corsOptions || this.corsConfig;

    const routerInfo = {
      router,
      path: routePath,
      corsConfig
    };

    this.registeredRouters.push(routerInfo);
    this.app.use(routePath, cors(corsConfig), router);
    this.logger.info(`Single router registered :: ${routePath}`);

    return this;
  };

  FEAR.prototype.useRouters = function(routers) {
    if (!Array.isArray(routers)) {
      throw new Error('Routers must be an array');
    }

    routers.forEach(config => {
      if (typeof config === 'function') {
        this.useRouter(config);
      } else if (config && config.router) {
        this.useRouter(config.router, config.path, config.cors);
      } else {
        throw new Error('Invalid router configuration');
      }
    });

    return this;
  };

  FEAR.prototype.createRouter = function() {
    const router = express.Router();
    const self = this;

    router.getLogger = () => self.logger;
    router.getDatabase = () => self.db;
    router.getCloud = () => self.cloud;
    router.getEnvironment = () => self.env;
    router.getHandler = () => self.handler;
    router.getValidator = () => self.validator;

    return router;
  };

  FEAR.prototype.getRegisteredRouters = function() {
    return this.registeredRouters.map(info => ({
      path: info.path,
      corsEnabled: !!info.corsConfig
    }));
  };

  // Server lifecycle methods
  FEAR.prototype.start = async function(port = null) {
    const self = this;
    const serverPort = port || this.app.get("PORT") || DEFAULT_PORT;

    return new Promise((resolve, reject) => {
      self.server = self.app.listen(serverPort, (err) => {
        if (err) {
          self.logger.error(`Failed to start server on port ${serverPort}:`, err);
          reject(err);
        } else {
          self.logger.info(`FEAR server started on port ${serverPort}`);
          resolve(self.server);
        }
      });
    });
  };

  FEAR.prototype.shutdown = async function() {
    const self = this;
    this.logger.info('Initiating graceful shutdown...');

    return new Promise((resolve) => {
      if (self.server) {
        self.server.close(async (err) => {
          if (err) {
            self.logger.error('Error closing HTTP server:', err);
          } else {
            self.logger.info('HTTP server closed.');
          }

          try {
            await self.closeDatabase();
            self.logger.info('Database connections closed.');
          } catch (error) {
            self.logger.error('Error closing database:', error);
          }

          self.logger.info('Graceful shutdown completed.');
          resolve();
        });
      } else {
        self.logger.warn('No server instance to close.');
        resolve();
      }
    });
  };

  FEAR.prototype.closeDatabase = async function() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.db && typeof self.db.disconnect === 'function') {
        self.db.disconnect((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  };

  // Global methods
  FEAR.prototype.setAsGlobal = function() {
    const self = this;
    global.FearRouter = {
      createRouter: () => self.createRouter(),
      getLogger: () => self.logger,
      getDatabase: () => self.db,
      getEnvironment: () => self.env,
      getCloud: () => self.cloud
    };
    return this;
  };

  FEAR.prototype.clearGlobal = function() {
    delete global.FearRouter;
    return this;
  };

  // Getter methods
  FEAR.prototype.getApp = function() {
    return this.app;
  };

  FEAR.prototype.getLogger = function() {
    return this.logger;
  };

  FEAR.prototype.getDatabase = function() {
    return this.db;
  };

  FEAR.prototype.getEnvironment = function() {
    return this.env;
  };

  FEAR.prototype.getCloud = function() {
    return this.cloud;
  };

  FEAR.prototype.getRouter = function() {
    return this.Router;
  };

  FEAR.prototype.getValidator = function() {
    return this.validator;
  };

  FEAR.prototype.getHandler = function() {
    return this.handler;
  };

  FEAR.prototype.getCorsConfigValue = function() {
    return this.corsConfig;
  };

  return FEAR;
})();

exports.FearFactory = () => {
  return new FEAR();
};