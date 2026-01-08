import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from "../components/common/Breadcrumbs";
import {
  selectSortedProducts,
  selectFilteredProducts,
  selectProductById,
  fetchProducts,
} from '../features/products/slice';
import {
  addItem,
  selectCartItems,
  selectCartItemCount,
  selectIsInCart,
} from '../features/cart/slice';
import {
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistLoading,
  selectWishlistSorting,
  selectWishlistError,
  updateItemCount,
  selectWishlistTotalValue,
  removeFromWishlist,
  clearWishlist,
  setSorting,
} from "../features/wishlist/slice";
import ProductCard from "../components/products/ProductCard";
import ProductWishlistCard from "../components/products/ProductWishlist";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const wishlistError = useSelector(selectWishlistError);
  const wishlistSorting = useSelector(selectWishlistSorting);
  const wishlistTotalValue = useSelector(selectWishlistTotalValue);
  
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartItemCount);

  // Local state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [localSortBy, setLocalSortBy] = useState('addedAt');

  // Load products on mount
  useEffect(() => {
    if (wishlistItems.length === 0) {
      //dispatch(fetchProducts()).catch(err => {

      //});
      console.log('whishlist items = ', wishlistItems);
    }
  }, []);

  // Update item count when wishlist changes
  useEffect(() => {
    dispatch(updateItemCount());
  }, [wishlistItems.length]);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId) => {
    const product = wishlistItems.find(item => 
      item.productId === productId || item.id === productId
    );
    
    if (window.confirm(`Remove "${product?.title || product?.name}" from wishlist?`)) {
      dispatch(removeFromWishlist(productId));
      setToastMessage('Item removed from wishlist');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Handle clear wishlist
  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist());
      setToastMessage('Wishlist cleared');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Handle add all to cart
  const handleAddAllToCart = () => {
    let addedCount = 0;
    
    wishlistItems.forEach(product => {
      const inCart = cartItems.some(item => 
        item.productId === product.id || item.id === product.id
      );
      
      if (!inCart && product.quantity > 0) {
        dispatch(addItem({
          productId: product.id || product.productId,
          id: product.id || product.productId,
          name: product.title || product.name,
          title: product.title || product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image,
          images: product.images,
          quantity: 1,
          category: product.category,
          sku: product.sku,
        }));
        addedCount++;
      }
    });

    if (addedCount > 0) {
      dispatch(clearWishlist());
      setToastMessage(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/cart');
      }, 2000);
    } else {
      setToastMessage('No items to add (already in cart or out of stock)');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Sort wishlist items
  const getSortedItems = () => {
    const items = [...wishlistItems];
    
    switch (localSortBy) {
      case 'price-low':
        return items.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return items.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name':
        return items.sort((a, b) => 
          (a.title || a.name || '').localeCompare(b.title || b.name || '')
        );
      case 'addedAt':
      default:
        return items.sort((a, b) => 
          new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
        );
    }
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setLocalSortBy(value);
    
    // Update Redux state if needed
    const sortConfig = {
      'price-low': { sortBy: 'price', sortOrder: 'asc' },
      'price-high': { sortBy: 'price', sortOrder: 'desc' },
      'name': { sortBy: 'title', sortOrder: 'asc' },
      'addedAt': { sortBy: 'addedAt', sortOrder: 'desc' },
    };
    
    dispatch(setSorting(sortConfig[value]));
  };

  const sortedItems = getSortedItems();

  // Check if product is in cart
  const checkIsInCart = (productId) => {
    return cartItems.some(item => 
      item.productId === productId || item.id === productId
    );
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">
              <i className="bx bx-heart me-2"></i>
              Wishlist ({wishlistCount})
            </h3>
            <div className="ms-auto">
              <Breadcrumbs 
                items={[
                  { label: 'Home', path: '/', icon: 'bx bx-home' },
                  { label: 'Products', path: '/shop', icon: 'bx bx-shopping-bag' },
                  { label: 'Wishlist', path: '/wishlist', icon: 'bx bx-heart', isActive: true }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      {showSuccessToast && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 9999 }}
        >
          <div className="toast show bg-success text-white" role="alert">
            <div className="toast-body">
              <i className="bx bx-check-circle me-2"></i>
              {toastMessage}
            </div>
          </div>
        </div>
      )}

      {/* Main Wishlist Section */}
      <section className="py-4">
        <div className="container">
          {wishlistLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading wishlist...</p>
            </div>
          ) : wishlistError ? (
            <div className="alert alert-danger">
              <i className="bx bx-error-circle me-2"></i>
              {wishlistError}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-heart display-1 text-muted mb-3"></i>
              <h4 className="mb-3">Your Wishlist is Empty</h4>
              <p className="text-muted mb-4">
                Start adding products you love to your wishlist
              </p>
              <Link to="/shop" className="btn btn-dark btn-ecomm">
                <i className="bx bx-shopping-bag me-2"></i>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Actions Bar */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div className="d-flex gap-2 align-items-center">
                  <span className="text-muted">
                    <strong>{wishlistCount}</strong> {wishlistCount === 1 ? 'item' : 'items'}
                  </span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={localSortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="addedAt">Recently Added</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                  </select>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    onClick={handleAddAllToCart}
                    className="btn btn-primary btn-sm"
                    disabled={wishlistItems.length === 0}
                  >
                    <i className="bx bx-cart me-1"></i>
                    Add All to Cart
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="btn btn-outline-danger btn-sm"
                    disabled={wishlistItems.length === 0}
                  >
                    <i className="bx bx-trash me-1"></i>
                    Clear Wishlist
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="product-grid">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                  {sortedItems.map((product) => (

                    <ProductWishlistCard
                      key={product.id || product.productId}
                      product={product}
                      isInCart={checkIsInCart(product._id || product.productId)}
                    />

                  ))}
                </div>
              </div>

              {/* Wishlist Summary */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h6 className="mb-2">
                      <i className="bx bx-list-ul me-2"></i>
                      Wishlist Summary
                    </h6>
                    <p className="text-muted small mb-1">
                      <i className="bx bx-package me-1"></i>
                      Total Items: <strong>{wishlistCount}</strong>
                    </p>
                    <p className="text-muted small mb-0">
                      <i className="bx bx-dollar me-1"></i>
                      Total Value: <strong>${wishlistTotalValue.toFixed(2)}</strong>
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end mt-3 mt-md-0">
                    <Link to="/shop" className="btn btn-dark btn-ecomm me-2">
                      <i className="bx bx-shopping-bag me-1"></i>
                      Continue Shopping
                    </Link>
                    <Link to="/cart" className="btn btn-light btn-ecomm">
                      <i className="bx bx-cart me-1"></i>
                      View Cart ({cartCount})
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Wishlist;