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
  const AGENT_ROUTE_PATH = '/fear/api/agent';

  // Constructor function
  const FEAR = function() {
    this.app = express();
    this.Router = express.Router;
    this.server = null;
    this.registeredRouters = [];
    this.env = null;
    this.logger = null;
    this.morgan = null;
    this.cloud = null;
    this.agentService = null;
    this.agentWebInterface = null;
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
    this.setupAiAgent();
    //this.setupAgentWebInterface();
  };

  // Consolidated prototype
  FEAR.prototype = {
    constructor: FEAR,

    /**
     * Initialize AI Agent service
     */
    setupAiAgent() {
      const { getInstance } = require("./libs/agent");

      if (!this.agentService) {
        this.agentService = getInstance();
      }
    },

    /**
     * Initialize Agent Web Interface
     */
    setupAgentWebInterface() {
      try {
        const AgentWebInterface = require("./libs/agent");
        
        this.agentWebInterface = new AgentWebInterface(this);
        
        // Register agent routes
        this.useRouter(
          this.agentWebInterface.getRouter(), 
          AGENT_ROUTE_PATH
        );
        
        this.logger.info(`Agent Web Interface initialized at ${AGENT_ROUTE_PATH}`);
      } catch (error) {
        this.logger.error("Failed to initialize Agent Web Interface:", error);
        this.logger.warn("Agent Web Interface will not be available");
      }
    },

    /**
     * Get AI Agent service instance
     */
    getAiAgent() {
      return this.agentService;
    },

    /**
     * Get Agent Web Interface instance
     */
    getAgentWebInterface() {
      return this.agentWebInterface;
    },

    /**
     * Clear global FearRouter
     */
    clearGlobal() {
      delete global.FearRouter;
      return this;
    },

    /**
     * Get Express app instance
     */
    getApp() {
      return this.app;
    },

    /**
     * Get logger instance
     */
    getLogger() {
      return this.logger;
    },

    /**
     * Get database instance
     */
    getDatabase() {
      return this.db;
    },

    /**
     * Get environment configuration
     */
    getEnvironment() {
      return this.env;
    },

    /**
     * Get cloud service instance
     */
    getCloud() {
      return this.cloud;
    },

    /**
     * Get Express Router
     */
    getRouter() {
      return this.Router;
    },

    /**
     * Get validator instance
     */
    getValidator() {
      return this.validator;
    },

    /**
     * Get handler instance
     */
    getHandler() {
      return this.handler;
    },

    /**
     * Get CORS configuration
     */
    getCorsConfigValue() {
      return this.corsConfig;
    },

    /**
     * Setup environment variables from .env file
     */
    setupEnvironment() {
      const envResult = require("dotenv").config({ path: ".env" });

      if (!envResult || envResult.error) {
        throw new Error(`Environment configuration error: ${envResult?.error?.message || 'Unknown error'}`);
      }

      this.env = envResult.parsed;
    },

    /**
     * Setup core dependencies
     */
    setupDependencies() {
      this.logger = require("./libs/logger");
      this.morgan = require("./libs/logger/morgan");
      this.cloud = require("./libs/cloud");
      this.db = require("./libs/db");
      this.handler = require("./libs/handler");
      this.validator = require("./libs/validator");
      this.logo = this.env.FEAR_LOGO;
      this.origins = this.getAllowedOrigins();
    },

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
      this.app.set("PORT", this.env.NODE_PORT || DEFAULT_PORT);

      this.app.use(this.morgan);
      this.app.use(express.json({ limit: DEFAULT_JSON_LIMIT }));
      this.app.use(compression());
      this.app.use(fileUpload());
      this.app.use(cookieParser());

      // Request logging middleware
      this.app.use((req, res, next) => {
        this.logger.info(`FEAR API Query :: ${req.url}`);
        res.locals.user = req.user;
        next();
      });
    },

    /**
     * Parse allowed origins from environment
     */
    getAllowedOrigins() {
      if (!this.env.ALLOWED_ORIGINS) return [];

      return this.env.ALLOWED_ORIGINS
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => origin.length > 0);
    },

    /**
     * Get CORS configuration object
     */
    getCorsConfig() {
      return {
        credentials: true,
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);

          if (this.origins.includes(origin)) {
            callback(null, true);
          } else {
            this.logger.error(`Origin :: ${origin} :: Not allowed by CORS`);
            callback(new Error("Not allowed by CORS"));
          }
        }
      };
    },

    /**
     * Auto-load routes from routes directory
     */
    setupRoutes() {
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
    },

    /**
     * Register a single router
     */
    useRouter(router, routePath = DEFAULT_ROUTE_PATH, corsOptions = null) {
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
    },

    /**
     * Register multiple routers
     */
    useRouters(routers) {
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
    },

    /**
     * Create a new router with FEAR utilities attached
     */
    createRouter() {
      const router = express.Router();

      router.getLogger = () => this.logger;
      router.getDatabase = () => this.db;
      router.getCloud = () => this.cloud;
      router.getEnvironment = () => this.env;
      router.getHandler = () => this.handler;
      router.getValidator = () => this.validator;
      router.getAiAgent = () => this.agentService;
      //router.getAgentWebInterface = () => this.agentWebInterface;

      return router;
    },

    /**
     * Get list of registered routers
     */
    getRegisteredRouters() {
      return this.registeredRouters.map(info => ({
        path: info.path,
        corsEnabled: !!info.corsConfig
      }));
    },

    /**
     * Start the HTTP server
     */
    start(port = null) {
      const serverPort = port || this.app.get("PORT") || DEFAULT_PORT;

      return new Promise((resolve, reject) => {
        this.server = this.app.listen(serverPort, (err) => {
          if (err) {
            this.logger.error(`Failed to start server on port ${serverPort}:`, err);
            return reject(err);
          }
          
          this.logger.info(`FEAR server started on port ${serverPort}`);
          
          // Log agent interface status
          if (this.agentWebInterface) {
            this.logger.info(`Agent Web Interface available at ${AGENT_ROUTE_PATH}`);
          }
          
          resolve(this.server);
        });
      });
    },

    /**
     * Gracefully shutdown the server
     */
    shutdown() {
      this.logger.info('Initiating graceful shutdown...');

      return new Promise((resolve) => {
        if (!this.server) {
          this.logger.warn('No server instance to close.');
          return resolve();
        }

        this.server.close((err) => {
          if (err) {
            this.logger.error('Error closing HTTP server:', err);
          } else {
            this.logger.info('HTTP server closed.');
          }

          // Shutdown agent web interface
          const agentShutdown = this.agentWebInterface && 
            typeof this.agentWebInterface.shutdown === 'function' ?
            this.agentWebInterface.shutdown() :
            Promise.resolve();

          agentShutdown
            .then(() => {
              return this.closeDatabase();
            })
            .then(() => {
              this.logger.info('Database connections closed.');
              this.logger.info('Graceful shutdown completed.');
              resolve();
            })
            .catch((error) => {
              this.logger.error('Error during shutdown:', error);
              resolve();
            });
        });
      });
    },

    /**
     * Close database connections
     */
    closeDatabase() {
      return new Promise((resolve, reject) => {
        if (this.db && typeof this.db.disconnect === 'function') {
          this.db.disconnect((err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },

    /**
     * Set FEAR utilities as global
     */
    setAsGlobal() {
      global.FearRouter = {
        createRouter: () => this.createRouter(),
        getLogger: () => this.logger,
        getDatabase: () => this.db,
        getEnvironment: () => this.env,
        getCloud: () => this.cloud,
        getAiAgent: () => this.agentService,
        getAgentWebInterface: () => this.agentWebInterface
      };
      return this;
    }
  };

  return FEAR;
})();

/**
 * Factory function to create new FEAR instance
 */
exports.FearFactory = () => {
  return new FEAR();
};