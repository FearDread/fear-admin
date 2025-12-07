const Fear = require('@feardread/fear');

async function main() {
    const server = new Fear.FearServer();

    server.initialize({
            root: __dirname,
            app: '/build',
            build: 'public',
            basePath: '/fear/agent'
        })
        .then(() => { 
		server.fear.getLogger().warn('Running Template script for AI Agent');
		server.startServer().catch((err) => { process.exit(1) })
	})
        .catch((error) => { process.exit(1);});
}

// Handle top-level errors
main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
