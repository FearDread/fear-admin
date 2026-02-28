const FearServer = require('../../backend/src/FEARServer');
const path = require('path');

async function main() {
    const server = new FearServer();
    
    server.initialize({
            root: path.resolve(), 
            app: 'public',
            build: 'public',
        })
        .then(() => server.startServer())
	    .then(() => server.getLogger().info('GHAP Server Running'))
        .catch((error) => process.exit(1))
}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
