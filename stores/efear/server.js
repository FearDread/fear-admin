const path = require('path');
const FearSSR = require('../../backend/src/FEARSSR');
const FearServer = require('../../backend/src/FEARServer');
const Router = require('./router');

require('dotenv').config();

const BUILD_DIR = path.resolve(__dirname, 'build');
const PUB_DIR = path.resolve(__dirname, 'public');

async function main() {
  const server = new FearServer();
  
  server
  .initialize(
    { root: path.resolve() }, true,
    { multipleApps: true, apps: [] })
  .then((fear) => {

    FearSSR.attach(fear, PUB_DIR, {
      streaming: true,  // false = buffer full HTML before sending (safer for some CDNs)
    });
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