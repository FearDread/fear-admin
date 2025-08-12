const FEAR = require('../../backend/src/FEAR'),
      express = require('express'),
      path = require('path');

(async () => {

    async function start() {

        FEAR.app.use(express.static(path.join(__dirname, '/public'))); // Assuming your SPA files are in a 'public' folder
        FEAR.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html')); // Send the main HTML file
        });

        FEAR.app.listen(5000, (err) => {
            FEAR.log.warn('Fear Dread Initialized');
        })

        process.on("unhandledRejection", FEAR.shutdown);
        process.on("uncaughtException", FEAR.shutdown);
        
        process.on('SIGTERM', FEAR.shutdown);
        process.on('SIGINT', FEAR.shutdown);
    }

    await start();

})(FEAR);