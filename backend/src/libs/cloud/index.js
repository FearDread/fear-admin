const fs = require("fs");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

module.exports = {
  uploadImg: async ( fileToUploads ) => {

    return new Promise((resolve) => {
      cloudinary.uploader.upload(fileToUploads, (result) => {
        resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {resource_type: "auto"}
        );
      });
    });
  },
  deleteImg: async (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  },
  send: async (req, res) => {
    try {
      const uploader = (path) => this.uploadImg(path, "images");

      const urls = [];
      const files = req.files;

      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const images = urls.map((file) => {
        return file;
      });

      res.json(images);

    } catch (error) {
      console.log("Cloudinary Error :: ", error);
      throw new Error(error);
    }
  },
  remove: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = this.deleteImg(id, "images");
      res.json({ message: "Deleted" });
    
    } catch (error) {
      console.log("Cloudinary Error :: ", error);
      throw new Error(error);
    }
  }
}