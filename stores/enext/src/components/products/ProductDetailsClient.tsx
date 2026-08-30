'use client';

// components/products/ProductDetailsClient.tsx
//
// Converted from src/components/products/ProductDetails.jsx
//
// Key changes vs the CRA/classic-Redux version:
//   • useParams()      -> `id` is now a prop, passed down from the server
//                         component at app/product/[id]/page.tsx
//   • useNavigate()     -> useRouter() from 'next/navigation'
//   • <Link> (rrd)      -> <Link> from 'next/link'
//   • dispatch(thunk)   -> RTK Query hooks (useXQuery / useXMutation)
//   • useSelector(...)  -> data comes straight off the query hooks below;
//                         derived booleans (isInCart, isBrandFav, etc.) are
//                         computed locally with useMemo instead of reading
//                         from hand-written selectors.
//   • `initialProduct`  -> seeds the first render so SSR/ISR output already
//                         has real content for SEO; the query hook takes
//                         over (and refetches) once mounted in the browser.

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  useGetProductByIdQuery,
  type Product,
} from '@/lib/redux/api/productsApi';
import { useGetCategoryByIdQuery } from '@/lib/redux/api/categoriesApi';
import {
  useGetBrandByIdQuery,
  useGetFavoriteBrandIdsQuery,
  useToggleBrandFavoriteMutation,
} from '@/lib/redux/api/brandsApi';
import {
  useGetCartQuery,
  useAddItemMutation,
} from '@/lib/redux/api/cartApi';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} from '@/lib/redux/api/wishlistApi';
import {
  useGetProductReviewsQuery,
  useSubmitReviewMutation,
} from '@/lib/redux/api/reviewApi';

import Toast from '@/components/common/Toast';
import ImageGallery from '@/components/common/ImageGallery';
import ProductCarousel from '@/components/products/ProductCarousel';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ReviewFormState {
  userName: string;
  email: string;
  rating: number;
  title: string;
  content: string;
}

interface ProductDetailsClientProps {
  id: string;
  initialProduct: Product;
}

