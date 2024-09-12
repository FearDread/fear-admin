const cloudinary = require("cloudinary");
require("dotenv").config();

module.exports = ( config ) => {
  const props = config || {
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SERCRET
  };w

  cloudinary.config({
    cloud_name: props.CLOUDINARY_URL,
    api_key: props.CLOUDINARY_API_KEY,
    api_secret: props.CLOUDINARY_API_SECRET,
  });

  return {
    avatar: async (req, res, next) => {
      let avatar = { public_id: '', secure_url: ''};

      if (req.body && req.body.avatar) {
        
        await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        })
        .then((myCloud) => {
          avatar.public_id = myCloud.public_id;
          avatar.secure_url = myCloud.secure_url;

          return avatar;
        })
        .catch((err) => {
          console.log("Error uploading avatar:: ", err);
          next();
        });
      }

      return avatar;
    },
    product: async (req, res, next) => {
      let images = [];
  
      const links = [];
      const chunks = [];
      const chunkSize = 3;
    
      if (req.body && req.body.images) {
        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
    
        while (images.length > 0) {
          chunks.push(images.splice(0, chunkSize));
        }
        for (let chunk of chunks) {
          const uploadPromises = chunk.map((img) =>
            cloudinary.v2.uploader.upload(img, {
              folder: "products",
            })
          );
    
          const results = await Promise.all(uploadPromises);
    
          for (let result of results) { 
            links.push({
              product_id: result.public_id,
              url: result.secure_url,
            });
          }
        }
    
        req.body.id = req.body.user;
        req.body.images = links;
      }
  
      next();
    }
  }
}
exports.upload = async (req, res, next) => {

}

module.exports = {
  upload, imageLinks
};