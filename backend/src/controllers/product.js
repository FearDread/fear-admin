const { tryCatch } = require("../libs/handler/error");
const { productSearch } = require("../libs/search/features");
const Product = require("../models/product");
const methods = require("./crud");


/**
 * Get trending products (latest products with high ratings)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.trending = tryCatch(async (req, res) => {
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
 * 
 * Get product statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductStats = tryCatch(async (req, res) => {
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


/**
 * Get trending products (latest products with high ratings)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.featured = tryCatch(async (req, res) => {
  const featuredProducts = await Product.find({isFeatured: true});
  console.log('featured results = ', featuredProducts);
    if (featuredProducts) {
      return res.status(200).json({ success: true, result: featuredProducts })
    }


  /*
  return res.status(200).json({
    success: true,
    message: `Top ${featuredProducts.length} trending products`,
    result: featuredProducts,
    count: featuredProducts.length
  });
  */
});

exports.productSearch = tryCatch(async (req, res) => {
  return await productSearch(req.query, Product)
    .then((result) => {
      return res.status(200).json({ success: true, result });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error });
    });
});

// Extend with CRUD methods
const crud = methods.crudController(Product);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}