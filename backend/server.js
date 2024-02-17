const app = require("./app");
const db = require("./src/data/db");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: "./config/config.env" });

// connect to db //
db.run().catch(console.dir);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`FEAR API Server is listening on PORT ${PORT}`);
});
