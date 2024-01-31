const app = require("./app");
const config = require("./src/config");
const db = require("./src/config/db");
const cloudinary = require("cloudinary");

// connect to db //
db.run().catch(console.dir);

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});

const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`FEAR API Server is listening on PORT ${PORT}`);
});
