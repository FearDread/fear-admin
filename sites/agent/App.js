const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();

    server.initialize({
            root: __dirname,
            app: '/build',
            build: 'public',
            basePath: ''
        })
        .then(() => { 
            server.startServer().catch(err => process.exit(1));
        })
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
