const path = require('path');
const FearServer = require('../../backend/src/FEARServer');


//TODO: add login command to pass auth credintials via agent terminal.

function main() {
    const server = new FearServer();

    return server.initialize({
        root: path.resolve(__dirname),
        app: 'build',
        build: 'build',
    })
        .then(() => server.startServer())
        .then(() => server.fear.getLogger().warn('AI Agent Server Running.'))
        .catch((error) => { process.exit(1); });
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
