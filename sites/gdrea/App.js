const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();

    try {

        await server.initialize({
            root: __dirname,
            app: '/public',
            build: 'public'
        });
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
