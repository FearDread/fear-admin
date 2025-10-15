#!/usr/bin/env node

const path = require('path');
const express = require('express');
require("dotenv").config();

const FearServer = (function() {
  // Private constants in closure scope
  const defaultPaths = {
    root: path.resolve(),
    app: '/backend/dashboard/build',
    build: 'backend/dashboard/build'
  };

  const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

  // Constructor function
  function FearServer() {
    this.fear = null;
    this.server = null;
    this.Router = null;
    this.isShuttingDown = false;
    this.rootDir = path.resolve();
  }

  // Private methods on prototype
  FearServer.prototype.setupStaticFiles = function(root, app, build) {
    this.rootDir = root || path.resolve();

    const buildPath = path.join(this.rootDir, app);
    const indexPath = path.resolve(this.rootDir, build, "index.html");

    // Serve static files from React build
    this.fear.getApp().use(express.static(buildPath));
    
    // Catch-all handler: send back React's index.html file for SPA routing
    this.fear.getApp().get("*", (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          this.fear.getLogger().error('Error serving index.html:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    });
  };

  FearServer.prototype.setupProcessHandlers = function() {
    const self = this;

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.log(reason);
      self.fear.getLogger().error('Unhandled Rejection at:', promise, 'reason:', reason);
      self.gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      self.fear.getLogger().error('Uncaught Exception:', err);
      self.gracefulShutdown('uncaughtException');
    });

    // Handle process termination signals
    process.on('SIGTERM', () => {
      self.fear.getLogger().info('SIGTERM received, starting graceful shutdown');
      self.gracefulShutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
      self.fear.getLogger().info('SIGINT received, starting graceful shutdown');
      self.gracefulShutdown('SIGINT');
    });
  };

  FearServer.prototype.initializeDatabase = function() {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.fear.getDatabase().connect(self.fear.getEnvironment(), (err) => {
          if (err) {
            self.fear.getLogger().error('Database initialization failed:', err);
            reject(err);
          } else {
            self.fear.getLogger().info('Database initialized successfully');
            resolve();
          }
        });
      } catch (error) {
        self.fear.getLogger().error('Database setup error:', error);
        reject(error);
      }
    });
  };

  FearServer.prototype.startHttpServer = function(port) {
    const self = this;
    return new Promise((resolve, reject) => {
      const server = self.fear.getApp().listen(port, (err) => {
        if (err) {
          self.fear.getLogger().error(`Failed to start server on port ${port}:`, err);
          reject(err);
        } else {
          resolve(server);
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          self.fear.getLogger().error(`Port ${port} is already in use`);
        } else {
          self.fear.getLogger().error('Server error:', err);
        }
        reject(err);
      });
    });
  };

  FearServer.prototype.gracefulShutdown = async function(signal) {
    if (this.isShuttingDown) {
      this.fear.getLogger().warn('Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    this.fear.getLogger().info(`Graceful shutdown initiated by: ${signal}`);

    try {
      // Set a timeout for forceful shutdown
      const forceShutdownTimeout = setTimeout(() => {
        this.fear.getLogger().error('Forced shutdown after timeout');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT);

      // Perform graceful shutdown
      if (this.fear && typeof this.fear.shutdown === 'function') {
        await this.fear.shutdown();
      }

      clearTimeout(forceShutdownTimeout);
      this.fear.getLogger().info('Graceful shutdown completed');
      process.exit(0);

    } catch (error) {
      this.fear.getLogger().error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Public methods
  FearServer.prototype.initialize = async function(paths = defaultPaths) {
    try {
      // Import FEAR after dotenv is configured
      const FearFactory = require("./FEAR");
      this.fear = new FearFactory();
      this.Router = this.fear.Router;
      
      this.setupStaticFiles(paths.root, paths.app, paths.build);
      this.setupProcessHandlers();
      
      return this.fear;
    } catch (error) {
      console.error('Failed to initialize FEAR application:', error);
      process.exit(1);
    }
  };

  FearServer.prototype.startServer = async function() {
    try {
      const port = this.fear.getApp().get("PORT") || 4000;
      
      // Display logo
      if (this.fear.logo) {
        this.fear.getLogger().warn(this.fear.logo);
      }

      // Initialize database connection
      await this.initializeDatabase();

      // Start the HTTP server
      this.server = await this.startHttpServer(port);
      
      this.fear.getLogger().info(`FEAR API Initialized :: Port ${port}`);
      return this.server;

    } catch (error) {
      this.fear.getLogger().error('Failed to start server:', error);
      throw error;
    }
  };

  FearServer.prototype.getLogger = function() {
    return this.fear.getLogger();
  }

  // Getter methods
  FearServer.prototype.getFear = function() {
    return this.fear;
  };

  FearServer.prototype.getServer = function() {
    return this.server;
  };

  FearServer.prototype.getRouter = function() {
    return this.Router;
  };

  FearServer.prototype.getIsShuttingDown = function() {
    return this.isShuttingDown;
  };

  FearServer.prototype.getRootDir = function() {
    return this.rootDir;
  };

  return FearServer;
})();

module.exports = FearServer;