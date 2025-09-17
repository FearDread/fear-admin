const router = require("express").Router();
const validator = require("../libs/validator");
const handler = require('../libs/handler');
const Cart = require("../controllers/cart");

router.post("/new", validator.request, handler.async(Cart.createCartItem));
router.post("/user", validator.request, handler.async(Cart.getUserCart));
router.delete("/empty", validator.request, handler.async(Cart.emptyUserCart));
router.patch("/quantity/:id", validator.request, handler.async(Cart.updateQuantity))

module.exports = router;

/**
 * GET /api/cart
 * Get current user's cart
 * Query params: userId (optional, for admin/different user)
 
router.get('/',
  validator.request,
  handler.async(Cart.getUserCart)
);

/**
 * POST /api/cart/items
 * Add item to cart
 
router.post('/items',
  validate.item,
  validator.request,
  handler.async(Cart.addCartItem)
);

/**
 * PUT /api/cart/items/:itemId
 * Update cart item quantity (or replace item)
 
router.put('/items/:itemId',
  validate.quantity,
  validator.request,
  handler.async(Cart.updateCartItem)
);

/**
 * PATCH /api/cart/items/:itemId/quantity
 * Update only the quantity of a cart item
 
router.patch('/items/:itemId/quantity',
  [
    param('itemId')
      .isMongoId()
      .withMessage('Valid cart item ID is required'),
    body('quantity')
      .isInt({ min: 0, max: 100 })
      .withMessage('Quantity must be between 0 and 100')
  ],
  validateRequest,
  asyncHandler(cartController.updateItemQuantity)
);

/**
 * DELETE /api/cart/items/:itemId
 * Remove specific item from cart
 
router.delete('/items/:itemId',
  [
    param('itemId')
      .isMongoId()
      .withMessage('Valid cart item ID is required')
  ],
  validateRequest,
  asyncHandler(cartController.removeCartItem)
);

/**
 * DELETE /api/cart
 * Empty entire cart
 
router.delete('/',
  userIdValidation,
  validateRequest,
  asyncHandler(cartController.emptyCart)
);

/**
 * GET /api/cart/summary
 * Get cart summary (total items, total price, etc.)
 
router.get('/summary',
  [
    query('userId')
      .optional()
      .isMongoId()
      .withMessage('Valid user ID is required')
  ],
  validateRequest,
  asyncHandler(cartController.getCartSummary)
);


module.exports = router;
*/