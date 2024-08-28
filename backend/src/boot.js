const cloudinary = require("cloudinary");

module.exports = app => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    app.db.run();
    app.listen(app.get("port"), () => {
        console.log(`NTask API - Port ${app.get("port")}`);
    });
}