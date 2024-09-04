const cloudinary = require("cloudinary");
const FEAR = require("./src/FEAR");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

console.log("FEAR :: ", FEAR);
FEAR.db.run();
FEAR.app.listen( FEAR.app.get("PORT"), () => {
    console.log(`FEAR API Initialized :: Port ${FEAR.app.get("PORT")}`);
});

