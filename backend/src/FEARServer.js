#!/usr/bin/env node

const path = require('path');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');

const FearServer = (function () {
  // Private constants
  const DEFAULT_PATHS = {
    root: path.resolve(),
    app: 'backend/admin/build', 
    build: 'backend/admin/build'
  };

  const DEFAULT_PORT = 4000;
  const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

  // Constructor
  function FearServer() {
    this.fear = null;
    this.server = null;
    this.Router = null;
    this.isShuttingDown = false;
    this.rootDir = path.resolve();
    this.reactApps = []; // Track multiple React apps
    this.envLoaded = false;
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
          maxAge: '1h', // Cache static assets
          etag: true,
          lastModified: true,
          setHeaders: (res, filePath) => {
            // Don't cache index.html
            if (filePath.endsWith('index.html')) {
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            }
            // Cache JS/CSS files aggressively
            else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
          }
        })
      );

      this.fear.getApp().get(`${normalizedBasePath}/*`, (req, res, next) => {
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
        res.header('Access-Control-Allow-Origin', defaultOptions.origin);
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
     * Setup API routes prefix (useful to avoid conflicts with React routes)
     * @param {string} prefix - API prefix (e.g., '/api')
     */
    setupAPIPrefix(prefix = '/fear/api') {
      const normalizedPrefix = `/${prefix.replace(/^\/+|\/+$/g, '')}`;
      
      this.fear.getApp().use(normalizedPrefix, (req, res, next) => {

        req.isAPIRoute = true;
        next();
      });

      this.fear.getLogger().info(`API routes configured with prefix: ${normalizedPrefix}`);
      return normalizedPrefix;
    },

    /**
     * Setup process event handlers for graceful shutdown
     */
    setupProcessHandlers() {
      // Handle unhandled promise rejections
      process.on("unhandledRejection", (reason, promise) => {
        console.log('Unhandled Rejection at:', promise);
        this.fear.getLogger().error('Unhandled Rejection at:', promise, 'reason:', reason);
        this.gracefulShutdown('unhandledRejection');
      });

      // Handle uncaught exceptions
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
    startHttpServer(port) {
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

      // Close server connections
      const closeServerPromise = this.server
        ? new Promise((resolve) => this.server.close(resolve))
        : Promise.resolve();

      return closeServerPromise
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
        // Set root directory first
        this.rootDir = paths.root || path.resolve();

        // Load environment variables if config provided
        if (envConfig) {
          this.loadEnv(envConfig);
        } else if (!this.envLoaded) {
          // Try auto-loading if not already loaded
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

    /**
     * Start the server
     */
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
          // Start the HTTP server
          return this.startHttpServer(port);
        })
        .then((server) => {
          this.server = server;
          logger.info('═══════════════════════════════════════');
          logger.info(`FEAR API Server Running on Port ${port}`);
          logger.info('═══════════════════════════════════════');
          
          // Display registered React apps
          if (this.reactApps.length > 0) {
            logger.info('📱 React Apps:');
            this.reactApps.forEach(app => {
              logger.info(`• http://localhost:${port}${app.basePath}`);
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
    }
  };

  return FearServer;

})();

module.exports = FearServer;