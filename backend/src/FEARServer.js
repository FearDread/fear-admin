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
    setupHTTPS(config) {
      if (!config || typeof config !== 'object') {
        throw new Error('HTTPS configuration is required');
      }

      this.httpsConfig = {
        mode: config.mode || 'greenlock',
        httpsPort: config.httpsPort || DEFAULT_HTTPS_PORT,
        redirectHttp: config.redirectHttp !== false,
        ...config
      };

      if (this.httpsConfig.mode === 'greenlock') {
        this._setupGreenlock();
      } else if (this.httpsConfig.mode === 'auto-encrypt') {
        this._setupAutoEncrypt();
      } else if (this.httpsConfig.mode === 'manual') {
        this._validateManualCerts();
      } else {
        throw new Error('HTTPS mode must be "greenlock", "auto-encrypt", or "manual"');
      }

      if (this.fear && this.fear.getLogger()) {
        this.fear.getLogger().info('HTTPS configuration loaded successfully');
      }
    },

    /**
     * Setup Greenlock for automatic SSL certificates
     * @private
     */
    _setupGreenlock() {
      const config = this.httpsConfig;

      if (!config.domain) {
        throw new Error('Domain name is required for Greenlock mode');
      }

      if (!config.email) {
        throw new Error('Email address is required for Greenlock mode');
      }

      try {
        // Greenlock Express uses a different pattern
        // We don't initialize it here, we do it when starting the server
        this.greenlockConfig = {
          packageRoot: this.rootDir,
          configDir: config.configDir || path.join(this.rootDir, 'greenlock.d'),
          maintainerEmail: config.email,
          cluster: false,
          staging: config.staging || false,
          domain: config.domain,
          altnames: config.altnames || [config.domain]
        };

        // Ensure config directory exists
        const configDir = this.greenlockConfig.configDir;
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }

        if (this.fear && this.fear.getLogger()) {
          this.fear.getLogger().info(`Greenlock configured for domain: ${config.domain}`);
          this.fear.getLogger().info(`Staging mode: ${config.staging ? 'enabled' : 'disabled'}`);
        }
      } catch (error) {
        console.error('Error setting up Greenlock:', error);
        throw new Error('Failed to setup Greenlock. Make sure @root/greenlock-express is installed: npm install @root/greenlock-express');
      }
    },

    /**
     * Setup Auto Encrypt for automatic SSL certificates
     * @private
     */
    _setupAutoEncrypt() {
      const config = this.httpsConfig;

      if (!config.domain) {
        throw new Error('Domain name is required for Auto Encrypt mode');
      }

      try {
        const AutoEncrypt = require('@small-tech/auto-encrypt');
        
        const settingsPath = config.settingsPath || path.join(this.rootDir, '.small-tech.org');
        
        // Auto Encrypt doesn't need separate initialization
        // It's used directly when creating the HTTPS server
        this.autoEncryptOptions = {
          domains: [config.domain],
          settingsPath: settingsPath
        };

        // Store staging mode for server creation
        if (config.staging) {
          this.autoEncryptOptions.staging = true;
        }

        if (this.fear && this.fear.getLogger()) {
          this.fear.getLogger().info(`Auto Encrypt configured for domain: ${config.domain}`);
          this.fear.getLogger().info(`Staging mode: ${config.staging ? 'enabled' : 'disabled'}`);
          this.fear.getLogger().info(`Settings path: ${settingsPath}`);
        }
      } catch (error) {
        console.error('Error setting up Auto Encrypt:', error);
        throw new Error('Failed to setup Auto Encrypt. Make sure @small-tech/auto-encrypt is installed: npm install @small-tech/auto-encrypt');
      }
    },

    /**
     * Validate manual SSL certificates
     * @private
     */
    _validateManualCerts() {
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
    },

    /**
     * Create HTTPS server with manual certificates
     * @private
     */
    _createManualHttpsServer() {
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

    /**
     * Create HTTP to HTTPS redirect server
     * @private
     */
    _createHttpRedirectServer(httpsPort) {
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

    /**
     * Setup process signal handlers for graceful shutdown
     */
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
     * Start HTTPS server
     * @private
     */
    async _startHttpsServer() {
      const logger = this.fear.getLogger();
      const httpsPort = this.httpsConfig.httpsPort;
      
      let httpsServer;

      if (this.httpsConfig.mode === 'greenlock') {
       logger.info('Starting HTTPS server with Greenlock auto-encryption...');
        
        const greenlockExpress = require('@root/greenlock-express');
        
        // Initialize Greenlock
        const greenlock = greenlockExpress.init({
          packageRoot: this.greenlockConfig.packageRoot,
          configDir: this.greenlockConfig.configDir,
          maintainerEmail: this.greenlockConfig.maintainerEmail,
          cluster: this.greenlockConfig.cluster,
          staging: this.greenlockConfig.staging
        });

        return new Promise((resolve, reject) => {
          // Use Greenlock's ready callback to configure and start
          greenlock.ready((glx) => {
            console.log('greenlock = ', greenlock);
            console.log('this.greenlock = ', this.greenlock)
            console.log('manager = ', glx);
            // Add the site/domain configuration
            glx.manager.add({
              subject: this.greenlockConfig.domain,
              altnames: this.greenlockConfig.altnames
            }).then(() => {
              logger.info(`Domain ${this.greenlockConfig.domain} added to Greenlock`);
            }).catch((err) => {
              logger.warn('Could not add domain (may already exist):', err.message);
            });

            // Serve the app with Greenlock
            // Greenlock manages both HTTP (port 80) and HTTPS (port 443)
            glx.serve(this.fear.getApp());
            
            logger.info(`HTTPS server running on port ${httpsPort} with Greenlock`);
            logger.info(`HTTP server running on port 80 (managed by Greenlock)`);
            
            // Store reference (though Greenlock manages the actual servers)
            httpsServer = { greenlockManaged: true, greenlock: glx };
            this.greenlock = glx;
            
            resolve(httpsServer);
          });
        });
      } else if (this.httpsConfig.mode === 'auto-encrypt') {
        // Auto Encrypt mode
        logger.info('Starting HTTPS server with Auto Encrypt...');
        
        const AutoEncrypt = require('@small-tech/auto-encrypt');
        
        // Auto Encrypt.https.createServer expects domain(s) and returns a configured server
        const options = {
          domains: [this.httpsConfig.domain]
        };

        if (this.httpsConfig.staging) {
          options.staging = true;
        }

        if (this.autoEncryptOptions && this.autoEncryptOptions.settingsPath) {
          options.settingsPath = this.autoEncryptOptions.settingsPath;
        }
        
        // Create HTTPS server with Auto Encrypt
        try {
          httpsServer = await AutoEncrypt.https.createServer(options);
          
          // Add Express app as request handler
          httpsServer.on('request', this.fear.getApp());
          
          return new Promise((resolve, reject) => {
            httpsServer.listen(httpsPort, (err) => {
              if (err) {
                logger.error(`Failed to start HTTPS server on port ${httpsPort}:`, err);
                return reject(err);
              }
              
              logger.info(`HTTPS server running on port ${httpsPort} with Auto Encrypt`);
              resolve(httpsServer);
            });

            // Setup HTTP redirect server if enabled
            if (this.httpsConfig.redirectHttp) {
              const httpRedirectPort = this.fear.getApp().get("PORT") || DEFAULT_PORT;
              this.httpRedirectServer = this._createHttpRedirectServer(httpsPort);
              
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
        } catch (error) {
          logger.error('Failed to create Auto Encrypt server:', error);
          throw error;
        }

      } else if (this.httpsConfig.mode === 'manual') {
        // Manual certificate mode
        logger.info('Starting HTTPS server with manual certificates...');
        
        httpsServer = this._createManualHttpsServer();

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
            this.httpRedirectServer = this._createHttpRedirectServer(httpsPort);
            
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
      }
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
     * Start the server (HTTP or HTTPS based on configuration)
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
          // Start HTTPS if configured, otherwise HTTP
          if (this.httpsConfig) {
            return this._startHttpsServer();
          } else {
            return this.startHttpServer(port);
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
            
            if (this.httpsConfig.mode === 'greenlock') {
              logger.info(`🔐 Auto-encryption: ENABLED (Greenlock/Let's Encrypt)`);
              logger.info(`📧 Domain: ${this.httpsConfig.domain}`);
              logger.info(`📧 Email: ${this.httpsConfig.email}`);
            } else if (this.httpsConfig.mode === 'auto-encrypt') {
              logger.info(`🔐 Auto-encryption: ENABLED (Auto Encrypt/Let's Encrypt)`);
              logger.info(`📧 Domain: ${this.httpsConfig.domain}`);
            } else {
              logger.info(`🔐 Manual SSL certificates loaded`);
            }

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