const { FearServer, Fear } = require('@feardread/fear');

async function main() {
const env = process.env.NODE_ENV;
console.log('env = ', env);
  const server = (env === 'development') ? new FearServer() : new Fear.FearServer();

    
    server.initialize({
            root: __dirname,
            app: '/public',
            build: 'build',
            basePath: '/admin'
        })
        .then(() => server.startServer())
        .catch((error) => process.exit(1))
}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});