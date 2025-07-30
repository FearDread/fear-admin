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
        
        process.on("unhandledRejection", (error) => {
            FEAR.log.error("Promise Error :: ", error);
            process.exit(1);
        });

        process.on("uncaughtException", (err) => {
            FEAR.log.error("Server Error", err);
            FEAR.app.listen().close(() => {
                process.exit(1);
            })
        });
    }

    await start();

})(FEAR);