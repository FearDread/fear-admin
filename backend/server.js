#!/usr/bin/env node

/**
 * Simple FEAR Server with Auto Encrypt
 * 
 * This is the simplest way to get HTTPS running with FEAR Server.
 * Perfect for single-domain applications.
 */

const path = require('path');
const FearServer = require('./src/FEARServer');

function main() {
  const server = new FearServer();
  console.log('🚀 Starting Simple HTTPS Server with Auto Encrypt\n');
  server.initialize({
    root: path.resolve(),
    app: 'backend/admin/build',
    build: 'backend/admin/build'
  }, true
  )



  // 2. Setup HTTPS with Auto Encrypt (just 3 required settings!)

  server.setupHTTPS({
    mode: process.env.HTTPS_MODE || 'auto-encrypt',
    domain: process.env.HTTPS_DOMAIN || 'fear.dedyn.io',
    email: process.env.HTTPS_EMAIL || "ghaptonstall@gmail.com",
    staging: process.env.NODE_ENV !== 'production'
  });

  // 3. Start!
  Promise.resolve(server.startServer())
    .then(() => {
      console.log('\n✅ Server started successfully!');
      console.log('\nYour site is now available at:');
      console.log(`   https://${process.env.DOMAIN || 'yourdomain.com'}\n`);
      console.log('Press CTRL+C to stop the server.\n');
    })
    .catch((error) => {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    });
}

// Start the server
main();