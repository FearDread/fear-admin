
const app = require("./src/app");
const db = require("./src/libs/db");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: ".env" });
const PORT = app.get("PORT") || 5000;

db.run();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.listen(PORT, () => {
  console.log(`FEAR API Server is listening on PORT ${PORT}`);
});

