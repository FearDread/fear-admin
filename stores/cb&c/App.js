const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();

    await server.initialize({
        root: __dirname,
        app: '/public',
        build: 'public'
    });

    await server.startServer()
        .then(() => {
            
            const debug = server.getLogger();
            
            debug.info('Started CB Store FearServer !');
        })
        .catch((error) => {
            debug.error('Failed to start application:', error);
            
            process.exit(1);
        })
}

// Handle top-level errors
main().catch((error) => {

    console.error('Unhandled error in main:', error);
    
    process.exit(1);
});
