const path = require('path');
const FearServer = require('./src/FEARServer');

function main() {
  const server = new FearServer();
  console.log('🚀 Starting Simple HTTPS Server with Auto Encrypt\n');
  server.initialize({
    root: path.resolve(),
    app: 'backend/admin/build',
    build: 'backend/admin/build'
  }, false)

  if (process.env.NODE_ENV === 'production' && proces.env.HTTPS_ENABLED) {
    server.setupHTTPS({
      mode: process.env.HTTPS_MODE || 'manual',
      domain: process.env.HTTPS_DOMAIN || 'fear.dedyn.io',
      email: process.env.HTTPS_EMAIL || "ghaptonstall@gmail.com",
      staging: process.env.NODE_ENV !== 'production',
          certPath: path.join(path.resolve(), 'certificates', 'fear.dedyn.io.crt'),
          caPath: path.join(path.resolve(), 'certificates', 'fear.dedyn.io.ca-bundle'),
          keyPath: path.join(path.resolve(), 'certificates', 'fear.dedyn.io.key.txt'),
    });
  }

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