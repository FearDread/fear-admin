const cloudinary = require("cloudinary");
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {
    async function start() {
        console.log("Starting FEAR :: ", FEAR);
        const port = FEAR.app.get("PORT");
        const env = FEAR.env;

        cloudinary.config({
            cloud_name: env.CLOUDINARY_NAME,
            api_key: env.API_KEY,
            api_secret: env.API_SECRET,
        });

        FEAR.db.run( env );
        FEAR.app.listen( port, (err) => {
            if ( err ) return;
            console.log(`FEAR API Initialized :: Port ${port}`);
        });
    }

    await start();
})( FEAR );





