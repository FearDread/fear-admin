const FearServer = require('../../backend/src/FEARServer');
const FearSignal = require('../../backend/src/libs/signal');
const { authenticateSocket } = require('../../backend/src/controllers/auth/vchat');
const path = require('path');

function main() {
    const server = new FearServer();
    let signal;

    return server.initialize({
        root: path.resolve(),
        app: 'build',
        build: 'build',
    })
        .then(() => {
            signal = new FearSignal(server.fear, { authenticate: authenticateSocket });
            server.fear.signal = signal;

            return server.startServer();
        })
        .then(() => {
            signal.attach(server.getServer());
            server.fear.getLogger().warn('FEAR vchat signaling server running.');
        });
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});