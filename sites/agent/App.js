const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();
    const port = 4001;

    server.initialize({
            root: __dirname,
            app: '/public',
            build: 'public'
        }, port)
        .then(() => { server.startServer().catch(err => process.exit(1));})
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
