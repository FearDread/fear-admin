const FEAR = require('../../backend/src/FEAR.js'),
      express = require('express'),
      path = require('path');

(async () => {

    async function start() {
        const routes = require('./routes');

        FEAR.app.use(express.static(path.join(__dirname, 'public')));
        FEAR.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html')); // Send the main HTML file
        });

        FEAR.app.listen(4001, (err) => {
            FEAR.log.warn('J-Bird Gallary Initialized');
        })
     
        process.on("unhandledRejection", FEAR.shutdown);
        process.on("uncaughtException", FEAR.shutdown);

        process.on('SIGTERM', FEAR.shutdown);
        process.on('SIGINT', FEAR.shutdown);
    }

    await start();

})(FEAR);