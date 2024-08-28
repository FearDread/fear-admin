const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");
const DataError = require("../middleware/error-handler");

/* Product Review methods */
/* ---------------------- */
exports.create = async (req, res, next) => {
    const { ratings, comment, productId, title, recommend } = req.body;x 
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
  
  exports.read = async (req, res, next) => {

    await ProductModel.findById(req.query.id)
      .then((product) => {

        res.status(200).send({ success: true, reviews: product.reviews });
      })
      .catch((error) => {
        DataError(res, error);
      });
  };
  
  exports.delete = async (req, res, next) => {
    await ProductModel.findById(req.query.productId)
      .then((product) => {
        const reviews = product.reviews.filter(
          (rev) => { return rev._id.toString() !== req.query.id.toString()}
        );

        let avg = 0;
        reviews.forEach((rev) => {
          avg += rev.ratings;
        });
        let ratings = (reviews.length === 0) ? 0 : avg / reviews.length;
        const numOfReviews = reviews.length;

        ProductModel.findByIdAndUpdate(req.query.productId, 
          { reviews, ratings, numOfReviews,},
          { new: true, runValidators: true, useFindAndModify: false,
        })
        .then(() => {
          res.status(200).send({ success: true, numOfReviews });
        })
        .catch((error) => {
          DataError(res, error);
        });
      })
      .catch((error) => {
        DataError(res, error);
      });
  };

  exports.list = async () => {
    const allReviews = [];

    await ProductModel.find()

  }