
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {

    async function start() {
        console.log("Starting FEAR");
        const port = FEAR.app.get("PORT");
        
        FEAR.db.run( FEAR.env, () => {
            
            const server = FEAR.app.listen( port, (err) => {
                if ( err ) return;
                console.log(`FEAR API Initialized :: Port ${port}`);
            });

            process.on("uncaughtException" , (err) => {
                console.log(`Server Error , ${err.message}`);
                process.exit(1);
            });

            process.on("unhandledRejection" , (err) => { 
                console.log(`Promise Error : ${err.message}`);
                
                server.close(() => {
                    process.exit(1);
                })
            })
        });
    }

    await start();

})( FEAR );





