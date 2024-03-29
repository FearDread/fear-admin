//const { AppError, dbError } = require("../_utils/errorHandlers");
const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");
const DataError = require("../middleware/error-handler");

/* Product CRUD methods */
/* -------------------- */
exports.create = async (req, res) => {
  let images = []; 
  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
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
          folder: "Products",
        })
      );

      const results = await Promise.all(uploadPromises); // wait for all the promises to resolve and store the results in results array eg: [{}, {}, {}] 3 images uploaded successfully and their details are stored in results array

      for (let result of results) { 
        imagesLinks.push({
          product_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    req.body.id = req.body.user;
    req.body.images = imagesLinks;
  }

  await ProductModel.create(req.body)
    .then((data) => {
      res.status(200).json({ 
        success: true,
        product: data 
      });
    })
    .catch((error) => {
      //dbError(res, error);
    });
};

exports.list = async (req, res) => {

  await ProductModel.find()
    .then((products) => {
      res.status(200).send({  
        success: true,
        products,
      });
    })
    .catch((error) => {
     DataError(res, error);
    });
};

exports.categories = async (req, res) => {
  let categories = ["All"];
  const products = await ProductModel.find({});

  products.map((product) => {
     const { category } = product;
     categories.push(category);
  });

  categories = [...new Set(categories)];
  return res.status(200).json(categories);
}

exports.update = async (req, res, next) => {
  if (!req.params.id) {
   // return next(new AppError("Product not found", 404));
  }

  let product = await Product.findById(req.params.id);
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].product_id);
    }

    const imagesLinks = [];
    for (let img of images) {
      const result = await cloudinary.v2.uploader.upload(img, {
        folder: "Products",
      });

      imagesLinks.push({
        product_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    .then((data) => {
      res.status(200).json({product: data});
    })
    .catch((error) => {
     // dbError(res, error);
    });
};

exports.delete = async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);

  if (!product) {
   // return next(new ErrorHandler("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].product_id);
  }

  await product.remove();

  res.status(201).json({
    success: true,
    message: "Product delete successfully",
  });
};

exports.read = async (req, res, next) => {
  const id = req.params.id;
  //if (!id) return next(new AppError("Product not found", 404));
  
  await ProductModel.findById(id)
    .then((product) => {
      res.status(201).send({
        succes: true,
        product
      });
      return;
    })
    .catch((error) => {
      DataError(res, error);
    });
};
