import fs from "fs";

module.exports = app => {

    if (process.env.NODE_ENV !== "test") {
        const credentials = {
            key: fs.readFileSync("ntask.key", "utf8"),
            cert: fs.readFileSync("ntask.cert", "utf8")
        }
    }  
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