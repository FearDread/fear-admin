'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { type Product } from '@/types/product';
import { useGetProductByIdQuery } from '@/lib/redux/api/productsApi';
import { useGetCategoryByIdQuery } from '@/lib/redux/api/categoriesApi';
import {
  useGetBrandByIdQuery,
  useGetFavoriteBrandIdsQuery,
  useToggleFavoriteBrandMutation,
} from '@/lib/redux/api/brandsApi';
import { useGetCartQuery, useAddToCartMutation } from '@/lib/redux/api/cartApi';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} from '@/lib/redux/api/wishlistApi';
import { useGetProductReviewsQuery, useSubmitReviewMutation } from '@/lib/redux/api/reviewApi';

import Toast from '@/components/common/Toast';
import ImageGallery from '@/components/products/ImageGallery';
import ProductCarousel from '@/components/products/ProductCarousel';
import { productStyles } from '@/components/products/productStyles';

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

type TabId = 'description' | 'details' | 'reviews';

interface ProductDetailsClientProps {
  id: string;
  initialProduct: Product;
}

// Defined at module scope (not inside the component) so it isn't re-created —
// and remounted — on every render.
const Stars = ({ rating, label }: { rating: number; label?: string }) => (
  <span className="pd-stars" role="img" aria-label={label ?? `${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`pd-star${n <= Math.round(rating) ? ' filled' : ''}`} aria-hidden="true">★</span>
    ))}
  </span>
);

const TRUST = [
  { icon: '🧤', title: 'Bagged & Boarded', sub: 'Near Mint condition' },
  { icon: '🚚', title: 'Fast Shipping', sub: 'Ships within 1–2 business days' },
  { icon: '🔄', title: '30-Day Returns', sub: 'Hassle-free refunds' },
  { icon: '🔒', title: 'Secure Checkout', sub: 'Stripe & PayPal' },
];

export default function ProductDetailsClient({ id, initialProduct }: ProductDetailsClientProps) {
  // ── Toasts ────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (message: string, type: ToastItem['type']) =>
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
  const removeToast = (tid: number) => setToasts((prev) => prev.filter((t) => t.id !== tid));

  // ── Local UI state ────────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [hoverStar, setHoverStar] = useState(0);
  const [adding, setAdding] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    userName: '', email: '', rating: 5, title: '', content: '',
  });
  const buyRowRef = useRef<HTMLDivElement>(null);

  // ── Data ──────────────────────────────────────────────────────────────
  // `initialProduct` (server-fetched) renders on first paint so the crawlable
  // HTML is fully populated; the client query then takes over.
  const { data: product = initialProduct } = useGetProductByIdQuery(id);

  const productId = (product._id ?? product.id ?? id) as string;
  const brandId = product.brandId as string | undefined;

  const { data: category } = useGetCategoryByIdQuery((product.categoryId as string) ?? '', {
    skip: !product.categoryId,
  });
  const { data: brand } = useGetBrandByIdQuery(brandId ?? '', { skip: !brandId });
  const { data: favoriteBrandIds = [] } = useGetFavoriteBrandIdsQuery(undefined, { skip: !brandId });
  const isBrandFav = !!brandId && favoriteBrandIds.includes(brandId);

  const { data: cart } = useGetCartQuery();
  const cartItem = useMemo(
    () => cart?.items.find((item) => item.productId === productId),
    [cart, productId],
  );

  const { data: wishlist = [] } = useGetWishlistQuery();
  const wishlistEntry = useMemo(
    () => wishlist.find((w) => w.productId === productId),
    [wishlist, productId],
  );

  const { data: reviews = [], isFetching: reviewsLoading } = useGetProductReviewsQuery(productId, {
    skip: !productId,
  });

  const [addItem] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();
  const [toggleBrandFavorite] = useToggleFavoriteBrandMutation();
  const [submitReview, { isLoading: submittingReview }] = useSubmitReviewMutation();

  // ── Derived ───────────────────────────────────────────────────────────
  const stock = product.quantity ?? 0;
  const maxQty = Math.max(1, Math.min(stock, 20));
  const price = product.price ?? 0;
  const salePrice = product.salePrice;
  const hasDiscount = !!salePrice && salePrice < price;
  const finalPrice = hasDiscount ? (salePrice as number) : price;
  const discountPercent = hasDiscount ? Math.round((1 - (salePrice as number) / price) * 100) : 0;
  const isInCart = !!cartItem;
  const isInWishlist = !!wishlistEntry;
  const title = product.title ?? product.name ?? 'Product';

  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => Math.round(r.rating) === n).length }));
    const avg = total ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / total : product.rating ?? 0;
    return { total, dist, avg };
  }, [reviews, product.rating]);
  const ratingCount = reviewStats.total || (product.reviewCount as number | undefined) || 0;

  const features = (product.features as string[] | undefined) ?? [];
  const tags = (product.tags as string[] | undefined) ?? [];
  const longDescription = (product.fullDescription as string | undefined) ?? product.description;

  // Show the sticky mobile buy bar only once the main buy row has scrolled away.
  useEffect(() => {
    const el = buyRowRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [productId]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!stock || adding) return;
    setAdding(true);
    try {
      // Matches AddToCartRequest exactly — server resolves name/price/image from productId.
      await addItem({ productId, quantity }).unwrap();
      addToast('Added to cart!', 'success');
    } catch {
      addToast('Could not add to cart. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (wishlistEntry) {
        await removeFromWishlist(wishlistEntry.id).unwrap();
        addToast('Removed from wishlist', 'info');
      } else {
        await addToWishlist({
          id: productId,
          productId,
          title,
          image: product.images?.[0]?.url ?? '',
          price: finalPrice,
          originalPrice: price,
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
    try {
      await moveToCart({ productId, quantity: 1 }).unwrap();
      addToast('Moved to cart!', 'success');
    } catch {
      addToast('Could not move item to cart.', 'error');
    }
  };

  const handleBrandFavToggle = async () => {
    if (!brandId) return;
    try {
      await toggleBrandFavorite({ brandId }).unwrap(); // mutation arg is { brandId }, not a bare string
    } catch {
      addToast('Could not update favourite brand.', 'error');
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${title}`);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleReviewChange = <K extends keyof ReviewFormState>(field: K, value: ReviewFormState[K]) =>
    setReviewForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmitReview = async () => {
    if (!reviewForm.userName || !reviewForm.email || !reviewForm.content) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      await submitReview({
        productId,
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

  const stockBadge =
    stock <= 0 ? (
      <span className="pd-badge out-of-stock"><span className="pd-dot" /> Out of Stock</span>
    ) : stock < 10 ? (
      <span className="pd-badge low-stock"><span className="pd-dot" /> Only {stock} left</span>
    ) : (
      <span className="pd-badge in-stock"><span className="pd-dot" /> In Stock</span>
    );

  const categoryName = category?.name ?? category?.title ?? (product.category as string | undefined);

  const cartLabel = adding ? null : isInCart ? '✓ In Cart — Add More' : '+ Add to Cart';

  return (
    <>
      <style>{productStyles}</style>

      {/* Breadcrumb (also mirrored as BreadcrumbList JSON-LD in page.tsx) */}
      <nav className="pd-crumbs" aria-label="Breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            {categoryName && (
              <li><Link href={`/shop?category=${encodeURIComponent(categoryName)}`}>{categoryName}</Link></li>
            )}
            <li aria-current="page">{title}</li>
          </ol>
        </div>
      </nav>

      <div className="pd-page">
        <div className="container">
          <div className="pd-hero">
            {/* ── Gallery ── */}
            <div className="pd-gallery-col">
              <ImageGallery
                images={product.images}
                productTitle={title}
                discountPercent={discountPercent}
                outOfStock={stock <= 0}
              />
            </div>

            {/* ── Info ── */}
            <div className="pd-info-col">
              <div className="pd-brand-row">
                {brand?.name && <span className="pd-brand-badge">{brand.name}</span>}
                {brandId && brand && (
                  <button
                    type="button"
                    className={`pd-brand-fav${isBrandFav ? ' active' : ''}`}
                    onClick={handleBrandFavToggle}
                    aria-pressed={isBrandFav}
                    title={isBrandFav ? 'Remove from favourite brands' : 'Favourite this brand'}
                  >
                    {isBrandFav ? '♥' : '♡'}
                  </button>
                )}
                {categoryName && (
                  <Link className="pd-cat-link" href={`/shop?category=${encodeURIComponent(categoryName)}`}>
                    {categoryName} →
                  </Link>
                )}
              </div>

              <h1 className="pd-title">{title}</h1>

              <div className="pd-rating-row">
                <Stars rating={reviewStats.avg || 0} />
                <a
                  href="#reviews"
                  className="pd-rating-count"
                  onClick={() => setActiveTab('reviews')}
                >
                  {ratingCount > 0 ? `${ratingCount} review${ratingCount === 1 ? '' : 's'}` : 'Be the first to review'}
                </a>
              </div>

              <div className="pd-price-panel">
                <span className="pd-price-main">${finalPrice.toFixed(2)}</span>
                {hasDiscount && <span className="pd-price-original">${price.toFixed(2)}</span>}
                {hasDiscount && <span className="pd-price-badge">{discountPercent}% off</span>}
                {hasDiscount && (
                  <span className="pd-price-save">You save ${(price - finalPrice).toFixed(2)}</span>
                )}
              </div>

              <div className="pd-badges">
                {stockBadge}
                {isInCart && <span className="pd-badge in-cart">In Cart ×{cartItem?.quantity}</span>}
                {isInWishlist && <span className="pd-badge in-wishlist">♥ Wishlisted</span>}
              </div>

              {(product.shortDescription || product.description) && (
                <p className="pd-desc">{product.shortDescription ?? product.description}</p>
              )}

              <div className="pd-spec-table">
                <span className="pd-spec-key">SKU</span>
                <span className="pd-spec-val">{product.sku ?? productId}</span>
                {categoryName && (
                  <>
                    <span className="pd-spec-key">Category</span>
                    <span className="pd-spec-val">{categoryName}</span>
                  </>
                )}
                {brand?.name && (
                  <>
                    <span className="pd-spec-key">Publisher</span>
                    <span className="pd-spec-val">{brand.name}</span>
                  </>
                )}
                {product.deliveryInfo && (
                  <>
                    <span className="pd-spec-key">Delivery</span>
                    <span className="pd-spec-val">{product.deliveryInfo}</span>
                  </>
                )}
              </div>

              {/* Buy row */}
              <div className="pd-buy-row" ref={buyRowRef}>
                <div className="pd-qty" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1 || stock <= 0}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <output aria-live="polite">{quantity}</output>
                  <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQty || stock <= 0}
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}>+</button>
                </div>

                <button
                  type="button"
                  className={`pd-btn-primary${isInCart ? ' added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={stock <= 0 || adding}
                >
                  {adding ? (<><span className="pd-spinner-inline" /> Adding…</>) : stock <= 0 ? 'Sold Out' : cartLabel}
                </button>

                <button
                  type="button"
                  className={`pd-btn-ghost${isInWishlist ? ' active' : ''}`}
                  onClick={handleToggleWishlist}
                  aria-pressed={isInWishlist}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isInWishlist ? '♥' : '♡'}<span className="d-none d-sm-inline">&nbsp;Wishlist</span>
                </button>
              </div>

              {isInWishlist && stock > 0 && (
                <button type="button" className="pd-btn-ghost" onClick={handleMoveToCart} style={{ marginBottom: '1rem' }}>
                  ⇄ Move wishlist item to cart
                </button>
              )}

              <div className="pd-trust">
                {TRUST.map((t) => (
                  <div className="pd-trust-item" key={t.title}>
                    <span className="pd-trust-icon" aria-hidden="true">{t.icon}</span>
                    <div>
                      <span className="pd-trust-title">{t.title}</span>
                      <span className="pd-trust-sub">{t.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pd-share-row">
                <span className="pd-share-label">Share</span>
                {([
                  { platform: 'facebook', label: 'f' },
                  { platform: 'twitter', label: '𝕏' },
                  { platform: 'linkedin', label: 'in' },
                ] as const).map(({ platform, label }) => (
                  <button key={platform} type="button" className="pd-share-btn"
                    onClick={() => handleShare(platform)} aria-label={`Share on ${platform}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── all panels stay in the DOM (just `hidden`) so description
               text is in the server-rendered HTML for crawlers. */}
          <section className="pd-tabs-section" id="details" aria-label="Product information">
            <div className="pd-tab-bar" role="tablist">
              {([
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Shipping & Care' },
                { id: 'reviews', label: 'Reviews', count: reviewStats.total },
              ] as { id: TabId; label: string; count?: number }[]).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  className={`pd-tab${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.count !== undefined && <span className="pd-tab-count">{tab.count}</span>}
                </button>
              ))}
            </div>

            <div className="pd-tab-body" role="tabpanel" id="panel-description" aria-labelledby="tab-description" hidden={activeTab !== 'description'}>
              {longDescription && <p className="pd-full-desc">{longDescription}</p>}
              {features.length > 0 && (
                <ul className="pd-feature-list">
                  {features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              )}
              {tags.length > 0 && (
                <div className="pd-tags">
                  {tags.map((tag) => (
                    <Link key={tag} href={`/shop?search=${encodeURIComponent(tag)}`} className="pd-tag">{tag}</Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-tab-body" role="tabpanel" id="panel-details" aria-labelledby="tab-details" hidden={activeTab !== 'details'}>
              <p className="pd-full-desc">
                Every order ships with a rigid backing board and protective polypropylene sleeve so your copy
                arrives in collector-grade condition. Orders are processed within 1–2 business days.
              </p>
              <ul className="pd-feature-list">
                <li>Near Mint (NM) condition unless the listing states otherwise.</li>
                <li>Packed by hand and inspected before shipping.</li>
                <li>30-day return window — see our <Link href="/returns">return policy</Link>.</li>
                <li>Tracking provided on every order — see our <Link href="/shipping">shipping policy</Link>.</li>
              </ul>
            </div>

            <div className="pd-tab-body" role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" hidden={activeTab !== 'reviews'}>
              <div className="pd-reviews-layout" id="reviews">
                <div>
                  {reviewStats.total > 0 && (
                    <div className="pd-review-summary">
                      <div className="pd-review-avg">
                        <span className="pd-review-avg-num">{reviewStats.avg.toFixed(1)}</span>
                        <Stars rating={reviewStats.avg} />
                        <span className="pd-review-avg-sub">{reviewStats.total} reviews</span>
                      </div>
                      <div>
                        {reviewStats.dist.map(({ n, c }) => (
                          <div className="pd-dist-row" key={n}>
                            <span>{n} ★</span>
                            <div className="pd-dist-bar"><div className="pd-dist-fill" style={{ width: `${(c / reviewStats.total) * 100}%` }} /></div>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reviewsLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                      <div className="pd-spinner" />
                    </div>
                  )}

                  {!reviewsLoading && reviews.length === 0 && (
                    <div className="pd-review-empty">No reviews yet — be the first to review this product.</div>
                  )}

                  <div className="pd-review-list">
                    {!reviewsLoading && reviews.map((review) => (
                      <article key={review.id} className="pd-review-item">
                        <div className="pd-review-header">
                          <div>
                            <p className="pd-reviewer-name">{review.username}</p>
                            <Stars rating={review.rating || 0} />
                            {review.verified && <span className="pd-verified-badge">✓ Verified Purchase</span>}
                          </div>
                          <time className="pd-review-date" dateTime={review.createdAt}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        </div>
                        {review.title && <p className="pd-review-title">{review.title}</p>}
                        <p className="pd-review-body">{review.comment}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="pd-review-form">
                  <h3 className="pd-review-form-title">Write a Review</h3>

                  <div className="pd-field">
                    <label className="pd-label" htmlFor="rv-name">Your Name *</label>
                    <input id="rv-name" className="pd-input" type="text" value={reviewForm.userName}
                      onChange={(e) => handleReviewChange('userName', e.target.value)} placeholder="Enter your name" autoComplete="name" />
                  </div>
                  <div className="pd-field">
                    <label className="pd-label" htmlFor="rv-email">Email *</label>
                    <input id="rv-email" className="pd-input" type="email" value={reviewForm.email}
                      onChange={(e) => handleReviewChange('email', e.target.value)} placeholder="Never published" autoComplete="email" />
                  </div>
                  <div className="pd-field">
                    <span className="pd-label">Rating *</span>
                    <div role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          role="radio"
                          aria-checked={reviewForm.rating === n}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                          tabIndex={0}
                          className={`pd-star interactive${n <= (hoverStar || reviewForm.rating) ? ' filled' : ''}`}
                          style={{ fontSize: '1.5rem' }}
                          onClick={() => handleReviewChange('rating', n)}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleReviewChange('rating', n)}
                          onMouseEnter={() => setHoverStar(n)}
                          onMouseLeave={() => setHoverStar(0)}
                        >★</span>
                      ))}
                    </div>
                  </div>
                  <div className="pd-field">
                    <label className="pd-label" htmlFor="rv-title">Headline</label>
                    <input id="rv-title" className="pd-input" type="text" value={reviewForm.title}
                      onChange={(e) => handleReviewChange('title', e.target.value)} placeholder="Sum it up in a few words" />
                  </div>
                  <div className="pd-field">
                    <label className="pd-label" htmlFor="rv-body">Review *</label>
                    <textarea id="rv-body" className="pd-input" rows={4} value={reviewForm.content}
                      onChange={(e) => handleReviewChange('content', e.target.value)} placeholder="Share your thoughts about this product…" />
                  </div>
                  <button type="button" className="pd-btn-primary" style={{ width: '100%' }}
                    onClick={handleSubmitReview} disabled={submittingReview}>
                    {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <div className={`pd-sticky-bar${showSticky && stock > 0 ? ' show' : ''}`} aria-hidden={!showSticky}>
        <div className="pd-sticky-info">
          <span className="pd-sticky-title">{title}</span>
          <span className="pd-sticky-price">${finalPrice.toFixed(2)}</span>
        </div>
        <button type="button" className="pd-btn-primary" onClick={handleAddToCart} disabled={adding} tabIndex={showSticky ? 0 : -1}>
          {adding ? 'Adding…' : '+ Add to Cart'}
        </button>
      </div>

      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      <ProductCarousel />
    </>
  );
}
