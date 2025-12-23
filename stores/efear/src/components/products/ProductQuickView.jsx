// components/products/ProductQuickView.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addItem as addToCart } from '../../features/cart/slice';
import { 
  addToWishlist, 
  removeFromWishlist,
  selectIsInWishlist 
} from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/user/slice';

/**
 * ProductQuickView Component
 * Modal for quick product preview with add to cart/wishlist functionality
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal callback
 */
export const ProductQuickView = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInWishlist = useSelector(state => 
    selectIsInWishlist(state, product?._id || product?.id)
  );

  // Local state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Reset state when modal opens/product changes
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize('');
      setSelectedColor('');
    }
  }, [isOpen, product]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render if no product
  if (!product) return null;

  // Product data
  const productId = product._id || product.id;
  const productImages = product.images || [];
  const productImage = productImages[selectedImage]?.url || 
                       productImages[selectedImage] || 
                       product.image || 
                       'assets/images/product-gallery/01.png';
  
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  // Available sizes and colors
  const sizes = product.sizes || ['S', 'M', 'L', 'XS', 'XL'];
  const colors = product.colors || ['primary', 'danger', 'success', 'warning'];

  // Render stars
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

  /**
   * Handle Add to Cart
   */
  const handleAddToCart = async () => {
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        productId,
        product: {
          id: productId,
          name: product.title || product.name,
          price: currentPrice,
          image: productImage,
          sku: product.sku,
        },
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: currentPrice,
      };

      dispatch(addToCart(cartItem));
      
      // Show success message (you can replace with toast)
      alert(`Added ${quantity} item(s) to cart!`);
      
      // Optionally close modal after adding
      // onClose();
      
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handle Wishlist Toggle
   */
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login', { 
        state: { 
          from: window.location.pathname,
          message: 'Please login to add items to your wishlist' 
        } 
      });
      return;
    }

    setIsAddingToWishlist(true);

    try {
      const wishlistItem = {
        id: productId,
        productId,
        name: product.title || product.name,
        price: currentPrice,
        image: productImage,
        category: product.category,
        inStock: product.inStock,
      };

      if (isInWishlist) {
        dispatch(removeFromWishlist(productId));
      } else {
        dispatch(addToWishlist(wishlistItem));
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  /**
   * Handle View Full Details
   */
  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${productId}`);
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal fade show d-block" 
        id="QuickViewProduct"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-xl-down"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content bg-dark-4 rounded-0 border-0">
            <div className="modal-body">
              {/* Close Button */}
              <button 
                type="button" 
                className="btn-close float-end" 
                onClick={onClose}
                aria-label="Close"
              ></button>

              <div className="row g-0">
                {/* Image Gallery */}
                <div className="col-12 col-lg-6">
                  <div className="image-zoom-section">
                    {/* Badges */}
                    <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2" style={{ zIndex: 10 }}>
                      {hasDiscount && (
                        <span className="badge bg-danger">-{discountPercent}%</span>
                      )}
                      {!product.inStock && (
                        <span className="badge bg-dark">Out of Stock</span>
                      )}
                    </div>

                    {/* Main Image */}
                    <div className="product-gallery border mb-3 p-3">
                      <div className="item">
                        <img 
                          src={productImage}
                          className="img-fluid" 
                          alt={product.title || product.name}
                          style={{ maxHeight: '500px', width: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {productImages.length > 1 && (
                      <div className="owl-thumbs d-flex justify-content-center gap-2">
                        {productImages.map((img, index) => (
                          <button 
                            key={index}
                            className={`owl-thumb-item ${selectedImage === index ? 'active border-primary' : ''}`}
                            onClick={() => setSelectedImage(index)}
                            style={{ 
                              border: selectedImage === index ? '2px solid' : '1px solid #ddd',
                              padding: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            <img 
                              src={img.url || img}
                              alt={`Thumbnail ${index + 1}`}
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-12 col-lg-6">
                  <div className="product-info-section p-3">
                    {/* Brand */}
                    {product.brand && (
                      <div className="mb-2">
                        <span className="badge bg-secondary">{product.brand}</span>
                      </div>
                    )}

                    {/* Product Title */}
                    <h3 className="mt-3 mt-lg-0 mb-0">
                      {product.title || product.name}
                    </h3>

                    {/* Rating */}
                    <div className="product-rating d-flex align-items-center mt-2">
                      <div className="rates cursor-pointer font-13">
                        {renderStars(product.rating || 4)}
                      </div>
                      <div className="ms-1">
                        <p className="mb-0">({product.reviewCount || 24} Ratings)</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="d-flex align-items-center mt-3 gap-2">
                      {hasDiscount && (
                        <h5 className="mb-0 text-decoration-line-through text-light-3">
                          ${product.price?.toFixed(2)}
                        </h5>
                      )}
                      <h4 className="mb-0">${currentPrice?.toFixed(2)}</h4>
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      {product.inStock ? (
                        <span className="badge bg-success">
                          In Stock ({product.quantity || 0} available)
                        </span>
                      ) : (
                        <span className="badge bg-danger">Out of Stock</span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mt-3">
                      <h6>Description:</h6>
                      <p className="mb-0">
                        {product.description || product.shortDescription || 
                         "Virgil Abloh's Off-White is a streetwear-inspired collection that continues to break away from the conventions of mainstream fashion. Made in Italy, these black and brown Odsy-1000 low-top sneakers."}
                      </p>
                    </div>

                    {/* Product Info */}
                    <dl className="row mt-3">
                      <dt className="col-sm-3">Product ID</dt>
                      <dd className="col-sm-9">#{product.sku || productId}</dd>
                      {product.category && (
                        <>
                          <dt className="col-sm-3">Category</dt>
                          <dd className="col-sm-9">{product.category}</dd>
                        </>
                      )}
                      {product.deliveryInfo && (
                        <>
                          <dt className="col-sm-3">Delivery</dt>
                          <dd className="col-sm-9">{product.deliveryInfo}</dd>
                        </>
                      )}
                    </dl>

                    {/* Options */}
                    <div className="row row-cols-auto align-items-center mt-3">
                      {/* Quantity */}
                      <div className="col">
                        <label className="form-label">Quantity</label>
                        <select 
                          className="form-select form-select-sm"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          disabled={!product.inStock}
                        >
                          {[...Array(Math.min(product.quantity || 5, 10))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      {/* Size */}
                      {sizes && sizes.length > 0 && (
                        <div className="col">
                          <label className="form-label">Size</label>
                          <select 
                            className="form-select form-select-sm"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                          >
                            <option value="">Select</option>
                            {sizes.map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Colors */}
                      {colors && colors.length > 0 && (
                        <div className="col">
                          <label className="form-label">Colors</label>
                          <div className="color-indigators d-flex align-items-center gap-2">
                            {colors.map((color, index) => (
                              <div 
                                key={index}
                                className={`color-indigator-item bg-${color} ${selectedColor === color ? 'border border-light border-3' : ''}`}
                                onClick={() => setSelectedColor(color)}
                                style={{ cursor: 'pointer' }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-3">
                      <button 
                        onClick={handleAddToCart}
                        className="btn btn-white btn-ecomm"
                        disabled={isAddingToCart || !product.inStock}
                      >
                        {isAddingToCart ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bx bxs-cart-add"></i>
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button 
                        onClick={handleWishlistToggle}
                        className={`btn btn-ecomm ${isInWishlist ? 'btn-danger' : 'btn-light'}`}
                        disabled={isAddingToWishlist}
                      >
                        {isAddingToWishlist ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <>
                            <i className={`bx ${isInWishlist ? 'bxs-heart' : 'bx-heart'}`}></i>
                            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                          </>
                        )}
                      </button>
                    </div>

                    {/* View Full Details Link */}
                    <div className="mt-3">
                      <button 
                        onClick={handleViewDetails}
                        className="btn btn-link text-decoration-none p-0"
                      >
                        <i className="bx bx-right-arrow-alt me-1"></i>
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductQuickView;