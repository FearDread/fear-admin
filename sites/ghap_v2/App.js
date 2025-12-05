const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();
    
    server.initialize({
            root: __dirname,
            app: '/public',
            build: 'public',
            basePath: '/fear/sites/ghap'
        })
        .then(() => server.startServer())
        .catch((error) => process.exit(1))
}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
