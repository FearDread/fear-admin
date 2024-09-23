
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {

    async function start() {
        
        const port = FEAR.app.get("PORT");
        FEAR.log.warn(FEAR.logo);
        
        FEAR.db.run( FEAR.env, () => {
            FEAR.app.listen( port, (err) => {
                if ( err ) return;
                FEAR.log.info(`FEAR API Initialized :: Port ${port}`);
            });
        });
        
        process.on("unhandledRejection", (error) => { 
            FEAR.log.error("Promise Error :: ", error);
        });

        process.on("uncaughtException", (err) => {
            FEAR.log.error("Server Error", err );
            FEAR.app.listen().close(() => {
                process.exit(1);
            })
        });
    }

    await start();

})( FEAR );





