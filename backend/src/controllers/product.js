const { AppError, dbError } = require("../_helpers/errorHandlers");
const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");

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
    
    // Split images into chunks due to cloudinary upload limits only 3 images can be uploaded at a time so we are splitting into chunks and uploading them separately eg: 9 images will be split into 3 chunks and uploaded separately
    const chunkSize = 3;
    const imageChunks = [];
    while (images.length > 0) {
      imageChunks.push(images.splice(0, chunkSize));
    }
    // Upload images in separate requests. for loop will run 3 times if there are 9 images to upload each time uploading 3 images at a time
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

    req.body.user = req.user.id;
    req.body.images = imagesLinks;
  }

  await ProductModel.create(req.body)
    .then((data) => {
      res.status(200).json({ 
        success: true,
        data: data 
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
};

exports.list = async (req, res) => {
  await Product.find()
    .then((products) => {
      res.status(201).json({  
        success: true,
        products: products,
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
};

exports.update = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("Product not found", 404));
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
      res.status(201).json({
        success: true,
        product: product,
      });
    }).catch((error) => {
      dbError(res, error);
    });
};

exports.delete = async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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
  if (!id) return next(new AppError("Product not found", 404));
  
  await ProductModel.findById(id)
    .then((data) => {
      res.status(201).json({
        succes: true,
        Product: Product,
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
};

/* Product Review methods */
/* ---------------------- */
exports.createProductReview = async (req, res, next) => {
  const { ratings, comment, productId, title, recommend } = req.body;
  const review = {
    userId: req.user._id,
    name: req.user.name,
    ratings: Number(ratings),
    title: title,
    comment: comment,
    recommend: recommend,
    avatar: req.user.avatar.url
  };

  const product = await ProductModel.findById(productId);

  // check if user already reviewed
  const isReviewed = product.reviews.find((rev) => {
    return rev.userId.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    // Update the existing review
    product.reviews.forEach((rev) => {
      if (rev.userId.toString() === req.user._id.toString()) {
        rev.ratings = ratings;
        rev.comment = comment;
        rev.recommend = recommend;
        
        rev.title = title;
        product.numOfReviews = product.reviews.length;
      }
    });
  } else {
    // Add a new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average ratings
  let totalRatings = 0;
  product.reviews.forEach((rev) => {
    totalRatings += rev.ratings;
  });
  product.ratings = totalRatings / product.reviews.length;

  // Save to the database
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

exports.getProductReviews = async (req, res, next) => {
  // we need product id for all reviews of the product

  const product = await ProductModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};

exports.deleteReview = async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); 
  }

  const reviews = product.reviews.filter(
    (rev) => { return rev._id.toString() !== req.query.id.toString()}
  );
  // once review filterd then update new rating from prdoduct review
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.ratings;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;
  await ProductModel.findByIdAndUpdate(req.query.productId, 
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((error) => {
      dbError(res, error);
    });
};

/*
exports.getAllProducts = asyncWrapper(async (req, res) => {
  const resultPerPage = 6; 
  const productsCount = await ProductModel.countDocuments(); 
  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search() 
    .filter();

  let products = await apiFeature.query; 
  let filteredProductCount = products.length;

  apiFeature.Pagination(resultPerPage);

  // Mongoose no longer allows executing the same query object twice, so use .clone() to retrieve the products again
  products = await apiFeature.query.clone(); // Retrieve the paginated products

  res.status(201).json({
    success: true,
    products: products,
    productsCount: productsCount,
    resultPerPage: resultPerPage,
    filteredProductCount: filteredProductCount,
  });
});
*/
