const Fear = require('@feardread/fear');
const path = require('path');

async function main() {
    const server = new Fear.FearServer();

    server.initialize({
            root: path.resolve(),
            app: 'build',
            build: 'build',
        })
        .then(() => server.startServer())
        .then(() => server.fear.getLogger().warn('AI Agent Server Running.'))
        .catch((error) => { process.exit(1);});
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
