#!/usr/bin/env node

const path = require('path');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const http = require('http');
const https = require('https');

const FearServer = (function () {
  // Private constants
  const DEFAULT_PATHS = {
    root: path.resolve(),
    app: 'backend/admin/build', 
    build: 'backend/admin/build'
  };

  const DEFAULT_PORT = 4000;
  const DEFAULT_HTTPS_PORT = 443;
  const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

  // Constructor
  function FearServer() {
    this.fear = null;
    this.server = null;
    this.httpsServer = null;
    this.httpRedirectServer = null;
    this.Router = null;
    this.isShuttingDown = false;
    this.rootDir = path.resolve();
    this.reactApps = []; // Track multiple React apps
    this.envLoaded = false;
    this.httpsConfig = null;
    this.greenlock = null;
    this.autoEncrypt = null;
  }

  FearServer.prototype = {
    constructor: FearServer,

    /**
     * Load environment variables from .env file
     * @param {string|Object} envConfig - Path to .env file or dotenv config object
     */
    loadEnv(envConfig) {
      let envPath;
      let options = {};

      // Handle different config formats
      if (typeof envConfig === 'string') {
        envPath = envConfig;
      } else if (typeof envConfig === 'object') {
        envPath = envConfig.path;
        options = envConfig;
      }

      // Auto-detect .env file if not specified
      if (!envPath) {
        const possiblePaths = [
          path.join(this.rootDir, '.env'),
          path.join(this.rootDir, '.env.local'),
          path.join(this.rootDir, '.env.development'),
          path.join(this.rootDir, '.env.production'),
          path.join(process.cwd(), '.env'),
        ];

        // Check NODE_ENV for environment-specific files
        if (process.env.NODE_ENV) {
          possiblePaths.unshift(
            path.join(this.rootDir, `.env.${process.env.NODE_ENV}`),
            path.join(this.rootDir, `.env.${process.env.NODE_ENV}.local`)
          );
        }

        // Find first existing .env file
        envPath = possiblePaths.find(p => fs.existsSync(p));
      }

      if (envPath && !fs.existsSync(envPath)) {
        console.warn(`⚠️  Warning: .env file not found at ${envPath}`);
        return false;
      }

      if (!envPath) {
        console.warn('Warning: No .env file found in common locations');
        console.warn('   Checked:', [
          path.join(this.rootDir, '.env'),
          path.join(this.rootDir, `.env.${process.env.NODE_ENV || 'development'}`),
          path.join(process.cwd(), '.env')
        ]);
        return false;
      }

      // Load the .env file
      const result = dotenv.config({ path: envPath, ...options });

      if (result.error) {
        console.error('Error loading .env file:', result.error);
        return false;
      } 

      this.envLoaded = true;
      return true;
    },

    /**
     * Configure HTTPS with auto-encryption using Greenlock or Auto Encrypt
     * @param {Object} config - HTTPS configuration
     * @param {string} config.mode - 'greenlock', 'auto-encrypt', or 'manual'
     * @param {string} config.domain - Domain name for Let's Encrypt (greenlock/auto-encrypt mode)
     * @param {string} config.email - Email for Let's Encrypt notifications (greenlock/auto-encrypt mode)
     * @param {string} config.certPath - Path to SSL certificate (manual mode)
     * @param {string} config.keyPath - Path to SSL private key (manual mode)
     * @param {string} config.caPath - Path to CA bundle (manual mode, optional)
     * @param {boolean} config.staging - Use Let's Encrypt staging server (greenlock/auto-encrypt mode)
     * @param {string} config.configDir - Directory to store Greenlock config (greenlock mode, default: ./greenlock.d)
     * @param {string} config.settingsPath - Path to Auto Encrypt settings (auto-encrypt mode, default: .small-tech.org)
     * @param {number} config.httpsPort - HTTPS port (default: 443)
     * @param {boolean} config.redirectHttp - Redirect HTTP to HTTPS (default: true)
     * @param {Array<string>} config.altnames - Alternative domain names (greenlock mode, optional)
     */
    setupHTTPS(config = {
      mode: 'manual',
      domain: 'fear.dedyn.io',
      email: 'fear.dread@underworld.dog',
    }) {
      if (!config) throw Error('Missing config for HTTPS setup');

      this.httpsConfig = {
        mode: config.mode || 'manual',
        domain: config.domain || process.env.HTTPS_DOMAIN,
        email: config.email || process.env.HTTPS_EMAIL,
        httpsPort: config.httpsPort || process.env.HTTPS_PORT,
        redirectHttp: config.redirectHttp !== false,
        certPath: path.join(path.resolve(), 'certificates', config.cert || process.env.SSL_CERT),
        caPath: path.join(path.resolve(), 'certificates', config.ca || process.env.SSL_CA),
        keyPath: path.join(path.resolve(), 'certificates', config.key || process.env.SSL_KEY),
      };
      
      if ( this._validateCerts(this.httpsConfig) ) {
        this._createHttpsServer();
      };

      if (this.fear && this.fear.getLogger()) {
        this.fear.getLogger().info('HTTPS configuration loaded successfully');
      }
    },

    _validateCerts() {
      const config = this.httpsConfig;

      if (!config.certPath || !config.keyPath) {
        throw new Error('Certificate path and key path are required for manual HTTPS mode');
      }

      if (!fs.existsSync(config.certPath)) {
        throw new Error(`SSL certificate not found: ${config.certPath}`);
      }

      if (!fs.existsSync(config.keyPath)) {
        throw new Error(`SSL private key not found: ${config.keyPath}`);
      }

      if (config.caPath && !fs.existsSync(config.caPath)) {
        throw new Error(`CA bundle not found: ${config.caPath}`);
      }

      if (this.fear && this.fear.getLogger()) {
        this.fear.getLogger().info('Manual SSL certificates validated');
      }

      return true;
    },

    _createHttpsServer() {
      const config = this.httpsConfig;
      
      const httpsOptions = {
        key: fs.readFileSync(config.keyPath),
        cert: fs.readFileSync(config.certPath)
      };

      if (config.caPath) {
        httpsOptions.ca = fs.readFileSync(config.caPath);
      }

      return https.createServer(httpsOptions, this.fear.getApp());
    },

    _createRedirectServer(httpsPort) {
      const redirectApp = express();
      
      redirectApp.use((req, res) => {
        const host = req.headers.host.split(':')[0];
        const httpsUrl = `https://${host}${httpsPort !== 443 ? ':' + httpsPort : ''}${req.url}`;
        res.redirect(301, httpsUrl);
      });

      return http.createServer(redirectApp);
    },

    /**
     * Validate that required files exist for React app
     * @param {string} buildPath - Path to build directory
     * @param {string} indexPath - Path to index.html
     */
    validateReactApp(buildPath, indexPath) {
      if (!fs.existsSync(buildPath)) {
        throw new Error(`Build directory not found: ${buildPath}`);
      }

      if (!fs.existsSync(indexPath)) {
        throw new Error(`index.html not found: ${indexPath}`);
      }

      this.fear.getLogger().info('✓ React app files validated');
      return true;
    },

    /**
     * Configure static file serving for React SPA
     * @param {string} root - Root directory path
     * @param {string} app - App directory path relative to root
     * @param {string} build - Build directory path for index.html
     * @param {string} basePath - Base path for the app (e.g., '/admin', '/dashboard')
     */
    setupStaticFiles(root, app, build, basePath = '') {
      this.rootDir = root || path.resolve();
      
      // Construct paths - handle both absolute and relative paths
      const buildPath = path.isAbsolute(app) 
        ? app 
        : path.join(this.rootDir, app);
      
      const indexPath = path.isAbsolute(build)
        ? path.join(build, "index.html")
        : path.join(this.rootDir, build, "index.html");

      // Normalize base path
      const normalizedBasePath = basePath
        ? `/${basePath.replace(/^\/+|\/+$/g, '')}`
        : '';

      // Debug logging
      this.fear.getLogger().info('═══════════════════════════════════════');
      this.fear.getLogger().info('React App Path Resolution:');
      this.fear.getLogger().info(`→ Build path: ${buildPath}`);
      this.fear.getLogger().info(`→ Index path: ${indexPath}`);
      this.fear.getLogger().info(`→ Base path: ${normalizedBasePath || '/'}`);

      // Validate React app exists
      try {
        this.validateReactApp(buildPath, indexPath);
      } catch (error) {
        this.fear.getLogger().error('React app validation failed:', error.message);
        throw error;
      }

      // Serve static files with caching headers
      this.fear.getApp().use(
        normalizedBasePath,
        (req, res, next) => {
          this.fear.getLogger().debug(`Static file request: ${req.path}`);
          next();
        },
        express.static(buildPath, {
          index: false,
          fallthrough: true,
          maxAge: '1h',
          etag: true,
          lastModified: true,
          setHeaders: (res, filePath) => {
            if (filePath.endsWith('index.html')) {
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            }
            else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
          }
        })
      );

      this.fear.getApp().use(`${normalizedBasePath}/*`, (req, res, next) => {
        this.fear.getLogger().debug(`Route request: ${req.path}`);
        
        // Skip if it's an API route
        if (req.path.startsWith('/fear/api')) {
          this.fear.getLogger().debug('Skipping - API route');
          return next();
        }

        res.sendFile(indexPath, (err) => {
          if (err) {
            this.fear.getLogger().error('Error serving index.html:', err);
            res.status(500).send('Internal Server Error');
          }
        });
      });

      // Track registered React apps
      this.reactApps.push({
        basePath: normalizedBasePath || '/',
        buildPath,
        indexPath
      });

      this.fear.getLogger().info(`React app configured at: ${normalizedBasePath || '/'}`);
    },

    /**
     * Add multiple React apps at different base paths
     * @param {Array} apps - Array of app configurations
     * Example: [{root: __dirname, app: '/build', build: 'build', basePath: '/admin'}]
     */
    setupMultipleReactApps(apps) {
      if (!Array.isArray(apps)) {
        throw new Error('setupMultipleReactApps expects an array of app configurations');
      }

      apps.forEach((appConfig, index) => {
        this.fear.getLogger().info(`Setting up React app ${index + 1}/${apps.length}`);
        this.setupStaticFiles(
          appConfig.root,
          appConfig.app,
          appConfig.build,
          appConfig.basePath
        );
      });
    },

    /**
     * Setup CORS for React development
     * @param {Object} options - CORS options
     */
    setupCORS(options = {}) {
      const defaultOptions = {
        origin: options.origin || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: options.credentials || false
      };

      this.fear.getApp().use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', defaultOptions.methods.join(', '));
        res.header('Access-Control-Allow-Headers', defaultOptions.allowedHeaders.join(', '));
        
        if (defaultOptions.credentials) {
          res.header('Access-Control-Allow-Credentials', 'true');
        }

        // Handle preflight
        if (req.method === 'OPTIONS') {
          return res.sendStatus(200);
        }

        next();
      });

      this.fear.getLogger().info('CORS configured for React development');
    },

    /**
     * Setup API prefix for all routes
     * @param {string} prefix - API prefix (e.g., '/api/v1')
     */
    setupAPIPrefix(prefix) {
      if (!prefix || typeof prefix !== 'string') {
        throw new Error('API prefix must be a string');
      }

      const normalizedPrefix = `/${prefix.replace(/^\/+|\/+$/g, '')}`;
      
      this.fear.getLogger().info(`Setting up API prefix: ${normalizedPrefix}`);
      // This would need to be implemented in your FEAR framework
      // to prefix all routes - just documenting the intent here
    },

    setupProcessHandlers() {
      // Prevent duplicate listeners
      if (this._handlersSetup) {
        return;
      }
      this._handlersSetup = true;

      process.on("uncaughtException", (err) => {
        this.fear.getLogger().error('Uncaught Exception:', err);
        this.gracefulShutdown('uncaughtException');
      });

      // Handle termination signals
      process.on('SIGTERM', () => {
        this.fear.getLogger().info('SIGTERM received, starting graceful shutdown');
        this.gracefulShutdown('SIGTERM');
      });

      process.on('SIGINT', () => {
        this.fear.getLogger().info('SIGINT received, starting graceful shutdown');
        this.gracefulShutdown('SIGINT');
      });
    },

    /**
     * Initialize database connection
     */
    initializeDatabase() {
      return new Promise((resolve, reject) => {
        try {
          this.fear.getDatabase().connect(this.fear.getEnvironment(), (err) => {
            if (err) {
              this.fear.getLogger().error('Database initialization failed:', err);
              return reject(err);
            }

            this.fear.getLogger().info('Database initialized successfully');
            resolve();
          });
        } catch (error) {
          this.fear.getLogger().error('Database setup error:', error);
          reject(error);
        }
      });
    },

    /**
     * Start HTTP server on specified port
     */
    async _startHttpServer(port) {
      return new Promise((resolve, reject) => {
        const server = this.fear.getApp().listen(port, (err) => {
          if (err) {
            this.fear.getLogger().error(`Failed to start server on port ${port}:`, err);
            return reject(err);
          }
          resolve(server);
        });

        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            this.fear.getLogger().error(`Port ${port} is already in use`);
          } else {
            this.fear.getLogger().error('Server error:', err);
          }
          reject(err);
        });
      });
    },

    /**
     * Start HTTPS server
     * @private
     */
    async _startHttpsServer() {
      const logger = this.fear.getLogger();
      const httpsPort = this.httpsConfig.httpsPort;

      let httpsServer;
      httpsServer = this._createManualHttpsServer();

      logger.info('Starting HTTPS server ...');
      return new Promise((resolve, reject) => {
        httpsServer.listen(httpsPort, (err) => {
          if (err) {
            logger.error(`Failed to start HTTPS server on port ${httpsPort}:`, err);
            return reject(err);
          }

          logger.info(`HTTPS server running on port ${httpsPort}`);
          resolve(httpsServer);
        });

        // Setup HTTP redirect server if enabled
        if (this.httpsConfig.redirectHttp) {
          const httpRedirectPort = this.fear.getApp().get("PORT") || DEFAULT_PORT;
          this.httpRedirectServer = this._createRedirectServer(httpsPort);

          this.httpRedirectServer.listen(httpRedirectPort, () => {
            logger.info(`HTTP redirect server running on port ${httpRedirectPort} → HTTPS`);
          });
        }

        httpsServer.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            logger.error(`Port ${httpsPort} is already in use`);
          } else {
            logger.error('HTTPS server error:', err);
          }
          reject(err);
        });
      });
    },

    /**
     * Perform graceful shutdown
     */
    gracefulShutdown(signal) {
      if (this.isShuttingDown) {
        this.fear.getLogger().warn('Shutdown already in progress...');
        return Promise.resolve();
      }

      this.isShuttingDown = true;
      this.fear.getLogger().info(`Graceful shutdown initiated by: ${signal}`);

      // Force shutdown after timeout
      const forceShutdownTimeout = setTimeout(() => {
        this.fear.getLogger().error('Forced shutdown after timeout');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT);

      // Close all server connections
      const closePromises = [];

      if (this.server) {
        closePromises.push(new Promise((resolve) => this.server.close(resolve)));
      }

      if (this.httpsServer) {
        closePromises.push(new Promise((resolve) => this.httpsServer.close(resolve)));
      }

      if (this.httpRedirectServer) {
        closePromises.push(new Promise((resolve) => this.httpRedirectServer.close(resolve)));
      }

      return Promise.all(closePromises)
        .then(() => {
          // Shutdown FEAR application
          if (this.fear && typeof this.fear.shutdown === 'function') {
            return this.fear.shutdown();
          }
        })
        .then(() => {
          clearTimeout(forceShutdownTimeout);
          this.fear.getLogger().info('Graceful shutdown completed');
          process.exit(0);
        })
        .catch((error) => {
          this.fear.getLogger().error('Error during shutdown:', error);
          process.exit(1);
        });
    },

    /**
     * Initialize FEAR application
     * @param {Object} paths - Path configuration
     * @param {boolean} ADD_PAYMENTS - Whether to add payment routes
     * @param {Object} reactConfig - Additional React configuration
     * @param {string|Object} envConfig - Environment file configuration
     */
    initialize(paths = DEFAULT_PATHS, ADD_PAYMENTS = false, reactConfig = {}, envConfig = null) {
      try {
        this.rootDir = paths.root || path.resolve();
        
        if (envConfig) {
          this.loadEnv(envConfig);
        } else if (!this.envLoaded) {
          this.loadEnv();
        }

        // Import FEAR after dotenv is configured
        const FearFactory = require("./FEAR");
        this.fear = new FearFactory({ADD_PAYMENTS});
        this.Router = this.fear.Router;

        // Setup CORS if enabled
        if (reactConfig.enableCORS) {
          this.setupCORS(reactConfig.corsOptions);
        }

        // Setup API prefix if provided
        if (reactConfig.apiPrefix) {
          this.setupAPIPrefix(reactConfig.apiPrefix);
        }

        // Setup React app(s)
        if (reactConfig.multipleApps && Array.isArray(reactConfig.apps)) {
          this.setupMultipleReactApps(reactConfig.apps);
        } else {
          this.setupStaticFiles(paths.root, paths.app, paths.build, paths.basePath);
        }

        this.setupProcessHandlers();

        return Promise.resolve(this.fear);
      } catch (error) {
        console.error('Failed to initialize FEAR application:', error);
        process.exit(1);
      }
    },

    startServer() {
      const port = this.fear.getApp().get("PORT") || DEFAULT_PORT;
      const logger = this.fear.getLogger();

      // Display logo
      if (this.fear.logo) {
        logger.warn(this.fear.logo);
      }

      logger.info('Starting FEAR Server...');
      logger.info('═══════════════════════════════════════');

      // Initialize database connection
      return this.initializeDatabase()
        .then(() => {
          // Start HTTPS if configured, otherwise HTTP
          if (this.httpsConfig) {
            return this._startHttpsServer();
          } else {
            return this._startHttpServer(port);
          }
        })
        .then((server) => {
          if (this.httpsConfig) {
            this.httpsServer = server;
          } else {
            this.server = server;
          }

          logger.info('═══════════════════════════════════════');
          
          if (this.httpsConfig) {
            logger.info(`🔒 FEAR API Server Running on HTTPS Port ${this.httpsConfig.httpsPort}`);

            if (this.httpsConfig.redirectHttp) {
              logger.info(`↪️  HTTP → HTTPS redirect enabled`);
            }
          } else {
            logger.info(`FEAR API Server Running on HTTP Port ${port}`);
          }

          logger.info('═══════════════════════════════════════');
          
          // Display registered React apps
          if (this.reactApps.length > 0) {
            logger.info('📱 React Apps:');
            const protocol = this.httpsConfig ? 'https' : 'http';
            const displayPort = this.httpsConfig ? this.httpsConfig.httpsPort : port;
            const portDisplay = (protocol === 'https' && displayPort === 443) || 
                               (protocol === 'http' && displayPort === 80) 
                               ? '' : `:${displayPort}`;
            
            this.reactApps.forEach(app => {
              const host = this.httpsConfig?.domain || 'localhost';
              logger.info(`• ${protocol}://${host}${portDisplay}${app.basePath}`);
            });
            logger.info('═══════════════════════════════════════');
          }

          return server;
        })
        .catch((error) => {
          logger.error('Failed to start server:', error);
          throw error;
        });
    },

    /**
     * Get logger instance
     */
    getLogger() {
      return this.fear ? this.fear.getLogger() : null;
    },

    /**
     * Get FEAR instance
     */
    getFear() {
      return this.fear;
    },

    /**
     * Get HTTP server instance
     */
    getServer() {
      return this.server;
    },

    /**
     * Get HTTPS server instance
     */
    getHttpsServer() {
      return this.httpsServer;
    },

    /**
     * Get HTTP redirect server instance
     */
    getHttpRedirectServer() {
      return this.httpRedirectServer;
    },

    /**
     * Get Router instance
     */
    getRouter() {
      return this.Router;
    },

    /**
     * Check if server is shutting down
     */
    getIsShuttingDown() {
      return this.isShuttingDown;
    },

    /**
     * Get root directory path
     */
    getRootDir() {
      return this.rootDir;
    },

    /**
     * Get registered React apps
     */
    getReactApps() {
      return this.reactApps;
    },

    /**
     * Check if environment variables are loaded
     */
    isEnvLoaded() {
      return this.envLoaded;
    },

    /**
     * Get HTTPS configuration
     */
    getHttpsConfig() {
      return this.httpsConfig;
    },

    /**
     * Check if HTTPS is enabled
     */
    isHttpsEnabled() {
      return !!this.httpsConfig;
    }
  };

  return FearServer;

})();

module.exports = FearServer;