const { tryCatch } = require("../libs/handler/error");
const Cart = require("../models/cart");
const methods = require("./crud");

/**
 * Shopping Cart Controller
 * Handles cart operations with proper validation and error handling
 */

/**
 * Create or update cart item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCartItem = tryCatch(async (req, res) => {
  const { userId, productId, quantity = 1, price } = req.body;

  // Validate required fields
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: "userId and productId are required"
    });
  }

  if (!price || price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid price is required"
    });
  }

  if (quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be greater than 0"
    });
  }

  // Check if item already exists in cart
  return Cart.findOne({ userId, productId })
    .then((existingItem) => {
      if (existingItem) {
        // Update existing cart item quantity
        existingItem.quantity += parseInt(quantity);
        existingItem.price = price; // Update price in case it changed
        existingItem.updatedAt = new Date();
        
        return existingItem.save();
      } else {
        // Create new cart item
        const cartData = {
          userId,
          productId,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return new Cart(cartData).save();
      }
    })
    .then((cartItem) => {
      return res.status(201).json({
        success: true,
        message: "Cart item created/updated successfully",
        result: cartItem
      });
    })
    .catch((error) => {
      console.error('Error in createCartItem:', error);
      
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Error creating cart item",
        error: error.message
      });
    });
});

/**
 * Get user's cart with populated product details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserCart = tryCatch(async (req, res) => {
  // Get userId from params, body, or user session
  const userId = req.params.userId || req.body.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  return Cart.find({ userId })
    .populate({
      path: "productId",
      select: "name price discountPrice images category brand stock isActive",
      match: { isActive: { $ne: false } } // Only populate active products
    })
    .sort({ createdAt: -1 })
    .then((cartItems) => {
      // Filter out items where product was not populated (deleted products)
      const validCartItems = cartItems.filter(item => item.productId);
      
      // Calculate cart summary
      const cartSummary = {
        totalItems: validCartItems.length,
        totalQuantity: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: validCartItems.reduce((sum, item) => {
          const itemPrice = item.productId.discountPrice || item.productId.price || item.price;
          return sum + (itemPrice * item.quantity);
        }, 0)
      };

      // Round subtotal to 2 decimal places
      cartSummary.subtotal = Math.round(cartSummary.subtotal * 100) / 100;

      return res.status(200).json({
        success: true,
        message: `Found ${validCartItems.length} items in cart`,
        result: validCartItems,
        summary: cartSummary
      });
    })
    .catch((error) => {
      console.error('Error in getUserCart:', error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving cart",
        error: error.message
      });
    });
});

/**
 * Empty user's cart (remove all items)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.emptyUserCart = tryCatch(async (req, res) => {
  // Get userId from params, body, or user session
  const userId = req.params.userId || req.body.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  return Cart.deleteMany({ userId })
    .then((deleteResult) => {
      if (deleteResult.deletedCount === 0) {
        return res.status(200).json({
          success: true,
          message: "Cart was already empty",
          deletedCount: 0
        });
      }
      
      return res.status(200).json({
        success: true,
        message: `Successfully cleared cart - ${deleteResult.deletedCount} items removed`,
        deletedCount: deleteResult.deletedCount
      });
    })
    .catch((error) => {
      console.error('Error in emptyUserCart:', error);
      return res.status(500).json({
        success: false,
        message: "Error emptying cart",
        error: error.message
      });
    });
});

/**
 * Update quantity of specific cart item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateQuantity = tryCatch(async (req, res) => {
  const { cartItemId } = req.params;
  const { newQuantity, userId } = req.body;

  // Validate required fields
  if (!cartItemId) {
    return res.status(400).json({
      success: false,
      message: "Cart item ID is required"
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  if (!newQuantity || newQuantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid quantity (greater than 0) is required"
    });
  }

  // Validate ObjectId format
  if (!cartItemId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart item ID format"
    });
  }

  return Cart.findOne({ _id: cartItemId, userId })
    .then((cartItem) => {
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found or doesn't belong to user"
        });
      }

      // Update quantity and timestamp
      cartItem.quantity = parseInt(newQuantity);
      cartItem.updatedAt = new Date();
      
      return cartItem.save();
    })
    .then((updatedItem) => {
      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        result: updatedItem
      });
    })
    .catch((error) => {
      console.error('Error in updateQuantity:', error);
      
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Error updating cart item quantity",
        error: error.message
      });
    });
});

/**
 * Remove specific item from cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeCartItem = tryCatch(async (req, res) => {
  const { cartItemId } = req.params;
  const { userId } = req.body;

  if (!cartItemId) {
    return res.status(400).json({
      success: false,
      message: "Cart item ID is required"
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  // Validate ObjectId format
  if (!cartItemId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart item ID format"
    });
  }

  return Cart.findOneAndDelete({ _id: cartItemId, userId })
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found or doesn't belong to user"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
        result: deletedItem
      });
    })
    .catch((error) => {
      console.error('Error in removeCartItem:', error);
      return res.status(500).json({
        success: false,
        message: "Error removing cart item",
        error: error.message
      });
    });
});

/**
 * Get cart item count for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCartCount = tryCatch(async (req, res) => {
  const userId = req.params.userId || req.body.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  return Cart.countDocuments({ userId })
    .then((count) => {
      return res.status(200).json({
        success: true,
        message: "Cart count retrieved successfully",
        result: { count }
      });
    })
    .catch((error) => {
      console.error('Error in getCartCount:', error);
      return res.status(500).json({
        success: false,
        message: "Error getting cart count",
        error: error.message
      });
    });
});

/**
 * Sync cart prices with current product prices
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.syncCartPrices = tryCatch(async (req, res) => {
  const userId = req.params.userId || req.body.id || req.user?._id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  return Cart.find({ userId })
    .populate('productId', 'price discountPrice')
    .then((cartItems) => {
      const updatePromises = cartItems.map((item) => {
        if (item.productId) {
          const currentPrice = item.productId.discountPrice || item.productId.price;
          if (currentPrice !== item.price) {
            item.price = currentPrice;
            item.updatedAt = new Date();
            return item.save();
          }
        }
        return Promise.resolve(item);
      });
      
      return Promise.all(updatePromises);
    })
    .then((updatedItems) => {
      return res.status(200).json({
        success: true,
        message: "Cart prices synchronized successfully",
        result: updatedItems
      });
    })
    .catch((error) => {
      console.error('Error in syncCartPrices:', error);
      return res.status(500).json({
        success: false,
        message: "Error syncing cart prices",
        error: error.message
      });
    });
});

// Extend with CRUD methods for additional cart operations
const crud = methods.crudController(Cart);
for (const prop in crud) {
  if (crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}

// Export all methods
module.exports = {
  ...module.exports,
  createCartItem: exports.createCartItem,
  getUserCart: exports.getUserCart,
  emptyUserCart: exports.emptyUserCart,
  updateQuantity: exports.updateQuantity,
  removeCartItem: exports.removeCartItem,
  getCartCount: exports.getCartCount,
  syncCartPrices: exports.syncCartPrices
};