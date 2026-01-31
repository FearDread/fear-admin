const { tryCatch } = require("../libs/handler/error");
const methods = require("./crud");
const Review = require("../models/review");
const Product = require("../models/product");

/**
 * Add or update a product review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.add = async (req, res) => {
  const { username, email, rating, comment } = req.body;
  const productId = req.params.id || req.body.productId;
  
  // Validate required fields
  if (!rating || rating < 1 || rating > 5) {
    return Promise.resolve(
      res.status(400).json({
        success: false, 
        message: "Rating must be between 1 and 5" 
    }));
  }
  if (!comment || comment.trim().length === 0) {
    return Promise.resolve(
      res.status(400).json({
        success: false, 
        message: "Comment is required"
    }));
  }
  
  const reviewData = {
    productId: productId,
    username,
    email,
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date()
  };

  // Find product and check if it exists
  return Product.findById(productId)
    .then(product => {
      if (!product) {
        res.status(400).json({ 
          success: false, 
          message: "Product not found" 
        });
        return Promise.reject(new Error("Product not found"));
      }

      product.reviews.push(reviewData);

      // Recalculate average rating
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating = Number((totalRating / product.reviews.length).toFixed(1));
      product.totalReviews = product.reviews.length;

      return product.save();
    })
    .then(() => {

      return Review.create(reviewData);
    })
    .then(review => {
        return res.status(200).json({ 
          success: true, 
          message: "Review added successfully", 
          result: review,
      });
      //return Promise.resolve(review);
    })
    .catch(error => {
      console.error('Error in review process:', error);
      return Promise.reject(error);
    });
};

/**
 * Add or update product rating (alternative rating system)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.rating = tryCatch((req, res) => {
  const { _id: userId } = req.user;
  const { star, prodId, comment = "" } = req.body;

  // Validate input
  if (!star || star < 1 || star > 5) {
    return res.status(400).json({
      success: false,
      message: "Star rating must be between 1 and 5"
    });
  }

  if (!prodId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required"
    });
  }

  // Find product
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      // Initialize ratings array if it doesn't exist
      if (!product.ratings) {
        product.ratings = [];
      }

      // Check if user already rated this product
      const existingRatingIndex = product.ratings.findIndex(
        (rating) => rating.postedby.toString() === userId.toString()
      );

      const ratingData = {
        star: Number(star),
        comment: comment.trim(),
        postedby: userId,
        createdAt: new Date()
      };

      if (existingRatingIndex !== -1) {
        // Update existing rating
        product.ratings[existingRatingIndex] = {
          ...product.ratings[existingRatingIndex],
          ...ratingData,
          updatedAt: new Date()
        };
      } else {
        // Add new rating
        product.ratings.push(ratingData);
      }

      // Calculate average rating
      const totalRatingSum = product.ratings.reduce((sum, rating) => sum + rating.star, 0);
      const averageRating = totalRatingSum / product.ratings.length;

      // Update product with new rating
      product.totalrating = Number(averageRating.toFixed(1));
      product.totalRatings = product.ratings.length;

      // Save updated product and return the promise
      return product.save().then(updatedProduct => ({
        updatedProduct,
        existingRatingIndex,
        ratingData
      }));
    })
    .then(({ updatedProduct, existingRatingIndex, ratingData }) => {
      return res.status(200).json({
        success: true,
        message: existingRatingIndex !== -1 ? "Rating updated successfully" : "Rating added successfully",
        result: updatedProduct,
        rating: {
          averageRating: updatedProduct.totalrating,
          totalRatings: updatedProduct.totalRatings,
          userRating: ratingData
        }
      });
    })
    .catch(error => {
      console.error('Error in rating process:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to process rating",
        error: error.message
      });
    });
});

/**
 * Get product reviews with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductReviews = tryCatch((req, res) => {
  const productId = req.params.id || req.body.productId;
  const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

  let sortCriteria;
  switch (sortBy) {
    case 'oldest':
      sortCriteria = { createdAt: 1 };
      break;
    case 'highest':
      sortCriteria = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sortCriteria = { rating: 1, createdAt: -1 };
      break;
    case 'newest':
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  // Validate product exists
  return Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
      
      const totalReviews = product.reviews.length;
      const totalPages = Math.ceil(totalReviews / Number(limit));

      return res.status(200).json({
        success: true,
        message: "Product reviews retrieved successfully",
        result: product.reviews,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalReviews,
          limit: Number(limit)
        }
      });
    })
    .catch(error => {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
        error: error.message
      });
    });
});

// Extend with CRUD methods
const crud = methods.crudController(Review);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}