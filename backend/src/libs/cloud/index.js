const cloudinary = require("cloudinary");

exports.upload = async (req, res, next) => {
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

    next( req );
}

module.exports = {
  upload, imageLinks
};