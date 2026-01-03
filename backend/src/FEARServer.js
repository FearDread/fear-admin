#!/usr/bin/env node

const path = require('path');
const express = require('express');
require("dotenv").config();

const FearServer = (function () {
  // Private constants
  const DEFAULT_PATHS = {
    root: path.resolve(),
    app: '/backend/dashboard/build',
    build: 'backend/dashboard/build'
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
  }

  FearServer.prototype = {
    constructor: FearServer,

    /**
     * Configure static file serving for React SPA
     * @param {string} root - Root directory path
     * @param {string} app - App directory path
     * @param {string} build - Build directory path
     * @param {string} basePath - Base path for the app (e.g., '/fear/sites/ghap')
     */
    setupStaticFiles(root, app, build, basePath = '') {
      this.rootDir = root || path.resolve();
      const buildPath = path.join(this.rootDir, app);
      const indexPath = path.resolve(this.rootDir, build, "index.html");

      const normalizedBasePath = basePath
        ? `/${basePath.replace(/^\/+|\/+$/g, '')}`
        : '';

        
      this.fear.getLogger().info(`Serving static files from: ${buildPath}`);
      this.fear.getLogger().info(`Base URL path: ${normalizedBasePath || '/'}`);

      this.fear.getApp().use(
        normalizedBasePath,
        express.static(buildPath, {
          index: false,
          fallthrough: true 
        })
      );

      this.fear.getApp().get(`${normalizedBasePath}/*`, (req, res) => {
        res.sendFile(indexPath, (err) => {
          if (err) {
            this.fear.getLogger().error('Error serving index.html:', err);
            res.status(500).send('Internal Server Error');
          }
        });
      });
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
     */
    initialize(paths = DEFAULT_PATHS) {
      try {
        // Import FEAR after dotenv is configured
        const FearFactory = require("./FEAR");
        this.fear = new FearFactory();
        this.Router = this.fear.Router;

        this.setupStaticFiles(paths.root, paths.app, paths.build, paths.basePath);
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

      // Initialize database connection
      return this.initializeDatabase()
        .then(() => {
          // Start the HTTP server
          return this.startHttpServer(port);
        })
        .then((server) => {
          this.server = server;
          logger.info(`FEAR API Initialized :: Port ${port}`);
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
    }
  };

  return FearServer;

})();

module.exports = FearServer;