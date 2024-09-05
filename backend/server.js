const cloudinary = require("cloudinary");
const FEAR = require("./src/FEAR");
require("dotenv").config();

(async () => {
    async function start() {
        console.log("FEAR :: ", FEAR);
        const _this = this;
        const port = FEAR.app.get("PORT");

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        FEAR.db.run();
        const server = FEAR.app.listen( port, (err) => {
            if ( err ) return;
            console.log(`FEAR API Initialized :: Port ${port}`);
        });
    }

    await start();
})( FEAR );





