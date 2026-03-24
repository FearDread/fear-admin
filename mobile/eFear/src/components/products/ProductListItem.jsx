import React from "react";
import { Link } from "react-router-dom";

export const ProductListItem = ({ product }) => {
  const renderStars = (rating = 5) => {
    return [...Array(rating)].map((_, i) => (
      <i key={i} className="bx bxs-star text-white"></i>
    ));
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="bottom-product-img">
          <Link to={`/product/${product._id}`}>
            <img 
              src={(product.images[0] && product.images[0].url) || 'assets/images/products/placeholder.png'} 
              width="100" 
              alt={product.title || 'Product'}
              style={{"maxHeight" : 100, "objectFit" : "contain"}}
            />
          </Link>
        </div>
        <div className="ms-10" style={{"marginLeft": 10}}>
          <h6 className="mb-0 fw-light mb-1">
            {product.title || product.name || 'Product Name'}
          </h6>
          <div className="rating font-12">
            {renderStars(product.rating)}
          </div>
          <p className="mb-0 text-white">
            <strong>${product.price?.toFixed(2) || '0.00'}</strong>
          </p>
        </div>
      </div>
      <hr/>
    </>
  );
};

export default ProductListItem;