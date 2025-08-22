
  
  
  export const SpecialOfferCard = ({ product }) => (
    <div className="mb-8 last:mb-0">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          <span className="text-gray-400 text-sm">Special Image</span>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
          {product.name}
        </h4>
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-gray-400 line-through">${product.originalPrice}</span>
          <span className="text-xl font-bold text-blue-600">${product.salePrice}</span>
        </div>
        <StarRating rating={product.rating} />
      </div>
    </div>
  );

  export default SpecialOfferCard;