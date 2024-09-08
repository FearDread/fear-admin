const cloudinary = require("cloudinary");
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {

    async function start() {
        console.log("Starting FEAR");
        const port = FEAR.app.get("PORT");

        cloudinary.config({
            cloud_name: FEAR.env.CLOUDINARY_NAME,
            api_key: FEAR.env.API_KEY,
            api_secret: FEAR.env.API_SECRET,
        });

        FEAR.db.run( FEAR.env );
        FEAR.app.listen( port, (err) => {
            if ( err ) return;
            console.log(`FEAR API Initialized :: Port ${port}`);
        });
    }

    await start();

})( FEAR );





