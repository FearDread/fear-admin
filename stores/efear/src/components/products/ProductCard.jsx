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

const MAX_COMPARE_PRODUCTS = 4;
const COMPARE_STORAGE_KEY = 'comparisonProductIds';

export const ProductCard = (product) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity] = useState(1);
  const [toasts, setToasts] = useState([]);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const productId = product._id || product.id;
  const detailsLink = `/product/${productId}`;
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]?.url
      : product.image || '/assets/images/fear/fear-dark-bg.jpg';
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, productId)
  );

  const renderStars = (rating = 4) =>
    Array.from({ length: 5 }, (_, i) => (
      <i
        key={i + 1}
        className={`bx bxs-star ${i + 1 <= rating ? 'text-warning' : 'text-light-4'}`}
      />
    ));

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const getStoredCompareIds = () => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveCompareIds = (ids) => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
    return ids;
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message: 'Please login to add items to your wishlist',
        },
      });
      return;
    }

    setIsAddingToWishlist(true);

    const wishlistItem = {
      id: productId,
      productId,
      title: product.title,
      subtotal: currentPrice,
      price: currentPrice,
      image: productImage,
      category: product.category,
      inStock: product.quantity,
      sku: productId,
    };

    Promise.resolve()
      .then(() => {
        if (isInWishlist) {
          dispatch(removeFromWishlist(productId));
        } else {
          dispatch(addToWishlist(wishlistItem));
        }
      })
      .catch((error) => addToast('Failed to update wishlist: ' + error.message, 'error'))
      .finally(() => {
        setIsAddingToWishlist(false);
        addToast(
          isInWishlist ? 'Removed from Wishlist!' : 'Product added to Wishlist!',
          'success'
        );
      });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId,
      title: product.title,
      image: product.images?.length > 0 ? product.images[0]?.url : '',
      price: product.salePrice || product.price,
      subtotal: product.price,
      quantity,
      sku: productId,
    };

    Promise.resolve()
      .then(() => dispatch(addItem(cartItem)))
      .catch((error) => addToast('Failed to add to cart: ' + error.message, 'error'))
      .finally(() => addToast('Product added to cart!', 'success'));
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const existingIds = getStoredCompareIds();
    if (existingIds.includes(productId)) {
      navigate(`/product-comparison?products=${existingIds.join(',')}`);
      return;
    }
    if (existingIds.length >= MAX_COMPARE_PRODUCTS) {
      addToast(
        `You can compare up to ${MAX_COMPARE_PRODUCTS} products at a time. Remove one first.`,
        'warning'
      );
      return;
    }

    const updatedIds = saveCompareIds([...existingIds, productId]);
    navigate(`/product-comparison?products=${updatedIds.join(',')}`);
  };

  const handleQuickView = () => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  return (
    <>
      <div className="col">
        <div className="card rounded-0 product-card">
          <div className="card-header bg-transparent border-bottom-0">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Compare */}
              <button
                onClick={handleCompare}
                className="btn btn-link p-0 text-decoration-none"
                title="Compare"
              >
                <div className="product-compare">
                  <span>
                    <i className="bx bx-git-compare" /> Compare
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
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <i className={`bx ${isInWishlist ? 'bxs-heart text-danger' : 'bx-heart'}`} />
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
              src={productImage}
              className="card-img-top"
              alt={product.title}
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
                <h6 className="product-name mb-2">{product.title}</h6>
              </Link>

              {/* Price and Rating */}
              <div className="d-flex align-items-center">
                <div className="mb-1 product-price">
                  {hasDiscount && (
                    <span className="me-1 text-decoration-line-through text-muted">
                      ${product.price?.toFixed(2)}
                    </span>
                  )}
                  <span className="text-white fs-5">${currentPrice?.toFixed(2)}</span>
                </div>
                <div className="cursor-pointer ms-auto">
                  {renderStars(product.rating || 4)}
                </div>
              </div>

              {/* Stock Status */}
              {product.quantity > 0 && (
                <div className="mt-2">
                  <small className={`text-${product.quantity < 10 ? 'warning' : 'success'}`}>
                    {product.quantity < 10 ? `Only ${product.quantity} left!` : 'In Stock'}
                  </small>
                </div>
              )}
            </div>

            {/* Product Actions */}
            <div className="product-action mt-2">
              <div className="d-grid gap-2">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-light btn-ecomm"
                  disabled={isAddingToCart || !product.quantity}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bx bxs-cart-add" />{' '}
                      {product.quantity ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>

                <button onClick={handleQuickView} className="btn btn-link btn-ecomm">
                  <i className="bx bx-zoom-in" /> Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setShowQuickView(false)}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
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