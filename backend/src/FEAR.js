const path = require("path");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

module.exports = class FEAR {
  constructor() {
    this.app = express();
    this.Router = express.Router;
    this.server = null;
    this.registeredRouters = [];
    
    this.initEnv();
    this.initDeps();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  initEnv() {
    const envResult = require("dotenv").config({ path: ".env" });
    if (!envResult || envResult.error) {
      throw new Error(`Environment configuration error: ${envResult?.error?.message || 'Unknown error'}`);
    }
    this.env = envResult.parsed;
  }

  initDeps() {
    this.logger = require("./libs/logger");
    this.morgan = require("./libs/logger/morgan");
    this.cloud = require("./libs/cloud");
    this.db = require("./libs/db");
    this.handler = require("./libs/handler");
    this.validator = require("./libs/validator");
    
    this.logo = this.env.FEAR_LOGO;
    this.origins = this.parseAllowedOrigins();
  }

  parseAllowedOrigins() {
    if (!this.env.ALLOWED_ORIGINS) {
      return [];
    }
    return this.env.ALLOWED_ORIGINS
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);
  }

  setupMiddleware() {
    this.app.set("PORT", this.env.NODE_PORT || 4000);
    
    this.app.use(this.morgan);
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(compression());
    this.app.use(fileUpload());
    this.app.use(cookieParser());
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      this.logger.info(`FEAR API Query :: ${req.url}`);
      res.locals.user = req.user;
      next();
    });
  }

  getCorsConfig() {
    return {
      credentials: true,
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (this.origins.includes(origin)) {
          callback(null, true);
        } else {
          this.logger.error(`Origin :: ${origin} :: Not allowed by CORS`);
          callback(new Error("Not allowed by CORS"));
        }
      }
    };
  }

  /**
   * Register a single router with optional path and CORS configuration
   * @param {express.Router} router - Express router instance
   * @param {string} routePath - Optional path prefix (defaults to '/fear/api')
   * @param {Object} corsOptions - Optional CORS configuration (defaults to class CORS config)
   */
  useRouter(router, routePath = '/fear/api', corsOptions = null) {
    if (!router || typeof router !== 'function') {
      throw new Error('Router must be a valid Express router instance');
    }

    const corsConfig = corsOptions || this.getCorsConfig();
    
    // Store router info for tracking
    const routerInfo = {
      router,
      path: routePath,
      corsConfig
    };
    
    this.registeredRouters.push(routerInfo);
    
    // Apply the router to the app
    this.app.use(routePath, cors(corsConfig), router);
    this.logger.info(`Single router registered :: ${routePath}`);
    
    return this; // Allow chaining
  }

  /**
   * Register multiple routers at once
   * @param {Array} routers - Array of router configurations [{router, path?, cors?}]
   */
  useRouters(routers) {
    if (!Array.isArray(routers)) {
      throw new Error('Routers must be an array');
    }

    routers.forEach(config => {
      if (typeof config === 'function') {
        // Simple router function
        this.useRouter(config);
      } else if (config && config.router) {
        // Router configuration object
        this.useRouter(config.router, config.path, config.cors);
      } else {
        throw new Error('Invalid router configuration');
      }
    });

    return this;
  }

  /**
   * Create and return a new router instance with access to FearFactory context
   */
  createRouter() {
    const router = express.Router();
    
    // Add context methods to router for easy access to FearFactory components
    router.getLogger = () => this.logger;
    router.getDatabase = () => this.db;
    router.getCloud = () => this.cloud;
    router.getEnvironment = () => this.env;
    router.getHandler = () => this.handler;
    router.getValidator = () => this.validator;
    
    return router;
  }

  setupRoutes() {
    const routesDir = path.join(__dirname, "routes");
    
    if (!fs.existsSync(routesDir)) {
      this.logger.warn(`Routes directory does not exist: ${routesDir}`);
      return;
    }

    const corsConfig = this.getCorsConfig();

    try {
      const routeFiles = fs.readdirSync(routesDir)
        .filter(file => file.endsWith('.js'));

      routeFiles.forEach(file => {
        try {
          const routeName = file.replace(/\.js$/, '');
          const routeModule = require(`./routes/${file}`);
          const routePath = `/fear/api/${routeName}`;

          this.useRouter(routeModule(this), routePath);

        } catch (error) {
          this.logger.error(`Failed to load route ${file}:`, error);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to read routes directory:`, error);
    }
  }

  /**
   * Get information about all registered routers
   */
  getRegisteredRouters() {
    return this.registeredRouters.map(info => ({
      path: info.path,
      corsEnabled: !!info.corsConfig
    }));
  }

  start = async (port = null) => {
    const serverPort = port || this.app.get("PORT") || 4000;
    
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(serverPort, (err) => {
        if (err) {
          this.logger.error(`Failed to start server on port ${serverPort}:`, err);
          reject(err);
        } else {
          this.logger.info(`FEAR server started on port ${serverPort}`);
          resolve(this.server);
        }
      });
    });
  }

  shutdown = async () => {
    this.logger.info('Initiating graceful shutdown...');

    return new Promise((resolve) => {
      // Stop accepting new connections
      if (this.server) {
        this.server.close(async (err) => {
          if (err) {
            this.logger.error('Error closing HTTP server:', err);
          } else {
            this.logger.info('HTTP server closed.');
          }

          // Close database connections
          try {
            await this.closeDatabase();
            this.logger.info('Database connections closed.');
          } catch (error) {
            this.logger.error('Error closing database:', error);
          }

          this.logger.info('Graceful shutdown completed.');
          resolve();
        });
      } else {
        this.logger.warn('No server instance to close.');
        resolve();
      }
    });
  }

  async closeDatabase() {
    return new Promise((resolve, reject) => {
      if (this.db && typeof this.db.disconnect === 'function') {
        this.db.disconnect((err) => {
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
  }

  /**
   * Set this instance as the global router factory
   * Allows route files to access createRouter() globally
   */
  setAsGlobal() {
    global.FearRouter = {
      createRouter: () => this.createRouter(),
      getLogger: () => this.getLogger(),
      getDatabase: () => this.getDatabase(),
      getEnvironment: () => this.getEnvironment(),
      getCloud: () => this.getCloud()
    };
    return this;
  }

  /**
   * Clear global router factory
   */
  clearGlobal() {
    delete global.FearRouter;
    return this;
  }

  // Getter methods for accessing application components
  getApp() {
    return this.app;
  }

  getLogger() {
    return this.logger;
  }

  getDatabase() {
    return this.db;
  }

  getEnvironment() {
    return this.env;
  }

  getCloud() {
    return this.cloud;
  }

  getRouter() {
    return this.Router;
  }

  getValidator() {
    return this.validator;
  }

  getHandler() {
    return this.handler;
  }
}

const FearFactory = () => {
  return new FEAR();
}

exports.createFearApp = FearFactory;
exports.FearFactory = FearFactory;