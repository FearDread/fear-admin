const { tryCatch } = require("../libs/handler/error");
const methods = require("./crud");
const Review = require("../models/review");
const Product = require("../models/product");
/**
 * Add or update a product review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.review = tryCatch(async (req, res) => {
  const { username, email, rating, comment } = req.body;
  const productId = req.params.productId || req.body.productId;
  //const userId = req.user._id;

  // Validate required fields
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5"
    });
  }

  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Comment is required"
    });
  }

  // Find product and check if it exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Check if user already reviewed this product
  const existingReviewIndex = product.reviews.findIndex(
    (review) => review.user.toString() === userId.toString()
  );

  const reviewData = {
    productId: productId,
    username,
    email,
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date()
  };

  if (existingReviewIndex !== -1) {
    // Update existing review
    product.reviews[existingReviewIndex] = {
      ...product.reviews[existingReviewIndex],
      ...reviewData,
      updatedAt: new Date()
    };
  } else {
    // Add new review
    product.reviews.push(reviewData);
  }

  // Recalculate average rating
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.rating = Number((totalRating / product.reviews.length).toFixed(1));
  product.totalReviews = product.reviews.length;

  // Save product
  const updatedProduct = await product.save();

  // Also save to Review collection if it exists
  try {
    if (existingReviewIndex !== -1) {
      // Update existing review in Review collection
      await Review.findOneAndUpdate(
        { username, productId },
        reviewData,
        { upsert: true, new: true }
      );
    } else {
      // Create new review in Review collection
      await Review.create(reviewData);
    }
  } catch (reviewError) {
    console.warn('Failed to sync review to Review collection:', reviewError.message);
  }

  return res.status(200).json({
    success: true,
    message: existingReviewIndex !== -1 ? "Review updated successfully" : "Review added successfully",
    result: updatedProduct,
    review: reviewData
  });
});

/**
 * Add or update product rating (alternative rating system)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.rating = tryCatch(async (req, res) => {
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
  const product = await Product.findById(prodId);
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

  // Save updated product
  const updatedProduct = await product.save();

  return res.status(200).json({
    success: true,
    message: existingRatingIndex !== -1 ? "Rating updated successfully" : "Rating added successfully",
    result: updatedProduct,
    rating: {
      averageRating: product.totalrating,
      totalRatings: product.totalRatings,
      userRating: ratingData
    }
  });
});

/**
 * Get product reviews with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductReviews = tryCatch(async (req, res) => {
  const productId = req.params.id;
  const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

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

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name email avatar')
    .sort(sortCriteria)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const totalReviews = await Review.countDocuments({ product: productId });
  const totalPages = Math.ceil(totalReviews / Number(limit));

  return res.status(200).json({
    success: true,
    message: "Product reviews retrieved successfully",
    result: reviews,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalReviews,
      reviewsPerPage: Number(limit),
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    }
  });
});

// Extend with CRUD methods
const crud = methods.crudController(Review);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}
