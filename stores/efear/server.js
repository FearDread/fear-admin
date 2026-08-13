const path = require('path');
const FearServer = require('../../backend/src/FEARServer');
const Router = require('./router');

require('dotenv').config();

const BUILD_DIR = path.resolve(__dirname, 'build');
const PUB_DIR = path.resolve(__dirname, 'public');

async function main() {
  const server = new FearServer();
  
  server
  .initialize(
    true,
    { root: path.resolve() },
    { multipleApps: true, apps: [] })
  .then((fear) => {

    fear.ssr.attach(PUB_DIR, { streaming: true });
    Router.attach(fear, BUILD_DIR, {
      verbose: process.env.NODE_ENV !== 'production',
    });

    return server.startServer()
  })
  .then(() => {
    console.log('\nYour site is now available at:');
    console.log(`https://${process.env.HTTPS_DOMAIN || 'efear.store'}\n`);
  })
  .catch((error) => {
    console.error('Error during server initialization or startup:', error);
    process.exit(1);
  });
}

// Start the server
main().catch( error => process.exit(1));