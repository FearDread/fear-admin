
const { AppError, dbError } = require("../_utils/errorHandlers");
const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");

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