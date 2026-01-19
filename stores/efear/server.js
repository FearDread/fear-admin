const path = require('path');
const FearServer = require('../../backend/src/FEARServer');

async function main() {
    const server = new FearServer();
    
    // IMPORTANT: Use path.resolve to get absolute paths
    const projectRoot = path.resolve(__dirname);
    
    console.log('Project root:', projectRoot);
    console.log('Build directory should be at:', path.join(projectRoot, 'build'));
    console.log('env -= ', process.env);
    await server.initialize(
        {
            root: projectRoot,
            app: 'build',        // Changed from '/build' to 'build'
            build: 'build',      // Path to where index.html is
            basePath: ''         // Empty string for root path
        },
        false,
        {
            enableCORS: true,
            apiPrefix: '/fear/api'
        }
    );
    
    await server.startServer();
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});