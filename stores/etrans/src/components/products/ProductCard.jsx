

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="bg-gray-900 p-2 rounded-full hover:bg-gray-700">
            <i></i>
          </button>
        </div>
        <div className="bg-gray-700 h-64 flex items-center justify-center text-6xl">
          {product.icon}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        <h6 className="font-semibold mb-2">{product.name}</h6>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-gray-400 line-through text-sm mr-2">$99.00</span>
            <span className="text-xl font-bold">${product.price}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <i idx={i}></i>
              /* <Star key={i} size={14} fill={i < product.rating ? "currentColor" : "none"} /> */
            ))}
          </div>
        </div>
        <button className="w-full bg-white text-gray-900 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2">
          <i></i> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;