const path = require('path');
const FearServer = require('../../backend/src/FEARServer');

function main() {
    const server = new FearServer();

    return server.initialize({
        root: path.resolve(),
        app: 'build',
        build: 'build',
    })
        .then(() => server.startServer())
        .then(() => {
            server.fear.attachSignal(server.getServer());
            server.fear.getLogger().warn('FEAR vchat signaling server running.');

            // PM2 stops/reloads with SIGINT (SIGTERM from systemd/docker): close sockets and the
            // DB cleanly. Clients get a 1001 close; the hard exit is under PM2's kill_timeout.
            let stopping = false;

            const stop = (signal) => {
                if (stopping) return;
                stopping = true;

                server.fear.getLogger().warn(`${signal} received, shutting down`);

                setTimeout(() => process.exit(1), 8000).unref();
                Promise.resolve(server.fear.shutdown()).finally(() => process.exit(0));
            };
            ['SIGINT', 'SIGTERM'].forEach((signal) => process.on(signal, () => stop(signal)));
        });
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});