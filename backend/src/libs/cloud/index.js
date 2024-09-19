const cloudinary = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.base64 = (file) => {
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
};

exports.uploadAvatar = async ( file ) => {
  let avatar = {};

  await cloudinary.v2.uploader.upload(file, { folder: "avatar", width: 150, crop: "scale" })
    .then((resp) => { avatar.public_id = resp.secure_url; avatar.url = resp.secure_url; })
    .catch((error) => { throw new Error(error); });

  return avatar;
};

exports.uploadImages = async ( files ) => {
  let images = [];

  if (typeof files === "string") {
    images.push(files);
  } else {
    images = files;
  }
  const imagesLinks = [];
  const chunkSize = 3;
  const imageChunks = [];
  
  while (images.length > 0) {
    imageChunks.push(images.splice(0, chunkSize));
  }
  for (let chunk of imageChunks) {
    const uploadPromises = chunk.map((img) =>
      cloudinary.v2.uploader.upload(img, {
        folder: "products",
      })
    );

    const results = await Promise.all(uploadPromises);
    for (let result of results) { 
      imagesLinks.push({
        product_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  return imagesLinks;
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