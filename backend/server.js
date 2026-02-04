#!/usr/bin/env node
const path = require('path');
const FearServer = require('./src/FEARServer');

async function main() {
  const server = new FearServer();

  try {
    // Initialize with environment variables
    await server.initialize(
      {
        root: path.resolve(),
        app: 'backend/admin/build',
        build: 'backend/admin/build'
      },
      true, // ADD_PAYMENTS
      {
        enableCORS: true,
        corsOptions: {
          origin: 'https://fear.dedyn.io',
          credentials: true
        }
      },
      '.env' // Load environment variables
    );

    // Setup HTTPS with Greenlock
    server.setupHTTPS({
      mode: 'greenlock',
      domain: 'fear.dedyn.io',
      email: 'ghaptonstall@gmail.com',
      httpsPort: 443,
      redirectHttp: true,
      staging: process.env.NODE_ENV !== 'production',
      altnames: ['www.fear.dedyn.io', 'fear.dedyn.io']
    });

    // Start the server
    await server.startServer();

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();