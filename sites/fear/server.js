const path = require('path');
const FearServer = require('../../backend/src/FEARServer');
function main() {
    const server = new FearServer();
    return server.initialize({ root: path.resolve(__dirname), app: 'build', build: 'build' })
        .then(() => server.startServer())
        .then(() => {
            server.fear.getLogger().warn('Garrett Haptonstall Resume SPA Initialized');
            let stopping = false;
            const stop = (signal) => {
                if (stopping) return; stopping = true;
                server.fear.getLogger().warn(`${signal} received, shutting down`);
                setTimeout(() => process.exit(1), 8000).unref();
                Promise.resolve(server.fear.shutdown()).finally(() => process.exit(0));
            };
            ['SIGINT', 'SIGTERM'].forEach((signal) => process.on(signal, () => stop(signal)));
        });
}
main().catch((error) => { console.error('Unhandled error in main:', error); process.exit(1); });
