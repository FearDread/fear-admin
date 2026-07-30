'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Toast, type ToastType } from '@/components/common/Toast';
import { addItem } from '@/lib/redux/slices/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '@/lib/redux/slices/wishSlice';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import ProductQuickView from './ProductQuickView';

const MAX_COMPARE_PRODUCTS = 4;
const COMPARE_STORAGE_KEY = 'comparisonProductIds';

export interface Product {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  categoryId?: string;
  price?: number;
  salePrice?: number;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  deliveryInfo?: string;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
  images?: { url: string }[];
  image?: string;
  [key: string]: unknown;
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export const ProductCard = (product: Product) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity] = useState(1);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const productId = (product._id || product.id) as string;
  const detailsLink = `/product/${productId}`;
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]?.url
      : product.image || '/assets/images/fear/fear-dark-bg.jpg';
  const hasDiscount = !!(product.salePrice && product.salePrice < (product.price ?? Infinity));
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - (product.salePrice as number) / (product.price as number)) * 100)
    : 0;

  const isInWishlist = useAppSelector((state) => selectIsInWishlist(state, productId));

  const renderStars = (rating = 4) =>
    Array.from({ length: 5 }, (_, i) => (
      <i
        key={i + 1}
        className={`bx bxs-star ${i + 1 <= rating ? 'text-warning' : 'text-light-4'}`}
      />
    ));

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const getStoredCompareIds = (): string[] => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveCompareIds = (ids: string[]) => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
    return ids;
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      const from = encodeURIComponent(window.location.pathname);
      const message = encodeURIComponent('Please login to add items to your wishlist');
      router.push(`/login?from=${from}&message=${message}`);
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
      .catch((error: Error) => addToast('Failed to update wishlist: ' + error.message, 'error'))
      .finally(() => {
        setIsAddingToWishlist(false);
        addToast(isInWishlist ? 'Removed from Wishlist!' : 'Product added to Wishlist!', 'success');
      });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: productId,
      productId,
      title: product.title,
      image: product.images && product.images.length > 0 ? product.images[0]?.url : '',
      price: product.salePrice || product.price,
      subtotal: product.price,
      quantity,
      sku: productId,
    };

    Promise.resolve()
      .then(() => dispatch(addItem(cartItem)))
      .catch((error: Error) => addToast('Failed to add to cart: ' + error.message, 'error'))
      .finally(() => addToast('Product added to cart!', 'success'));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const existingIds = getStoredCompareIds();
    if (existingIds.includes(productId)) {
      router.push(`/product-comparison?products=${existingIds.join(',')}`);
      return;
    }
    if (existingIds.length >= MAX_COMPARE_PRODUCTS) {
      addToast(
        `You can compare up to ${MAX_COMPARE_PRODUCTS} products at a time. Remove one first.`,
        'warning',
      );
      return;
    }

    const updatedIds = saveCompareIds([...existingIds, productId]);
    router.push(`/product-comparison?products=${updatedIds.join(',')}`);
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

          <Link href={detailsLink}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={productImage} className="card-img-top" alt={product.title} />
          </Link>

          <div className="card-body">
            <div className="product-info">
              <Link href={`/shop?category=${product.categoryId || ''}`}>
                <p className="product-catergory font-13 mb-1">{product.category || 'General'}</p>
              </Link>

              <Link href={detailsLink}>
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
                <div className="cursor-pointer ms-auto">{renderStars(product.rating || 4)}</div>
              </div>

              {/* Stock Status */}
              {product.quantity && product.quantity > 0 ? (
                <div className="mt-2">
                  <small className={`text-${product.quantity < 10 ? 'warning' : 'success'}`}>
                    {product.quantity < 10 ? `Only ${product.quantity} left!` : 'In Stock'}
                  </small>
                </div>
              ) : null}
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
          isOpen={showQuickView}
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
