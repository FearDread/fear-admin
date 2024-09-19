
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {

    async function start() {
        const port = FEAR.app.get("PORT");
        FEAR.log(FEAR.logo);
        
        FEAR.db.run( FEAR.env, () => {
            FEAR.app.listen( port, (err) => {
                if ( err ) return;
                FEAR.log(`FEAR API Initialized :: Port ${port}`);
            });

            process.on("unhandledRejection", (error) => { 
                FEAR.log("Promise Error :: ", error);
            })
            process.on("uncaughtException", (err) => {
                FEAR.log("Server Error", err );
                FEAR.app.listen().close(() => {
                    process.exit(1);
                })
            });
        });
    }

    await start();

})( FEAR );





