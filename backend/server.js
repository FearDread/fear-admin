const path = require('path');
const FearServer = require('./src/FEARServer');

async function main() {
  const server = new FearServer();
  const dir = 'backend/admin/build';

  console.log('* Starting Express HTTP / HTTPS Server with FEAR-Server * \n');

  server
    .initialize({ root: path.resolve(), app: dir, build: dir }, false)
    .then((fear) => {
      fear.ssr.attach(dir, {streaming: false})
      return server.startServer()
    })
    .then(() => console.log('\nServer started successfully!'))
    .catch((error) => {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    })
}

// Start the server
main().catch(err => process.exit(1));