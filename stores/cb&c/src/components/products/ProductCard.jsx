  import React, { useState, useEffect } from 'react';
  
  
  export const ProductCard = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(product.image1);
    const isWishlisted = wishlist.includes(product.id);

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <div 
          className="relative aspect-square overflow-hidden cursor-pointer"
          onMouseEnter={() => setCurrentImage(product.image2)}
          onMouseLeave={() => setCurrentImage(product.image1)}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Product Image</span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-gray-400 line-through">${product.originalPrice}</span>
            <span className="text-2xl font-bold text-blue-600">${product.salePrice}</span>
          </div>

          <StarRating rating={product.rating} />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 py-4 flex items-center justify-center space-x-2 transition-all duration-300 border-t"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">Add to Cart</span>
        </button>
      </div>
    );
  };

  export default ProductCard;