const Fear = require("@feardread/fear");

// Main execution
async function main() {
  const server = new Fear.FearServer();

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
