const path = require('path');
const FearServer = require('../../backend/src/FEARServer');

async function main() {
  const server = new FearServer();
  console.log('🚀 Starting Simple HTTPS Server with Manual SSL \n');
 
  server.initialize({
    root: path.resolve(),
    app: 'build',
    build: 'build'
  }, true)
  .then(() => {
    if (process.env.NODE_ENV !== 'development' && process.env.HTTPS_ENABLED) {
      // Setup HTTPS configuration
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

    return server.startServer();
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'development' && process.env.HTTPS_ENABLED) {
      console.log('\nYour site is now available at:');
      console.log(`   https://${process.env.DOMAIN || 'efear.store'}\n`);
    }
  })
  .catch((error) => {
    console.error('Error during server initialization or startup:', error);
    process.exit(1);
  });
}

// Start the server
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});