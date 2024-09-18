
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {

    async function start() {
        const port = FEAR.app.get("PORT");
        console.log(FEAR.logo);
        
        FEAR.db.run( FEAR.env, () => {
            FEAR.app.listen( port, (err) => {
                if ( err ) return;
                console.log(`FEAR API Initialized :: Port ${port}`);
            });

            process.on("unhandledRejection", (err) => { 
                console.log('Promise Error = ', err);
            })
            process.on("uncaughtException", (err) => {
                console.log("Server Error", err );
                FEAR.app.listen().close(() => {
                    process.exit(1);
                })
            });


        });
    }

    await start();

})( FEAR );





