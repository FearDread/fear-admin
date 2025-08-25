#!/usr/bin/env node

const path = require('path');
const express = require('express');
require("dotenv").config();

class ServerManager {
  constructor() {
    this.fearApp = null;
    this.server = null;
    this.isShuttingDown = false;
    this.rootDir = path.resolve();
  }

  async initialize() {
    try {
      // Import FEAR after dotenv is configured
      const createFearApp = require("./src/FEAR_class");
      this.fearApp = createFearApp();
      
      this.setupStaticFiles();
      this.setupProcessHandlers();
      
      return this.fearApp;
    } catch (error) {
      console.error('Failed to initialize FEAR application:', error);
      process.exit(1);
    }
  }

  setupStaticFiles() {
    const buildPath = path.join(this.rootDir, "backend", "dashboard", "build");
    const indexPath = path.resolve(this.rootDir, "backend", "dashboard", "build", "index.html");

    // Serve static files from React build
    this.fearApp.getApp().use(express.static(buildPath));
    
    // Catch-all handler: send back React's index.html file for SPA routing
    this.fearApp.getApp().get("*", (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          this.fearApp.getLogger().error('Error serving index.html:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    });
  }

  setupProcessHandlers() {
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      this.fearApp.getLogger().error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      this.fearApp.getLogger().error('Uncaught Exception:', err);
      this.gracefulShutdown('uncaughtException');
    });

    // Handle process termination signals
    process.on('SIGTERM', () => {
      this.fearApp.getLogger().info('SIGTERM received, starting graceful shutdown');
      this.gracefulShutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
      this.fearApp.getLogger().info('SIGINT received, starting graceful shutdown');
      this.gracefulShutdown('SIGINT');
    });
  }

  async startServer() {
    try {
      const port = this.fearApp.getApp().get("PORT") || 4000;
      
      // Display logo
      if (this.fearApp.logo) {
        this.fearApp.getLogger().warn(this.fearApp.logo);
      }

      // Initialize database connection
      await this.initializeDatabase();

      // Start the HTTP server
      this.server = await this.startHttpServer(port);
      
      this.fearApp.getLogger().info(`FEAR API Initialized :: Port ${port}`);
      return this.server;

    } catch (error) {
      this.fearApp.getLogger().error('Failed to start server:', error);
      throw error;
    }
  }

  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      try {
        this.fearApp.getDatabase().connect(this.fearApp.getEnvironment(), (err) => {
          if (err) {
            this.fearApp.getLogger().error('Database initialization failed:', err);
            reject(err);
          } else {
            this.fearApp.getLogger().info('Database initialized successfully');
            resolve();
          }
        });
      } catch (error) {
        this.fearApp.getLogger().error('Database setup error:', error);
        reject(error);
      }
    });
  }

  async startHttpServer(port) {
    return new Promise((resolve, reject) => {
      const server = this.fearApp.getApp().listen(port, (err) => {
        if (err) {
          this.fearApp.getLogger().error(`Failed to start server on port ${port}:`, err);
          reject(err);
        } else {
          resolve(server);
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          this.fearApp.getLogger().error(`Port ${port} is already in use`);
        } else {
          this.fearApp.getLogger().error('Server error:', err);
        }
        reject(err);
      });
    });
  }

  async gracefulShutdown(signal) {
    if (this.isShuttingDown) {
      this.fearApp.getLogger().warn('Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    this.fearApp.getLogger().info(`Graceful shutdown initiated by: ${signal}`);

    try {
      // Set a timeout for forceful shutdown
      const forceShutdownTimeout = setTimeout(() => {
        this.fearApp.getLogger().error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000); // 10 seconds

      // Perform graceful shutdown
      if (this.fearApp && typeof this.fearApp.shutdown === 'function') {
        await this.fearApp.shutdown();
      }

      clearTimeout(forceShutdownTimeout);
      this.fearApp.getLogger().info('Graceful shutdown completed');
      process.exit(0);

    } catch (error) {
      this.fearApp.getLogger().error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const serverManager = new ServerManager();
  
  try {
    await serverManager.initialize();
    await serverManager.startServer();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle top-level errors
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});

module.exports = ServerManager;