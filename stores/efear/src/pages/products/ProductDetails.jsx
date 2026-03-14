// components/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dispatch } from '../../features/store';
import {
    fetchProduct,
    selectCurrentProduct,
    selectProductsLoading,
    selectProductsError,
} from '../../features/products/slice';
import {
    fetchCategory,
    selectCategoryById,
} from '../../features/categories/slice';
import Toast from '../../components/common/Toast';
import {
    fetchBrand,
    selectBrandById,
    toggleFavorite as toggleBrandFavorite,
    selectIsBrandFavorite,
} from '../../features/brands/slice';
import {
    addItem,
    selectIsInCart,
    selectCartItemById,
} from '../../features/cart/slice';
import {
    addToWishlist,
    removeFromWishlist,
    selectIsInWishlist,
    moveToCart,
} from '../../features/wishlist/slice';
import {
    setViewMode,
    selectReviewsLoading,
    submitReview,
} from '../../features/review/slice';
import ReviewService from '../../features/review/service';
import ImageGallery from '../../components/common/ImageGallery';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ── Toast helpers ───────────────────────────────────────────────────────
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type) => {
        const tid = Date.now();
        setToasts(prev => [...prev, { id: tid, message, type }]);
    };
    const removeToast = (tid) => setToasts(prev => prev.filter(t => t.id !== tid));

    // ── Local UI state ───────────────────────────────────────────────────────
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [hoverStar, setHoverStar] = useState(0);
    const [reviewForm, setReviewForm] = useState({
        userName: '', email: '', rating: 5, title: '', content: '',
    });

    // ── Redux selectors ──────────────────────────────────────────────────────
    const product = useSelector(selectCurrentProduct);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const category = useSelector(state => product?.categoryId ? selectCategoryById(state, product.categoryId) : null);
    const brand = useSelector(state => product?.brandId ? selectBrandById(state, product.brandId) : null);
    const isBrandFav = useSelector(state => product?.brandId ? selectIsBrandFavorite(state, product.brandId) : false);
    const isInCart = useSelector(state => product?._id ? selectIsInCart(state, product._id) : false);
    const cartItem = useSelector(state => product?._id ? selectCartItemById(state, product._id) : null);
    const isInWishlist = useSelector(state => product?.id ? selectIsInWishlist(state, product.id) : false);
    const reviewsLoading = useSelector(selectReviewsLoading);
    const productReviews = useSelector(state => state.product?.reviews);

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (id && (product === null || product._id !== id)) dispatch(fetchProduct({ id }));
    }, [id]);

    useEffect(() => {
        if (product) {
            if (product.categoryId) dispatch(fetchCategory({ id: product.categoryId }));
            if (product.brandId) dispatch(fetchBrand({ id: product.brandId }));
        }
    }, [product]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product?.quantity || 999)));
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addItem({
            id: product._id, productId: product._id, quantity,
            name: product.title, title: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            subtotal: product.price, sku: product.sku,
        }));
        addToast('Added to cart!', 'success');
    };

    const handleToggleWishlist = () => {
        if (!product) return;
        const item = {
            id: product.id || product._id, productId: product._id,
            title: product.title, name: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            originalPrice: product.price, rating: product.rating, sku: product.sku,
        };
        if (isInWishlist) {
            dispatch(removeFromWishlist(item.id));
            addToast('Removed from wishlist', 'info');
        } else {
            dispatch(addToWishlist(item));
            addToast('Added to wishlist!', 'success');
        }
    };

    const handleMoveToCart = async () => {
        if (!product || !isInWishlist) return;
        try {
            dispatch(addItem({ productId: product._id, id: product._id, name: product.title, title: product.title, image: product.images?.[0]?.url || '', price: product.salePrice || product.price, quantity: 1 }));
            dispatch(removeFromWishlist(product.id || product._id));
            await dispatch(moveToCart({ productId: product._id, quantity: 1 })).unwrap();
            addToast('Moved to cart!', 'success');
        } catch (err) { console.error(err); }
    };

    const handleBrandFavToggle = () => {
        if (product?.brandId) dispatch(toggleBrandFavorite(product.brandId));
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out ${product?.title || 'this product'}`;
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    const handleReviewChange = (field, value) => setReviewForm(prev => ({ ...prev, [field]: value }));

    const handleSubmitReview = async () => {
        if (!product?._id) return;
        if (!reviewForm.userName || !reviewForm.email || !reviewForm.content) {
            addToast('Please fill in all required fields', 'error');
            return;
        }
        try {
            const reviewData = {
                productId: product._id, username: reviewForm.userName,
                email: reviewForm.email, rating: parseInt(reviewForm.rating),
                comment: reviewForm.content, verified: false, helpfulCount: 0,
                createdAt: new Date().toISOString(),
            };
            dispatch(ReviewService.create(reviewData))
                .unwrap()
                .then(result => { if (result) product.reviews.push(reviewData); })
                .catch(err => console.error(err));

            setReviewForm({ userName: '', email: '', rating: 5, title: '', content: '' });
            if (productReviews && !reviewsLoading) {
                productReviews.push(reviewData);
                addToast('Review submitted!', 'success');
            }
        } catch (err) {
            addToast('Failed to submit review. Please try again.', 'error');
        }
    };

    // ── Derived values ───────────────────────────────────────────────────────
    const hasDiscount = product?.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

    const Stars = ({ rating, interactive = false, onPick, onHover, onLeave }) => (
        <div className="pd-stars">
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    className={`pd-star${n <= (hoverStar || rating) ? ' filled' : ''}${interactive ? ' interactive' : ''}`}
                    onClick={interactive ? () => onPick(n) : undefined}
                    onMouseEnter={interactive ? () => onHover(n) : undefined}
                    onMouseLeave={interactive ? onLeave : undefined}
                >★</span>
            ))}
        </div>
    );

    // ── State screens ────────────────────────────────────────────────────────
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

    if (error && !product) {
        return (
            <div className="pd-page">
                <div className="efear-container">
                    <div className="pd-state-screen">
                        <div className="pd-state-icon">⚠</div>
                        <h2 className="pd-state-title">Error Loading Product</h2>
                        <p className="pd-state-body">{error.message || error}</p>
                        <button className="cart-dd-btn-primary" style={{ padding: '.75rem 1.5rem' }} onClick={() => dispatch(fetchProduct({ id }))}>Try Again</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!product && !loading) {
        return (
            <div className="pd-page">
                <div className="efear-container">
                    <div className="pd-state-screen">
                        <div className="pd-state-icon">🔍</div>
                        <h2 className="pd-state-title">Product Not Found</h2>
                        <p className="pd-state-body">The product you're looking for doesn't exist.</p>
                        <button className="cart-dd-btn-primary" style={{ padding: '.75rem 1.5rem' }} onClick={() => navigate('/products')}>Browse Products</button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────────────
    return (
        <>
            {/* Breadcrumb */}
            <div className="co-crumb-bar">
                <div className="efear-container co-crumb-nav">
                    <nav className="co-crumb-trail">
                        <Link to="/" className="co-crumb-link">Home</Link>
                        <span className="co-crumb-sep">›</span>
                        <Link to="/products" className="co-crumb-link">Shop</Link>
                        <span className="co-crumb-sep">›</span>
                        <span className="co-crumb-current">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="pd-page">
                <div className="efear-container">

                    {/* ── Hero ──────────────────────────────────────────────────── */}
                    <div className="pd-hero">

                        {/* Gallery */}
                        <div className="pd-gallery-col">
                            <ImageGallery images={product.images} productTitle={product.title} />
                        </div>

                        {/* Info */}
                        <div className="pd-info-col">

                            {/* Brand */}
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

                            {/* Title */}
                            <h1 className="pd-title">{product.title}</h1>

                            {/* Rating */}
                            <div className="pd-rating-row">
                                <Stars rating={product.rating || 4} />
                                <span className="pd-rating-count">({product.reviewCount || (product.reviews?.length ?? 0)} ratings)</span>
                            </div>

                            {/* Price */}
                            <div className="pd-price-row">
                                {hasDiscount && (
                                    <span className="pd-price-original">${product.price?.toFixed(2)}</span>
                                )}
                                <span className="pd-price-main">
                                    ${(product.salePrice || product.price)?.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <span className="pd-price-badge">{discountPercent}% OFF</span>
                                )}
                            </div>

                            {/* Status badges */}
                            <div className="pd-badges">
                                {product.quantity > 0
                                    ? <span className="pd-badge in-stock">✓ In Stock ({product.quantity})</span>
                                    : <span className="pd-badge out-of-stock">Out of Stock</span>
                                }
                                {isInCart && <span className="pd-badge in-cart">In Cart ×{cartItem?.quantity}</span>}
                                {isInWishlist && <span className="pd-badge in-wishlist">♥ Wishlisted</span>}
                            </div>

                            {/* Short description */}
                            <p className="pd-desc">
                                {product.description || product.shortDescription ||
                                    'High-performance tactical gear built for the field. Precision-engineered for reliability in every condition.'}
                            </p>

                            {/* Specs */}
                            <div className="pd-spec-table">
                                <span className="pd-spec-key">SKU</span>
                                <span className="pd-spec-val">#{product.sku || product._id}</span>
                                <span className="pd-spec-key">Category</span>
                                <span className="pd-spec-val">{category?.name || 'General'}</span>
                                {product.deliveryInfo && (
                                    <>
                                        <span className="pd-spec-key">Delivery</span>
                                        <span className="pd-spec-val">{product.deliveryInfo}</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="pd-qty-row">
                                <span className="pd-qty-label">Qty</span>
                                <select
                                    className="pd-qty-select"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    disabled={!product.quantity}
                                >
                                    {[...Array(Math.min(product.quantity || 5, 10))].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            {/* CTA buttons */}
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

                            {/* Share */}
                            <div className="pd-share-row">
                                <span className="pd-share-label">Share</span>
                                {[
                                    { platform: 'facebook', label: 'f' },
                                    { platform: 'twitter', label: '𝕏' },
                                    { platform: 'linkedin', label: 'in' },
                                ].map(({ platform, label }) => (
                                    <a
                                        key={platform}
                                        href="#"
                                        className="pd-share-btn"
                                        onClick={(e) => { e.preventDefault(); handleShare(platform); }}
                                        title={`Share on ${platform}`}
                                        style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', fontWeight: 'bold' }}
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
                            {[
                                { id: 'description', label: 'Description' },
                                { id: 'more-info', label: 'More Info' },
                                { id: 'tags', label: 'Tags' },
                                { id: 'reviews', label: 'Reviews', count: productReviews?.length ?? product.reviews?.length ?? 0 },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`pd-tab${activeTab === tab.id ? ' active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    type="button"
                                >
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="pd-tab-count">{tab.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="pd-tab-body">

                            {/* Description */}
                            {activeTab === 'description' && (
                                <>
                                    <p className="pd-full-desc">
                                        {product.fullDescription || product.description ||
                                            'Raw denim you probably haven\'t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.'}
                                    </p>
                                    <ul className="pd-feature-list">
                                        {(product.features || ['Not just for commute', 'Branded tongue and cuff', 'Super fast and reliable', 'Lorem sed do eiusmod tempor']).map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {/* More info */}
                            {activeTab === 'more-info' && (
                                <p className="pd-full-desc">
                                    {product.additionalInfo ||
                                        'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'}
                                </p>
                            )}

                            {/* Tags */}
                            {activeTab === 'tags' && (
                                <div className="pd-tags">
                                    {(product.tags || ['Airsoft', 'Tactical', 'Outdoor', 'Gear']).map((tag, i) => (
                                        <a key={i} href="#" className="pd-tag" onClick={(e) => e.preventDefault()}>{tag}</a>
                                    ))}
                                </div>
                            )}

                            {/* Reviews */}
                            {activeTab === 'reviews' && (
                                <div className="pd-reviews-layout">

                                    {/* Review list */}
                                    <div>
                                        <p style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '.9rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', margin: '0 0 1.25rem' }}>
                                            {(productReviews ?? product.reviews ?? []).length} Reviews
                                        </p>

                                        {reviewsLoading && (
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                                                <div className="pd-spinner" />
                                            </div>
                                        )}

                                        {!reviewsLoading && (productReviews ?? product.reviews ?? []).length === 0 && (
                                            <div className="pd-review-empty">No reviews yet — be the first to review this product.</div>
                                        )}

                                        <div className="pd-review-list">
                                            {!reviewsLoading && (productReviews ?? product.reviews ?? []).map((review, i) => (
                                                <div key={review.id || i} className="pd-review-item">
                                                    <div className="pd-review-header">
                                                        <div>
                                                            <p className="pd-reviewer-name">{review.username}</p>
                                                            <Stars rating={review.rating || 4} />
                                                            {review.verified && <span className="pd-verified-badge">✓ Verified Purchase</span>}
                                                        </div>
                                                        <span className="pd-review-date">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    {review.title && <p className="pd-review-title">{review.title}</p>}
                                                    <p className="pd-review-body">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review form */}
                                    <div className="pd-review-form">
                                        <h3 className="pd-review-form-title">Write a Review</h3>

                                        <div className="auth-field">
                                            <label className="auth-label">Your Name <span className="auth-label-req">*</span></label>
                                            <input type="text" className="auth-input" value={reviewForm.userName} onChange={e => handleReviewChange('userName', e.target.value)} placeholder="Enter your name" />
                                        </div>

                                        <div className="auth-field">
                                            <label className="auth-label">Email <span className="auth-label-req">*</span></label>
                                            <input type="email" className="auth-input" value={reviewForm.email} onChange={e => handleReviewChange('email', e.target.value)} placeholder="Enter your email" />
                                        </div>

                                        <div className="auth-field">
                                            <label className="auth-label">Rating <span className="auth-label-req">*</span></label>
                                            <div className="pd-star-picker" style={{ marginBottom: '.25rem' }}>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <span
                                                        key={n}
                                                        className={`pd-star interactive${n <= (hoverStar || reviewForm.rating) ? ' filled' : ''}`}
                                                        style={{ fontSize: '1.2rem' }}
                                                        onClick={() => handleReviewChange('rating', n)}
                                                        onMouseEnter={() => setHoverStar(n)}
                                                        onMouseLeave={() => setHoverStar(0)}
                                                    >★</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="auth-field">
                                            <label className="auth-label">Review <span className="auth-label-req">*</span></label>
                                            <textarea
                                                className="auth-input"
                                                rows="4"
                                                style={{ resize: 'vertical', height: 'auto' }}
                                                value={reviewForm.content}
                                                onChange={e => handleReviewChange('content', e.target.value)}
                                                placeholder="Share your thoughts about this product..."
                                            />
                                        </div>

                                        <button type="button" className="auth-submit" style={{ marginTop: '.75rem' }} onClick={handleSubmitReview}>
                                            Submit Review
                                        </button>
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Toasts */}
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}
        </>
    );
};

export default ProductDetails;