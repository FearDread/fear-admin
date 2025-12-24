const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Converts file buffer to base64 data URL
 * @param {Object} file - File object with mimetype and buffer
 * @returns {string} Base64 data URL
 */
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

/**
 * Uploads avatar to Cloudinary
 * @param {string} file - Base64 encoded file or file path
 * @returns {Promise<Object>} Avatar object with public_id and url
 */
const uploadAvatar = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
};

/**
 * Uploads multiple images to Cloudinary in chunks to avoid rate limiting
 * @param {string|string[]} files - Single file or array of files
 * @param {number} chunkSize - Number of files to upload concurrently
 * @returns {Promise<Object[]>} Array of image objects with public_id and url
 */
const uploadImages = async (files, chunkSize = 3) => {
  try {
    // Normalize input to array
    const imageArray = Array.isArray(files) ? [...files] : [files];
    
    if (imageArray.length === 0) {
      return [];
    }

    const imageLinks = [];
    
    // Process images in chunks to avoid overwhelming the API
    for (let i = 0; i < imageArray.length; i += chunkSize) {
      const chunk = imageArray.slice(i, i + chunkSize);
      
      const uploadPromises = chunk.map((image) =>
        cloudinary.uploader.upload(image, {
          folder: "products",
        })
      );

      const results = await Promise.all(uploadPromises);
      
      const chunkResults = results.map((result) => ({
        product_id: result.public_id,
        url: result.secure_url,
      }));
      
      imageLinks.push(...chunkResults);
    }

    return imageLinks;
  } catch (error) {
    throw new Error(`Image upload failed: ${error}`);
  }
};

/**
 * Multer disk storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/images/");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname) || '.jpeg';
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

/**
 * Multer file filter for images only
 */
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Only images are allowed."), false);
  }
};

/**
 * Multer upload configuration
 */
const uploadPhoto = multer({
  storage,
  fileFilter: multerFilter,
  limits: { 
    fileSize: 1000000, // 1MB
    files: 10 // Maximum 10 files
  },
});

/**
 * Middleware to resize uploaded images
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const resizeImages = async (req, res, next) => {
  try {
    // Skip if no files uploaded or no directory specified
    if (!req.files || !req.directory) {
      return next();
    }

    // Ensure directory exists
    const targetDir = path.join("public/images", req.directory);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Process all files concurrently
    await Promise.all(
      req.files.map(async (file) => {
        const originalPath = file.path;
        const targetPath = path.join(targetDir, file.filename);

        try {
          // Resize and convert image
          await sharp(originalPath)
            .resize(300, 300, { 
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: 90 })
            .toFile(targetPath);

          // Clean up original file
          if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
          }
        } catch (imageError) {
          console.error(`Failed to process image ${file.filename}:`, imageError);
          // Clean up files on error
          [originalPath, targetPath].forEach(filePath => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
          throw imageError;
        }
      })
    );

    next();
  } catch (error) {
    next(new Error(`Image resize failed: ${error.message}`));
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

/**
 * Get Cloudinary image transformation URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Transformation options
 * @returns {string} Transformed image URL
 */
const getTransformedImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
};

module.exports = {
  // Core functions
  convertToBase64,
  uploadAvatar,
  uploadImages,
  deleteImage,
  getTransformedImageUrl,
  
  // Multer configuration
  storage,
  multerFilter,
  uploadPhoto,
  resizeImages,
  
  // Cloudinary instance (if needed for direct access)
  cloudinary,
};