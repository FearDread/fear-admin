const Fear = require('@feardread/fear');

async function main() {
    const server = new Fear.FearServer();

     server.initialize({
        root: __dirname,
        app: '/public',
        build: 'public',
        basePath: ''
    })
    .then(() => {
        server.startServer()
            .then(() => server.getLogger().info('Started GDrea FearServer !'))
            .catch((error) => {
                server.getLogger().error('Failed to start application:', error);

                process.exit(1);
            })
    });


}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
