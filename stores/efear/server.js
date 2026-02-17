const path = require('path');
const FearServer = require('../../backend/src/FEARServer');
require('dotenv').config();

async function main() {
  const server = new FearServer();
  console.log('🚀 Starting Simple HTTPS Server with Manual SSL \n');
 
  server
  .initialize({ root: path.resolve(), app: 'build', build: 'build'}, true)
  .then(() => server.startServer())
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