export default function ProductDetailsClient({
  id,
  initialProduct,
}: ProductDetailsClientProps) {
  const router = useRouter();

  // ── Toast helpers ─────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (message: string, type: ToastItem['type']) => {
    const tid = Date.now();
    setToasts((prev) => [...prev, { id: tid, message, type }]);
  };
  const removeToast = (tid: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== tid));

  // ── Local UI state ────────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'more-info' | 'tags' | 'reviews'
  >('description');
  const [hoverStar, setHoverStar] = useState(0);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    userName: '',
    email: '',
    rating: 5,
    title: '',
    content: '',
  });

  // ── RTK Query: product ────────────────────────────────────────────────
  // `initialProduct` (from the server component) is the fallback used for
  // the very first render, so ISR/SSR HTML is fully populated. Once this
  // mounts in the browser the query fires for real and takes over.
  const {
    data: product = initialProduct,
    isLoading: loading,
    isError,
    error,
    refetch: refetchProduct,
  } = useGetProductByIdQuery(id);

  // ── RTK Query: dependent lookups ─────────────────────────────────────
  const { data: category } = useGetCategoryByIdQuery(product?.categoryId ?? '', {
    skip: !product?.categoryId,
  });

  const { data: brand } = useGetBrandByIdQuery(product?.brandId ?? '', {
    skip: !product?.brandId,
  });

  const { data: favoriteBrandIds = [] } = useGetFavoriteBrandIdsQuery(
    undefined,
    { skip: !product?.brandId },
  );
  const isBrandFav = !!product?.brandId && favoriteBrandIds.includes(product.brandId);

  const { data: cart } = useGetCartQuery();
  const cartItem = useMemo(
    () => cart?.items.find((item) => item.productId === product?._id),
    [cart, product?._id],
  );
  const isInCart = !!cartItem;

  const { data: wishlist = [] } = useGetWishlistQuery();
  const wishlistEntry = useMemo(
    () => wishlist.find((w) => w.productId === product?._id),
    [wishlist, product?._id],
  );
  const isInWishlist = !!wishlistEntry;

  const { data: reviews = [], isFetching: reviewsLoading } =
    useGetProductReviewsQuery(product?._id ?? '', { skip: !product?._id });

  // ── Mutations ─────────────────────────────────────────────────────────
  const [addItem] = useAddItemMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();
  const [toggleBrandFavorite] = useToggleBrandFavoriteMutation();
  const [submitReview] = useSubmitReviewMutation();

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(
      Math.max(
        1,
        Math.min(parseInt(e.target.value, 10) || 1, product?.quantity || 999),
      ),
    );
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem({
        productId: product._id,
        quantity,
        name: product.title,
        image: product.images?.[0]?.url ?? '',
        price: product.salePrice ?? product.price,
        sku: product.sku,
      }).unwrap();
      addToast('Added to cart!', 'success');
    } catch {
      addToast('Could not add to cart. Please try again.', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      if (isInWishlist && wishlistEntry) {
        await removeFromWishlist(wishlistEntry.id).unwrap();
        addToast('Removed from wishlist', 'info');
      } else {
        await addToWishlist({
          id: product.id ?? product._id,
          productId: product._id,
          title: product.title,
          image: product.images?.[0]?.url ?? '',
          price: product.salePrice ?? product.price,
          originalPrice: product.price,
          rating: product.rating,
          sku: product.sku,
        }).unwrap();
        addToast('Added to wishlist!', 'success');
      }
    } catch {
      addToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handleMoveToCart = async () => {
    if (!product || !isInWishlist) return;
    try {
      await moveToCart({ productId: product._id, quantity: 1 }).unwrap();
      addToast('Moved to cart!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Could not move item to cart.', 'error');
    }
  };

  const handleBrandFavToggle = async () => {
    if (!product?.brandId) return;
    try {
      await toggleBrandFavorite(product.brandId).unwrap();
    } catch {
      addToast('Could not update favourite brand.', 'error');
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = window.location.href;
    const text = `Check out ${product?.title || 'this product'}`;
    const urls: Record<typeof platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleReviewChange = <K extends keyof ReviewFormState>(
    field: K,
    value: ReviewFormState[K],
  ) => setReviewForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmitReview = async () => {
    if (!product?._id) return;
    if (!reviewForm.userName || !reviewForm.email || !reviewForm.content) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      await submitReview({
        productId: product._id,
        username: reviewForm.userName,
        email: reviewForm.email,
        rating: reviewForm.rating,
        title: reviewForm.title || undefined,
        comment: reviewForm.content,
      }).unwrap();

      setReviewForm({ userName: '', email: '', rating: 5, title: '', content: '' });
      addToast('Review submitted!', 'success');
    } catch {
      addToast('Failed to submit review. Please try again.', 'error');
    }
  };

  // ── Derived values ────────────────────────────────────────────────────
  const hasDiscount = !!product?.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - (product!.salePrice as number) / product!.price) * 100)
    : 0;

  const Stars = ({ rating }: { rating: number }) => (
    <div className="pd-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`pd-star${n <= rating ? ' filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );

  // ── State screens ─────────────────────────────────────────────────────
  if (loading && !product) {
    return (
      <div className="pd-page">
        <div className="efear-container">
          <div className="pd-state-screen">
            <div className="pd-spinner" />
            <p className="pd-state-body">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !product) {
    return (
      <div className="pd-page">
        <div className="efear-container">
          <div className="pd-state-screen">
            <div className="pd-state-icon">⚠</div>
            <h2 className="pd-state-title">Error Loading Product</h2>
            <p className="pd-state-body">
              {(error as { message?: string })?.message ??
                'Something went wrong loading this product.'}
            </p>
            <button
              className="cart-dd-btn-primary"
              style={{ padding: '.75rem 1.5rem' }}
              onClick={() => refetchProduct()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="efear-container">
          <div className="pd-state-screen">
            <div className="pd-state-icon">🔍</div>
            <h2 className="pd-state-title">Product Not Found</h2>
            <p className="pd-state-body">
              The product you're looking for doesn't exist.
            </p>
            <button
              className="cart-dd-btn-primary"
              style={{ padding: '.75rem 1.5rem' }}
              onClick={() => router.push('/shop')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────
  return (
    <>
      {/* Breadcrumb */}
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link href="/" className="co-crumb-link">
              Home
            </Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/shop" className="co-crumb-link">
              Shop
            </Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="pd-page">
        <div className="efear-container">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <div className="pd-hero">
            <div className="pd-gallery-col">
              <ImageGallery images={product.images} productTitle={product.title} />
            </div>

            <div className="pd-info-col">
              {brand && (
                <div className="pd-brand-row">
                  <span className="pd-brand-badge">{brand.name}</span>
                  <button
                    className={`pd-brand-fav${isBrandFav ? ' active' : ''}`}
                    onClick={handleBrandFavToggle}
                    title={isBrandFav ? 'Remove from favourites' : 'Favourite brand'}
                  >
                    {isBrandFav ? '♥' : '♡'}
                  </button>
                </div>
              )}

              <h1 className="pd-title">{product.title}</h1>

              <div className="pd-rating-row">
                <Stars rating={product.rating || 4} />
                <span className="pd-rating-count">
                  ({product.reviewCount ?? reviews.length} ratings)
                </span>
              </div>

              <div className="pd-price-row">
                {hasDiscount && (
                  <span className="pd-price-original">${product.price?.toFixed(2)}</span>
                )}
                <span className="pd-price-main">
                  ${(product.salePrice ?? product.price)?.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="pd-price-badge">{discountPercent}% OFF</span>
                )}
              </div>

              <div className="pd-badges">
                {product.quantity > 0 ? (
                  <span className="pd-badge in-stock">
                    ✓ In Stock ({product.quantity})
                  </span>
                ) : (
                  <span className="pd-badge out-of-stock">Out of Stock</span>
                )}
                {isInCart && (
                  <span className="pd-badge in-cart">In Cart ×{cartItem?.quantity}</span>
                )}
                {isInWishlist && <span className="pd-badge in-wishlist">♥ Wishlisted</span>}
              </div>

              <p className="pd-desc">
                {product.description ||
                  product.shortDescription ||
                  'High-performance tactical gear built for the field. Precision-engineered for reliability in every condition.'}
              </p>

              <div className="pd-spec-table">
                <span className="pd-spec-key">SKU</span>
                <span className="pd-spec-val">#{product.sku || product._id}</span>
                <span className="pd-spec-key">Category</span>
                <span className="pd-spec-val">{category?.name ?? 'General'}</span>
                {product.deliveryInfo && (
                  <>
                    <span className="pd-spec-key">Delivery</span>
                    <span className="pd-spec-val">{product.deliveryInfo}</span>
                  </>
                )}
              </div>

              <div className="pd-qty-row">
                <span className="pd-qty-label">Qty</span>
                <select
                  className="pd-qty-select"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!product.quantity}
                >
                  {[...Array(Math.min(product.quantity || 5, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pd-actions">
                <button
                  onClick={handleAddToCart}
                  className="cart-dd-btn-primary"
                  disabled={!product.quantity}
                  style={{ padding: '.75rem 1.5rem', fontSize: '.72rem', letterSpacing: '.1em' }}
                >
                  {isInCart ? '✓ Added to Cart' : '+ Add to Cart'}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="cart-dd-btn-ghost"
                  style={{ padding: '.75rem 1.25rem', fontSize: '.72rem', letterSpacing: '.1em' }}
                >
                  {isInWishlist ? '♥ In Wishlist' : '♡ Wishlist'}
                </button>
                {isInWishlist && (
                  <button
                    onClick={handleMoveToCart}
                    className="cart-dd-btn-ghost"
                    disabled={!product.quantity}
                    style={{ padding: '.75rem 1.25rem', fontSize: '.72rem', letterSpacing: '.1em' }}
                  >
                    ⇄ Move to Cart
                  </button>
                )}
              </div>

              <div className="pd-hr" />

              <div className="pd-share-row">
                <span className="pd-share-label">Share</span>
                {(
                  [
                    { platform: 'facebook', label: 'f' },
                    { platform: 'twitter', label: '𝕏' },
                    { platform: 'linkedin', label: 'in' },
                  ] as const
                ).map(({ platform, label }) => (
                  <a
                    key={platform}
                    href="#"
                    className="pd-share-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShare(platform);
                    }}
                    title={`Share on ${platform}`}
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: '.65rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────────────── */}
          <div className="pd-tabs-section">
            <div className="pd-tab-bar">
              {(
                [
                  { id: 'description', label: 'Description' },
                  { id: 'more-info', label: 'More Info' },
                  { id: 'tags', label: 'Tags' },
                  { id: 'reviews', label: 'Reviews', count: reviews.length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  className={`pd-tab${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                  {'count' in tab && tab.count !== undefined && (
                    <span className="pd-tab-count">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="pd-tab-body">
              {activeTab === 'description' && (
                <>
                  <p className="pd-full-desc">
                    {product.fullDescription || product.description}
                  </p>
                  <ul className="pd-feature-list">
                    {(
                      product.features || [
                        'Shipped with board and sleeve.',
                        '30 day money back guarantee.',
                        'Packaged by hand.',
                        'Near Mint (NM) condition.',
                      ]
                    ).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </>
              )}

              {activeTab === 'more-info' && (
                <p className="pd-full-desc">
                  Shipping &amp; Packaging — Every order is shipped with a rigid backing
                  board and protective polypropylene sleeve to ensure your copy arrives
                  in perfect, collector-grade condition.
                </p>
              )}

              {activeTab === 'tags' && (
                <div className="pd-tags">
                  {(product.tags || ['Airsoft', 'Tactical', 'Outdoor', 'Gear']).map(
                    (tag, i) => (
                      <a
                        key={i}
                        href="#"
                        className="pd-tag"
                        onClick={(e) => e.preventDefault()}
                      >
                        {tag}
                      </a>
                    ),
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="pd-reviews-layout">
                  <div>
                    <p
                      style={{
                        fontFamily: "'Anton','Impact',sans-serif",
                        fontSize: '.9rem',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.92)',
                        margin: '0 0 1.25rem',
                      }}
                    >
                      {reviews.length} Reviews
                    </p>

                    {reviewsLoading && (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                        <div className="pd-spinner" />
                      </div>
                    )}

                    {!reviewsLoading && reviews.length === 0 && (
                      <div className="pd-review-empty">
                        No reviews yet — be the first to review this product.
                      </div>
                    )}

                    <div className="pd-review-list">
                      {!reviewsLoading &&
                        reviews.map((review) => (
                          <div key={review.id} className="pd-review-item">
                            <div className="pd-review-header">
                              <div>
                                <p className="pd-reviewer-name">{review.username}</p>
                                <Stars rating={review.rating || 4} />
                                {review.verified && (
                                  <span className="pd-verified-badge">✓ Verified Purchase</span>
                                )}
                              </div>
                              <span className="pd-review-date">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            {review.title && <p className="pd-review-title">{review.title}</p>}
                            <p className="pd-review-body">{review.comment}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="pd-review-form">
                    <h3 className="pd-review-form-title">Write a Review</h3>

                    <div className="auth-field">
                      <label className="auth-label">
                        Your Name <span className="auth-label-req">*</span>
                      </label>
                      <input
                        type="text"
                        className="auth-input"
                        value={reviewForm.userName}
                        onChange={(e) => handleReviewChange('userName', e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">
                        Email <span className="auth-label-req">*</span>
                      </label>
                      <input
                        type="email"
                        className="auth-input"
                        value={reviewForm.email}
                        onChange={(e) => handleReviewChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">
                        Rating <span className="auth-label-req">*</span>
                      </label>
                      <div className="pd-star-picker" style={{ marginBottom: '.25rem' }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={`pd-star interactive${
                              n <= (hoverStar || reviewForm.rating) ? ' filled' : ''
                            }`}
                            style={{ fontSize: '1.2rem' }}
                            onClick={() => handleReviewChange('rating', n)}
                            onMouseEnter={() => setHoverStar(n)}
                            onMouseLeave={() => setHoverStar(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">
                        Review <span className="auth-label-req">*</span>
                      </label>
                      <textarea
                        className="auth-input"
                        rows={4}
                        style={{ resize: 'vertical', height: 'auto' }}
                        value={reviewForm.content}
                        onChange={(e) => handleReviewChange('content', e.target.value)}
                        placeholder="Share your thoughts about this product..."
                      />
                    </div>

                    <button
                      type="button"
                      className="auth-submit"
                      style={{ marginTop: '.75rem' }}
                      onClick={handleSubmitReview}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <ProductCarousel />
    </>
  );
}