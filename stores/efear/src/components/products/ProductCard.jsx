// components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "../../components/common/Toast";
import {
  addItem,
} from '../../features/cart/slice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist
} from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/user/slice';
import ProductQuickView from './ProductQuickView';

/**
 * ProductCard Component
 * Displays product information with cart and wishlist functionality
 * 
 * @param {Object} product - Product data object
 */
export const ProductCard = (product) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toasts, setToasts] = useState([]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const detailsLink = `/product/${product._id || product.id}`;
  const productImage = (product.images && product.images.length > 0) ? product.images[0]?.url : product.image || '/assets/images/fear/fear-dark-bg.jpg';
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const isInWishlist = useSelector(state =>
    selectIsInWishlist(state, product._id || product.id)
  );
  const discountPercent = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;
  
  const renderStars = (rating = 4) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bx bxs-star ${i <= rating ? 'text-warning' : 'text-light-4'}`}
        ></i>
      );
    }
    return stars;
  };

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message: 'Please login to add items to your wishlist'
        }
      });
      return;
    }
    setIsAddingToWishlist(true);
    const wishlistItem = {
      id: product._id,
      productId: product._id,
      name: product.title,
      title: product.title,
      subtotal: currentPrice,
      price: currentPrice,
      image: productImage,
      category: product.category,
      inStock: product.quantity,
      sku: product._id
    };

    Promise.resolve()
           .then(() => {
              if (isInWishlist) dispatch(removeFromWishlist(product._id || product.id));
              dispatch(addToWishlist(wishlistItem));
            })
            .catch((error) => { addToast('Failed to add to wishlist! :: ' + error.message, 'error');})
            .finally(() => {
                setIsAddingToWishlist(false);
                addToast('Product added to Wishlist!', 'success')
            });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      title: product.title,
      image: (product.images && product.images.length > 0) ? product.images?.[0]?.url : '',
      price: product.salePrice || product.price,
      subtotal: product.price,
      quantity,
      sku: product._id,
    };

    Promise.resolve()
          .then(() => { dispatch(addItem(cartItem));})
          .catch((error) => { addToast('Failed to add to wishlist! :: ' + error.message, 'error');})
          .finally(() => { addToast('Product added to cart!', 'success');})
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement compare functionality
    console.log('Compare:', product);
    navigate('/product/compare', {
      state: { product: [product] }
    });
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
    console.log('quick view', product);
  };

  return (
    <>
      <div className="col">
        <div className="card rounded-0 product-card">
          <div className="card-header bg-transparent border-bottom-0">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <button
                onClick={handleCompare}
                className="btn btn-link p-0 text-decoration-none"
                title="Compare"
              >
                <div className="product-compare">
                  <span>
                    <i className='bx bx-git-compare'></i> Compare
                  </span>
                </div>
              </button>
              <button
                onClick={handleWishlist}
                className="btn btn-link p-0 text-decoration-none"
                disabled={isAddingToWishlist}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <div className="product-wishlist">
                  {isAddingToWishlist ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <i className={`bx ${isInWishlist ? 'bxs-heart text-danger' : 'bx-heart'}`}></i>
                  )}
                </div>
              </button>
            </div>
            {hasDiscount && (
              <div className="position-absolute top-0 start-0 m-3">
                <span className="badge bg-danger">-{discountPercent}%</span>
              </div>
            )}
            {!product.quantity && (
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge bg-dark">Out of Stock</span>
              </div>
            )}
          </div>
          <Link to={detailsLink}>
            <img
              src={productImage || 'assets/images/fear/fear-dark-bg.jpg'}
              className="card-img-top"
              alt={product.title || product.title}
            />
          </Link>


          <div className="card-body">
            <div className="product-info">

              <Link to={`/shop?category=${product.categoryId || ''}`}>
                <p className="product-catergory font-13 mb-1">
                  {product.category || 'General'}
                </p>
              </Link>

              <Link to={detailsLink}>
                <h6 className="product-name mb-2">
                  {product.title || product.title}
                </h6>
              </Link>

              {/* Price and Rating */}
              <div className="d-flex align-items-center">
                {/* Price */}
                <div className="mb-1 product-price">
                  {hasDiscount && (
                    <span className="me-1 text-decoration-line-through text-muted">
                      ${product.price?.toFixed(2)}
                    </span>
                  )}
                  <span className="text-white fs-5">
                    ${currentPrice?.toFixed(2)}
                  </span>
                </div>

                {/* Rating */}
                <div className="cursor-pointer ms-auto">
                  {renderStars(product.rating || 4)}
                </div>
              </div>

              {/* Stock Status */}
              {product.quantity && product.quantity && (
                <div className="mt-2">
                  <small className={`text-${product.quantity < 10 ? 'warning' : 'success'}`}>
                    {product.quantity < 10
                      ? `Only ${product.quantity} left!`
                      : 'In Stock'}
                  </small>
                </div>
              )}
            </div>

            {/* Product Actions */}
            <div className="product-action mt-2">
              <div className="d-grid gap-2">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="btn btn-light btn-ecomm"
                  disabled={isAddingToCart || !product.quantity}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className='bx bxs-cart-add'></i>
                      {product.quantity ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>

                {/* Quick View Button */}
                <button
                  onClick={handleQuickView}
                  className="btn btn-link btn-ecomm"
                >
                  <i className='bx bx-zoom-in'></i>
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default ProductCard;