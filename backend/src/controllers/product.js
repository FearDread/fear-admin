const { tryCatch } = require("../libs/handler/error");
const Product = require("../models/product");
const Review = require("../models/review");
const methods = require("./crud");

/**
 * Product Review Controller
 * Handles product reviews with proper validation and rating calculation
 */
class ProductController {
  
  /**
   * Add or update a product review
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static review = tryCatch(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

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
      user: userId,
      product: productId,
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
          { user: userId, product: productId },
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
  static rating = tryCatch(async (req, res) => {
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
   * Get trending products (latest products with high ratings)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static trending = tryCatch(async (req, res) => {
    const { limit = 8, sortBy = 'latest' } = req.query;
    
    let sortCriteria;
    switch (sortBy) {
      case 'rating':
        sortCriteria = { rating: -1, createdAt: -1 };
        break;
      case 'popular':
        sortCriteria = { totalReviews: -1, rating: -1 };
        break;
      case 'latest':
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    // Build aggregation pipeline for better performance
    const trendingProducts = await Product.aggregate([
      {
        $match: {
          isActive: { $ne: false }, // Only active products
          stock: { $gt: 0 } // Only in-stock products
        }
      },
      {
        $addFields: {
          // Calculate trend score based on rating and recency
          trendScore: {
            $multiply: [
              { $ifNull: ["$rating", 0] },
              { $ifNull: ["$totalReviews", 0] }
            ]
          }
        }
      },
      { $sort: sortCriteria },
      { $limit: Number(limit) },
      {
        $project: {
          name: 1,
          price: 1,
          discountPrice: 1,
          rating: 1,
          totalReviews: 1,
          totalrating: 1,
          totalRatings: 1,
          images: 1,
          category: 1,
          brand: 1,
          stock: 1,
          createdAt: 1,
          trendScore: 1
        }
      }
    ]);

    if (!trendingProducts || trendingProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No trending products found",
        result: [],
        count: 0
      });
    }

    return res.status(200).json({
      success: true,
      message: `Top ${trendingProducts.length} trending products`,
      result: trendingProducts,
      count: trendingProducts.length,
      sortBy
    });
  });

  /**
   * Get product reviews with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getProductReviews = tryCatch(async (req, res) => {
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

  /**
   * Get product statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getProductStats = tryCatch(async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Calculate rating distribution
    const ratingDistribution = {};
    [1, 2, 3, 4, 5].forEach(star => {
      ratingDistribution[`${star}star`] = product.reviews.filter(
        review => review.rating === star
      ).length;
    });

    const stats = {
      productId: product._id,
      name: product.name,
      averageRating: product.rating || 0,
      totalReviews: product.reviews.length,
      totalRatings: product.ratings ? product.ratings.length : 0,
      ratingDistribution,
      recentReviews: product.reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };

    return res.status(200).json({
      success: true,
      message: "Product statistics retrieved successfully",
      result: stats
    });
  });
}

// Export individual methods for backwards compatibility
exports.review = ProductController.review;
exports.rating = ProductController.rating;
exports.trending = ProductController.trending;
exports.getProductReviews = ProductController.getProductReviews;
exports.getProductStats = ProductController.getProductStats;

// Extend with CRUD methods
const crud = methods.crudController(Product);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}

// Export the class as well for advanced usage
exports.ProductController = ProductController;