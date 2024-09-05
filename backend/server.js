const cloudinary = require("cloudinary");
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {
    async function start() {
        console.log("Starting FEAR :: ", FEAR);
        const port = FEAR.app.get("PORT");
        const cfg = FEAR.config;

        cloudinary.config({
            cloud_name: cfg.CLOUDINARY_NAME,
            api_key: cfg.API_KEY,
            api_secret: cfg.API_SECRET,
        });

        FEAR.db.run();
        FEAR.app.listen( port, (err) => {
            if ( err ) return;
            console.log(`FEAR API Initialized :: Port ${port}`);
        });
    }

    await start();
})( FEAR );





