#!/usr/bin/env node
const FEAR = require("./src/FEAR"),
      path = require('path'),
      express = require('express'),
      __dirname1 = path.resolve();

require("dotenv").config();

(async () => {

    async function start() {

        const port = FEAR.app.get("PORT");

        FEAR.log.warn(FEAR.logo);

        FEAR.app.use(express.static(path.join(__dirname1, "/dashboard/build")));
        
        FEAR.app.get("*", (req, res) =>
            res.sendFile(path.resolve(__dirname1, "dashboard", "build", "index.html"))
        );

        FEAR.db.run(FEAR.env, () => {
            FEAR.app.listen(port, (err) => {
                if (err) return;
                FEAR.log.info(`FEAR API Initialized :: Port ${port}`);
            });
        });

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





