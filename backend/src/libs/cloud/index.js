const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

exports.base64 = (file) => {
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
};

exports.upload = async ( files ) => {
  
  const promises = files.map( async (file) => {
    
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload( base64(file), (result, error) => {
          if (error) return reject(error);
          
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        });
    }); 
  });
  const result = await Promise.all(promises);

  return result.map((img) => ({
    public_id: img.public_id,
    url: img.secure_url,
  }));
}

exports.remove = async ( publicIds ) => {
  
  const promises = publicIds.map((id) => {
   
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error, result) => {
          if (error) return reject(error);
          resolve();
      });
    });
  });

  await Promise.all(promises);
}