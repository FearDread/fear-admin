
const FearServer = require('../../backend/src/FEARServer');
const FearSignal = require('../../libs/signal');
const path = require('path');

function main() {
    const server = new Fear.FearServer();

    server.initialize({
        root: path.resolve(),
        app: 'build',
        build: 'build',
     })
        .then(() => {
            const signal = new FearSignal(server.fear);

            server.fear.signal = signal;
            server.startServer()
        })
        .then(() => {
            signal.attach(server.getServer());
            server.fear.getLogger().warn('FEAR vchat signaling server running.');
        })
        .catch((err) => process.exit(1));
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});