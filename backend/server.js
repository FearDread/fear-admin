
const FEAR = require("./src/FEAR");
const cloudinary = require("cloudinary");
require("dotenv").config();

(async () => {

    async function start() {
        console.log("Starting FEAR");
        const port = FEAR.app.get("PORT");
        
        FEAR.db.run( FEAR.env, () => {
            FEAR.app.listen( port, (err) => {
                if ( err ) return;
                console.log(`FEAR API Initialized :: Port ${port}`);
            });
        });
    }

    await start();

})( FEAR );





