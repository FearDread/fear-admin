const FearServer = require("./src/FEARServer");

// Main execution
async function main() {
  const server = new FearServer();
  
  try {
    
    await server.initialize();
    await server.startServer();
  
} catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle top-level errors
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});