const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");
const cloud = require("../libs/cloud");
/* Product CRUD methods */
/* -------------------- */
//exports.Review = Review;

exports.create = async (req, res) => {
  let images = []; 

  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imageLinks = cloud.upload(images);
    req.body.images = imageLinks;
  }
  req.body.user = req.user.id;
  console.log("product data ::", req.body);
  await ProductModel.create(req.body)
    .then((product) => {
      console.log("Product Create Response :: ", product);
      if (product) {
        res.status(200).json({ success: true, data:product });
      }
    })
    .catch((error) => {
      throw error;
    });
};


  /* Refactor t  /*************************************************
  cloud.upload().then((data) => {

    await ProductModel.create(data.body)
    .then((product) => {
      res.sto use this when cloud lib finished **
atus(200).json({ success: true, product });
    })
    .catch((error) => {
      throw error;
    });
  })
  .catch((err) => {
    throw err;
  });
  */

exports.list = async (req, res) => {

  await ProductModel.find()
    .then((products) => {
      res.status(200).send({  success: true, products });
    })
    .catch((error) => {
      throw error;
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
  console.log('Product Details request ::', req.params);
  const id = req.params.id;
  if (!id) return next();
  
  await ProductModel.findById(id)
    .then((product) => {
      console.log("Product found ::", product);
      res.status(201).send( {succes: true, product} );
    })
    .catch((error) => {
      throw error;
    });
};
