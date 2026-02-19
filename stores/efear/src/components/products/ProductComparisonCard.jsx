import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  fetchProduct,
  selectProductById,
  selectProductsLoading,
} from '../../features/products/slice';
import {
  addItem,
  selectIsInCart,
} from '../../features/cart/slice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../../features/wishlist/slice';

// ─── ComparisonProductCard ────────────────────────────────────────────────────
// Self-contained card that reads its own Redux slice state.
// Keeping useSelector calls here (not inside a .map()) satisfies Rules of Hooks.
export const ProductComparisonCard = ({ productId, onRemove, onAddToCart, onToggleWishlist }) => {
  const navigate     = useNavigate();
  const product      = useSelector((state) => selectProductById(state, productId));
  const isInCart     = useSelector((state) => selectIsInCart(state, productId));
  const isInWishlist = useSelector((state) => selectIsInWishlist(state, productId));

  if (!product) return null;

  const productImage = product.images?.[0]?.url || 'assets/images/products/placeholder.png';
  const hasDiscount  = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const discountPct  = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bx bxs-star ${i < rating ? 'text-warning' : 'text-muted'}`} />
    ));

  return (
    <div className="card rounded-0 product-card h-100">

      {/* ── Header: discount / out-of-stock badge + remove button ── */}
      <div className="card-header bg-transparent border-bottom-0 position-relative" style={{ minHeight: 48 }}>
        {hasDiscount && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{discountPct}%
          </span>
        )}
        {!product.quantity && (
          <span className="badge bg-dark position-absolute top-0 start-0 m-2">
            Out of Stock
          </span>
        )}
        <button
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
          onClick={() => onRemove(product._id)}
          title="Remove from comparison"
        >
          <i className="bx bx-x" />
        </button>
      </div>

      {/* ── Product image ── */}
      <Link to={`/products/${product._id}`}>
        <img
          src={productImage}
          className="card-img-top"
          alt={product.title}
          style={{ objectFit: 'cover', height: 220 }}
        />
      </Link>

      {/* ── Card body ── */}
      <div className="card-body d-flex flex-column">

        {/* Category */}
        <Link to={`/shop?category=${product.categoryId || ''}`}>
          <p className="product-catergory font-13 mb-1">{product.category || 'General'}</p>
        </Link>

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h6 className="product-name mb-2">{product.title}</h6>
        </Link>

        {/* Price + star rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="product-price">
            {hasDiscount && (
              <span className="me-1 text-decoration-line-through text-muted small">
                ${product.price?.toFixed(2)}
              </span>
            )}
            <span className="text-white fs-5">${currentPrice?.toFixed(2)}</span>
          </div>
          <div className="ms-auto">{renderStars(product.rating)}</div>
        </div>

        {/* Stock label */}
        <div className="mb-3">
          {product.quantity > 0 ? (
            <small className={`text-${product.quantity < 10 ? 'warning' : 'success'}`}>
              {product.quantity < 10 ? `Only ${product.quantity} left!` : 'In Stock'}
            </small>
          ) : (
            <small className="text-danger">Out of Stock</small>
          )}
        </div>

        {/* Action buttons pinned to card bottom */}
        <div className="mt-auto d-flex flex-column gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-white btn-ecomm btn-sm"
            disabled={!product.quantity || isInCart}
          >
            <i className={`bx ${isInCart ? 'bx-check' : 'bxs-cart-add'} me-1`} />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>

          <button
            onClick={() => onToggleWishlist({ ...product, isInWishlist })}
            className={`btn btn-ecomm btn-sm ${isInWishlist ? 'btn-warning' : 'btn-light'}`}
          >
            <i className={`bx ${isInWishlist ? 'bxs-heart' : 'bx-heart'} me-1`} />
            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </button>

          <button
            onClick={() => navigate(`/products/${product._id}`)}
            className="btn btn-outline-primary btn-sm"
          >
            <i className="bx bx-show me-1" />View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonCard;