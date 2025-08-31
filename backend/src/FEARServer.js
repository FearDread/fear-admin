#!/usr/bin/env node

const path = require('path');
const express = require('express');
require("dotenv").config();

class FearServer {
  constructor() {
    this.fear = null;
    this.server = null;
    this.isShuttingDown = false;
    this.rootDir = path.resolve();
  }

  async initialize(paths = {
    root: this.rootDir,
    app: '/backend/dashboard/build',
    build: 'backend/dashboard/build'
  }) {
    try {
      // Import FEAR after dotenv is configured
      const createFearApp = require("./FEAR");
      this.fear = createFearApp();

      this.setupStaticFiles(paths.root, paths.app, paths.build);
      this.setupProcessHandlers();
      
      return this.fear;
    } catch (error) {
      console.error('Failed to initialize FEAR application:', error);
      process.exit(1);
    }
  }

  setupStaticFiles(root, app, build) {
    this.rootDir = (root) ? root : path.resolve();

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
  }

  setupProcessHandlers() {
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.log(reason);
      this.fear.getLogger().error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      this.fear.getLogger().error('Uncaught Exception:', err);
      this.gracefulShutdown('uncaughtException');
    });

    // Handle process termination signals
    process.on('SIGTERM', () => {
      this.fear.getLogger().info('SIGTERM received, starting graceful shutdown');
      this.gracefulShutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
      this.fear.getLogger().info('SIGINT received, starting graceful shutdown');
      this.gracefulShutdown('SIGINT');
    });
  }

  async startServer() {
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
  }

  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      try {
        this.fear.getDatabase().connect(this.fear.getEnvironment(), (err) => {
          if (err) {
            this.fear.getLogger().error('Database initialization failed:', err);
            reject(err);
          } else {
            this.fear.getLogger().info('Database initialized successfully');
            resolve();
          }
        });
      } catch (error) {
        this.fear.getLogger().error('Database setup error:', error);
        reject(error);
      }
    });
  }

  async startHttpServer(port) {
    return new Promise((resolve, reject) => {
      const server = this.fear.getApp().listen(port, (err) => {
        if (err) {
          this.fear.getLogger().error(`Failed to start server on port ${port}:`, err);
          reject(err);
        } else {
          resolve(server);
        }
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
  }

  async gracefulShutdown(signal) {
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
      }, 10000); // 10 seconds

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
  }
}

module.exports = FearServer;
