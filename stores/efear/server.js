#!/usr/bin/env node

/**
 * Simple FEAR Server with Auto Encrypt
 * 
 * This is the simplest way to get HTTPS running with FEAR Server.
 * Perfect for single-domain applications.
 */

const path = require('path');
const FearServer = require('../../backend/src/FEARServer.js');

async function main() {
  console.log('efear path = ', path.resolve());
  const server =  new FearServer();
  console.log('🚀 Starting Simple HTTPS Server with Manual SSL \n');
  server.initialize({
    root: path.resolve(),
    app: 'stores/efear/build',
    build: 'stores/efear/build'
  }, true)

  if (process.env.NODE_ENV !== 'development') {
    server.setupHTTPS({
      mode: process.env.HTTPS_MODE || 'manual',
      domain: process.env.HTTPS_DOMAIN || 'efear.shop',
      email: process.env.HTTPS_EMAIL || "fear.dread@underworld.dog",
      staging: process.env.NODE_ENV !== 'production',
          certPath: path.join(path.resolve(), 'certificates', 'efear_shop.crt'),
          caPath: path.join(path.resolve(), 'certificates', 'efear_shop.ca-bundle'),
          keyPath: path.join(path.resolve(), 'certificates', 'efear.shop_key.txt'),
    });
  }
  server.startServer()
    .then(() => {
      console.log('\n✅ Server started successfully!');
      console.log('\nYour site is now available at:');
      console.log(`   https://${process.env.DOMAIN || 'efear.store'}\n`);
      console.log('Press CTRL+C to stop the server.\n');
    })
    .catch((error) => {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    });
}

// Start the server
main().catch(err => console.log('Error Starting Fear Server', err));