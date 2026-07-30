'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addItem as addToCart } from '@/lib/redux/slices/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '@/lib/redux/slices/wishSlice';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import type { Product } from './ProductCard';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickView = ({ product, isOpen, onClose }: ProductQuickViewProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const productId = (product?._id || product?.id) as string | undefined;

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInWishlist = useAppSelector((state) =>
    productId ? selectIsInWishlist(state, productId) : false,
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
    const handleEscape = (e: KeyboardEvent) => {
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

  // Don't render if no product or modal is closed
  if (!product || !isOpen) return null;

  // Product data
  const productImages = product.images || [];
  const productImage =
    (productImages[selectedImage] as { url?: string } | undefined)?.url ||
    (productImages[selectedImage] as unknown as string) ||
    product.image ||
    '/assets/images/product-gallery/01.png';

  const hasDiscount = !!(product.salePrice && product.salePrice < (product.price ?? Infinity));
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - (product.salePrice as number) / (product.price as number)) * 100)
    : 0;

  // Available sizes and colors
  const sizes = (product.sizes as string[]) || ['S', 'M', 'L', 'XS', 'XL'];
  const colors = (product.colors as string[]) || ['primary', 'danger', 'success', 'warning'];

  // Render stars
  const renderStars = (rating = 4) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`bx bxs-star ${i <= rating ? 'text-warning' : 'text-light-4'}`} />,
      );
    }
    return stars;
  };

  const handleAddToCart = async () => {
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        id: productId as string,
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

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      onClose();
      const from = encodeURIComponent(window.location.pathname);
      const message = encodeURIComponent('Please login to add items to your wishlist');
      router.push(`/login?from=${from}&message=${message}`);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      const wishlistItem = {
        id: productId as string,
        productId,
        name: product.title || product.name,
        price: currentPrice,
        image: productImage,
        category: product.category,
        inStock: product.inStock,
      };

      if (isInWishlist) {
        dispatch(removeFromWishlist(productId as string));
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

  const handleViewDetails = () => {
    onClose();
    router.push(`/product/${productId}`);
  };

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
              />

              <div className="row g-0">
                {/* Image Gallery */}
                <div className="col-12 col-lg-6">
                  <div className="image-zoom-section">
                    {/* Badges */}
                    <div
                      className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2"
                      style={{ zIndex: 10 }}
                    >
                      {hasDiscount && <span className="badge bg-danger">-{discountPercent}%</span>}
                      {!product.inStock && <span className="badge bg-dark">Out of Stock</span>}
                    </div>

                    {/* Main Image */}
                    <div className="product-gallery border mb-3 p-3">
                      <div className="item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                        {productImages.map((img, index) => {
                          const thumbUrl =
                            (img as { url?: string })?.url ?? (img as unknown as string);
                          return (
                            <button
                              key={index}
                              type="button"
                              className={`owl-thumb-item ${selectedImage === index ? 'active border-primary' : ''}`}
                              onClick={() => setSelectedImage(index)}
                              style={{
                                border: selectedImage === index ? '2px solid' : '1px solid #ddd',
                                padding: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={thumbUrl}
                                alt={`Thumbnail ${index + 1}`}
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-12 col-lg-6">
                  <div className="product-info-section p-3">
                    {/* Brand */}
                    {product.brand ? (
                      <div className="mb-2">
                        <span className="badge bg-secondary">{product.brand as string}</span>
                      </div>
                    ) : null}

                    {/* Product Title */}
                    <h3 className="mt-3 mt-lg-0 mb-0">{product.title || product.name}</h3>

                    {/* Rating */}
                    <div className="product-rating d-flex align-items-center mt-2">
                      <div className="rates cursor-pointer font-13">
                        {renderStars((product.rating as number) || 4)}
                      </div>
                      <div className="ms-1">
                        <p className="mb-0">({(product.reviewCount as number) || 24} Ratings)</p>
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
                          In Stock ({(product.quantity as number) || 0} available)
                        </span>
                      ) : (
                        <span className="badge bg-danger">Out of Stock</span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mt-3">
                      <h6>Description:</h6>
                      <p className="mb-0">
                        {(product.description as string) ||
                          (product.shortDescription as string) ||
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
                      {product.deliveryInfo ? (
                        <>
                          <dt className="col-sm-3">Delivery</dt>
                          <dd className="col-sm-9">{product.deliveryInfo as string}</dd>
                        </>
                      ) : null}
                    </dl>

                    {/* Options */}
                    <div className="row row-cols-auto align-items-center mt-3">
                      {/* Quantity */}
                      <div className="col">
                        <label className="form-label">Quantity</label>
                        <select
                          className="form-select form-select-sm"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                          disabled={!product.inStock}
                        >
                          {[...Array(Math.min((product.quantity as number) || 5, 10))].map(
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ),
                          )}
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
                              <option key={size} value={size}>
                                {size}
                              </option>
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
                              />
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
                            <span className="spinner-border spinner-border-sm me-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bx bxs-cart-add" />
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
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className={`bx ${isInWishlist ? 'bxs-heart' : 'bx-heart'}`} />
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
                        <i className="bx bx-right-arrow-alt me-1" />
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
