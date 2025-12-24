const Fear = require("@feardread/fear");
const FearServer = require('./src/FEARServer');

// Main execution
async function main() {
  const server = (process.argv['dev']) ? new FearServer() : new Fear.FearServer();

  server.initialize()
        .then(() => server.startServer())
        .catch((error) => {
          console.error('Failed to start application:', error);
          process.exit(1);
        });
}

// Handle top-level errors
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
