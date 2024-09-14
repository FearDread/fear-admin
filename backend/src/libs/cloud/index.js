const cloudinary = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
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

exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

exports.multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

exports.uploadPhoto = multer({
  storage: this.storage,
  fileFilter: this.multerFilter,
  limits: { fileSize: 1000000 },
});

exports.resize = async (req, res, next) => {
  if (!req.files || req.directory) return next();

  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/${req.directory}/${file.filename}`);
      fs.unlinkSync(`public/images/${req.directory}/${file.filename}`);
    })
  );
  next();
};