const path = require('path');
const FearServer = require('../../backend/src/FEARServer');

function main() {
    const server = new FearServer({vchat: true});

    return server.initialize({
                root: path.resolve(),
                app: 'build',
                build: 'build'
        })
        .then(() => { server.startServer(); })
        .then(() => { server.fear.getLogger().warn('FEAR vchat signaling server running.'); });
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});