const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const env = process.env.NODE_ENV;
    const server = (env === 'development') ? new FearServer() : new Fear.FearServer();

    
    server.initialize({
            root: __dirname,
            app: '/public',
            build: 'public',
            basePath: '/fear/backend/admin'
        })
        .then(() => server.startServer())
        .catch((error) => process.exit(1))
}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});