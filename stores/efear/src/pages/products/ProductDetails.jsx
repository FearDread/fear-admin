// components/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { dispatch } from "../../features/store";
import {
    fetchProduct,
    getRecommendations,
    selectCurrentProduct,
    selectProductsLoading,
    selectProductsError,
    selectProductById,
} from '../../features/products/slice';
import {
    fetchCategory,
    selectCategoryById,
    selectCategoryBreadcrumbs,
} from '../../features/categories/slice';
import Toast from "../../components/common/Toast";
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
    toggleWishlist,
    selectIsInWishlist,
    moveToCart,
} from '../../features/wishlist/slice';
import {
    fetchReviews,
    getReviewsByProduct,
    toggleHelpful,
    setViewMode,
    selectReviewsByProduct,
    selectFilteredReviews,
    selectSortedReviews,
    selectReviewsLoading,
    selectReviewsViewMode,
    selectAverageRatingByProduct,
    selectRatingDistribution,
    submitReview,
} from '../../features/review/slice';
import ReviewService from '../../features/review/service';
import ImageGallery from '../../components/common/ImageGallery';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    // Local state
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviewForm, setReviewForm] = useState({
        userName: '',
        email: '',
        rating: 5,
        title: '',
        content: '',
    });
    const [reviewSortMode, setReviewSortMode] = useState('recent'); // 'recent', 'helpful', 'rating'

    // Select product data from Redux store
    const product = useSelector(selectCurrentProduct);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    // Select related data
    const category = useSelector(state =>
        product?.categoryId ? selectCategoryById(state, product.categoryId) : null
    );
    const brand = useSelector(state =>
        product?.brandId ? selectBrandById(state, product.brandId) : null
    );
    const isBrandFavorite = useSelector(state =>
        product?.brandId ? selectIsBrandFavorite(state, product.brandId) : false
    );

    // Cart and Wishlist state
    const isInCart = useSelector(state =>
        product?._id ? selectIsInCart(state, product._id) : false
    );
    const cartItem = useSelector(state =>
        product?._id ? selectCartItemById(state, product._id) : null
    );
    const isInWishlist = useSelector(state =>
        product?.id ? selectIsInWishlist(state, product.id) : false
    );

    // Reviews state
    const productReviews = useSelector(state =>
        product?._id ? selectReviewsByProduct(state, product._id) : []
    );
    const sortedReviews = useSelector(selectSortedReviews);
    const reviewsLoading = useSelector(selectReviewsLoading);
    const reviewViewMode = useSelector(selectReviewsViewMode);
    const averageRating = useSelector(state =>
        product?._id ? selectAverageRatingByProduct(state, product._id) : 0
    );
    const ratingDistribution = useSelector(state =>
        product?._id ? selectRatingDistribution(state, product._id) : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    useEffect(() => {
        if (product) {
            if (product.categoryId) {
                dispatch(fetchCategory({ id: product.categoryId }));
            }
            if (product.brandId) {
                dispatch(fetchBrand({ id: product.brandId }));
            }
        }
    }, [product]);

    useEffect(() => {
        if (id && (product === null || product._id !== id)) {
            dispatch(fetchProduct({ id: id }));
        }
    }, [id]);

    useEffect(() => {
        if (product?._id) {
            // Fetch reviews for this product
            dispatch(getReviewsByProduct({ productId: product._id }));
        }
    }, [product?._id]);

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(value, product?.quantity || 999)));
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            id: product._id,
            productId: product._id,
            quantity,
            name: product.title,
            title: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            subtotal: product.price,
            sku: product.sku,
        };

        dispatch(addItem(cartItem));
        addToast('Product added to cart!', 'success');
    };

    // Handle add to wishlist
    const handleToggleWishlist = () => {
        if (!product) return;

        const wishlistItem = {
            id: product.id || product._id,
            productId: product._id,
            title: product.title,
            name: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            originalPrice: product.price,
            rating: product.rating,
            sku: product.sku,
        };

        if (isInWishlist) {
            dispatch(removeFromWishlist(wishlistItem.id));
            alert('Product removed from wishlist!');
        } else {
            dispatch(addToWishlist(wishlistItem));
            alert('Product added to wishlist!');
        }
    };

    // Handle move from wishlist to cart
    const handleMoveToCart = async () => {
        if (!product || !isInWishlist) return;

        try {
            // Add to cart
            const cartItem = {
                productId: product._id,
                id: product._id,
                name: product.title,
                title: product.title,
                image: product.images?.[0]?.url || '',
                price: product.salePrice || product.price,
                quantity: 1,
            };

            dispatch(addItem(cartItem));

            // Remove from wishlist
            dispatch(removeFromWishlist(product.id || product._id));

            // Optionally sync with server
            await dispatch(moveToCart({
                productId: product._id,
                quantity: 1
            })).unwrap();

            alert('Product moved to cart!');
        } catch (error) {
            console.error('Failed to move to cart:', error);
        }
    };

    // Handle brand favorite toggle
    const handleBrandFavoriteToggle = () => {
        if (product?.brandId) {
            dispatch(toggleBrandFavorite(product.brandId));
        }
    };

    // Handle review form change
    const handleReviewFormChange = (field, value) => {
        setReviewForm(prev => ({ ...prev, [field]: value }));
    };

    // Handle review submission
    const handleSubmitReview = async () => {
        if (!product?._id) return;
        
        // Validate form
        if (!reviewForm.userName || !reviewForm.email || !reviewForm.content) {
            addToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const reviewData = {
                productId: product._id,
                username: reviewForm.userName,
                email: reviewForm.email,
                rating: parseInt(reviewForm.rating),
                title: reviewForm.title,
                comment: reviewForm.content,
                verified: false,
                helpfulCount: 0,
                createdAt: new Date().toISOString(),
            };

            await dispatch(ReviewService.create(reviewData)).unwrap();
            
            // Reset form
            setReviewForm({
                userName: '',
                email: '',
                rating: 5,
                title: '',
                content: '',
            });
            
            addToast('Review submitted successfully!', 'success');
            
            // Refresh reviews
            dispatch(getReviewsByProduct({ productId: product._id }));
        } catch (error) {
            console.error('Failed to submit review:', error);
            addToast('Failed to submit review. Please try again.', 'error');
        }
    };

    // Handle helpful vote on review
    const handleHelpfulClick = (reviewId) => {
        dispatch(toggleHelpful(reviewId));
    };

    // Handle review sort change
    const handleReviewSortChange = (mode) => {
        setReviewSortMode(mode);
        dispatch(setViewMode(mode));
    };

    // Handle social share
    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out ${product?.name || 'this product'}`;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };
    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    // Calculate pricing
    const hasDiscount = product?.salePrice && product?.salePrice < product?.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product?.salePrice / product?.price) * 100)
        : 0;

    // Rating stars
    const renderStars = (rating) => {
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

    // Loading state
    if (loading && !product) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading product details...</p>
            </div>
        );
    }

    // Error state
    if (error && !product) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error Loading Product</h4>
                    <p>{error.message || error}</p>
                    <button className="btn btn-primary" onClick={() => dispatch(fetchProduct({ id: id }))}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Product not found
    if (!product && !loading) {
        return (
            <div className="container py-5 text-center">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>
                    Browse Products
                </button>
            </div>
        );
    }

    if (!loading && product) {
        return (
            <>
                {/* Breadcrumb Section */}
                <section className="py-3 border-bottom d-none d-md-flex">
                    <div className="container">
                        <div className="page-breadcrumb d-flex align-items-center">
                            <h3 className="breadcrumb-title pe-3">{product.title}</h3>
                            <div className="ms-auto">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0 p-0">
                                        <li className="breadcrumb-item">
                                            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                                <i className="bx bx-home-alt"></i> Home
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="/shop" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
                                                Shop
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {product.title}
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Detail Section */}
                <section className="py-4">
                    <div className="container">
                        <div className="product-detail-card">
                            <div className="product-detail-body">
                                <div className="row g-0">
                                    {/* Image Gallery */}
                                    <div className="col-12 col-lg-5">
                                        <div className="image-zoom-section">
                                            <ImageGallery
                                                images={product.images}
                                                productTitle={product.title}
                                            />
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="col-12 col-lg-7">
                                        <div className="product-info-section p-3">
                                            {/* Brand */}
                                            {brand && (
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="badge bg-secondary">{brand.name}</span>
                                                    {isBrandFavorite !== undefined && (
                                                        <button
                                                            onClick={handleBrandFavoriteToggle}
                                                            className="btn btn-sm ms-2"
                                                            title={isBrandFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                                        >
                                                            <i className={`bx ${isBrandFavorite ? 'bxs-heart' : 'bx-heart'}`}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Product Title */}
                                            <h3 className="mt-3 mt-lg-0 mb-0">{product.title}</h3>

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
                                                <h4 className="mb-0">
                                                    ${(product.salePrice || product.price)?.toFixed(2)}
                                                </h4>
                                                {hasDiscount && (
                                                    <span className="badge bg-danger">{discountPercent}% OFF</span>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className="mt-2 d-flex gap-2 align-items-center">
                                                {product.quantity ? (
                                                    <span className="badge bg-success">
                                                        In Stock ({product.quantity || 0} available)
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">Out of Stock</span>
                                                )}
                                                {isInCart && (
                                                    <span className="badge bg-info">
                                                        <i className="bx bx-check"></i> In Cart ({cartItem?.quantity})
                                                    </span>
                                                )}
                                                {isInWishlist && (
                                                    <span className="badge bg-warning">
                                                        <i className="bx bx-heart"></i> In Wishlist
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="mt-3">
                                                <h6>Description:</h6>
                                                <p className="mb-0 p-product-description">
                                                    {product.description || product.shortDescription ||
                                                        "Virgil Abloh's Off-White is a streetwear-inspired collection that continues to break away from the conventions of mainstream fashion. Made in Italy, these black and brown Odsy-1000 low-top sneakers."}
                                                </p>
                                            </div>

                                            {/* Product Info */}
                                            <dl className="row mt-3">
                                                <dt className="col-sm-3">Product ID</dt>
                                                <dd className="col-sm-9">#{product.sku || product._id}</dd>
                                                <dt className="col-sm-3">Category</dt>
                                                <dd className="col-sm-9">{category?.name || 'General'}</dd>
                                                {product.deliveryInfo && (
                                                    <>
                                                        <dt className="col-sm-3">Delivery</dt>
                                                        <dd className="col-sm-9">{product.deliveryInfo}</dd>
                                                    </>
                                                )}
                                            </dl>

                                            {/* Quantity */}
                                            <div className="row row-cols-auto align-items-center mt-3">
                                                <div className="col">
                                                    <label className="form-label">Quantity</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={quantity}
                                                        onChange={handleQuantityChange}
                                                        disabled={!product.quantity}
                                                    >
                                                        {[...Array(Math.min(product.quantity || 5, 10))].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="d-flex gap-2 mt-3 flex-wrap">
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="btn btn-white btn-ecomm"
                                                    disabled={!product.quantity}
                                                >
                                                    <i className={`bx ${isInCart ? 'bx-check' : 'bxs-cart-add'}`}></i>
                                                    {isInCart ? 'Added to Cart' : 'Add to Cart'}
                                                </button>
                                                <button
                                                    onClick={handleToggleWishlist}
                                                    className={`btn btn-ecomm ${isInWishlist ? 'btn-warning' : 'btn-light'}`}
                                                >
                                                    <i className={`bx ${isInWishlist ? 'bxs-heart' : 'bx-heart'}`}></i>
                                                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                                </button>
                                                {isInWishlist && (
                                                    <button
                                                        onClick={handleMoveToCart}
                                                        className="btn btn-primary btn-ecomm"
                                                        disabled={!product.quantity}
                                                    >
                                                        <i className="bx bx-transfer"></i>
                                                        Move to Cart
                                                    </button>
                                                )}
                                            </div>

                                            <hr />

                                            {/* Social Sharing */}
                                            <div className="product-sharing">
                                                <ul className="list-inline">
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); handleShare('facebook'); }}
                                                        >
                                                            <i className='bx bxl-facebook'></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); handleShare('linkedin'); }}
                                                        >
                                                            <i className='bx bxl-linkedin'></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); handleShare('twitter'); }}
                                                        >
                                                            <i className='bx bxl-twitter'></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a href="#" onClick={(e) => e.preventDefault()}>
                                                            <i className='bx bxl-instagram'></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a href="#" onClick={(e) => e.preventDefault()}>
                                                            <i className='bx bxl-google'></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* More Info Section */}
                <section className="py-4">
                    <div className="container">
                        <div className="product-more-info">
                            <ul className="nav nav-tabs mb-0" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        href="#discription"
                                        role="tab"
                                        onClick={() => setActiveTab('description')}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="tab-title text-uppercase fw-500">Description</div>
                                        </div>
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === 'more-info' ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        href="#more-info"
                                        role="tab"
                                        onClick={() => setActiveTab('more-info')}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="tab-title text-uppercase fw-500">More Info</div>
                                        </div>
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === 'tags' ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        href="#tags"
                                        role="tab"
                                        onClick={() => setActiveTab('tags')}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="tab-title text-uppercase fw-500">Tags</div>
                                        </div>
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        href="#reviews"
                                        role="tab"
                                        onClick={() => setActiveTab('reviews')}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="tab-title text-uppercase fw-500">
                                                ({productReviews.length}) Reviews
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content pt-3">
                                {/* Description Tab */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'description' ? 'show active' : ''}`}
                                    id="discription"
                                    role="tabpanel"
                                >
                                    <p>{product.fullDescription || product.description ||
                                        "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica."}</p>
                                    {product.features && (
                                        <ul>
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {!product.features && (
                                        <ul>
                                            <li>Not just for commute</li>
                                            <li>Branded tongue and cuff</li>
                                            <li>Super fast and amazing</li>
                                            <li>Lorem sed do eiusmod tempor</li>
                                        </ul>
                                    )}
                                </div>

                                {/* More Info Tab */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'more-info' ? 'show active' : ''}`}
                                    id="more-info"
                                    role="tabpanel"
                                >
                                    <p>{product.additionalInfo ||
                                        "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."}</p>
                                </div>

                                {/* Tags Tab */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'tags' ? 'show active' : ''}`}
                                    id="tags"
                                    role="tabpanel"
                                >
                                    <div className="tags-box w-50">
                                        {product.tags && product.tags.split(',').map((tag, index) => (
                                            <a key={index} href="#" className="tag-link" onClick={(e) => e.preventDefault()}>
                                                {tag}
                                            </a>
                                        ))}
                                        {!product.tags && (
                                            <>
                                                <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Cloths</a>
                                                <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Electronics</a>
                                                <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Furniture</a>
                                                <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Sports</a>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Reviews Tab */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`}
                                    id="reviews"
                                    role="tabpanel"
                                >
                                    <div className="row">
                                        <div className="col col-lg-8">
                                            <div className="product-review">
                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <h5 className="mb-0">
                                                        {productReviews.length} Reviews For The Product
                                                    </h5>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${reviewSortMode === 'recent' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => handleReviewSortChange('recent')}
                                                        >
                                                            Recent
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${reviewSortMode === 'helpful' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => handleReviewSortChange('helpful')}
                                                        >
                                                            Most Helpful
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${reviewSortMode === 'rating' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => handleReviewSortChange('rating')}
                                                        >
                                                            Highest Rating
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Rating Summary */}
                                                {productReviews.length > 0 && (
                                                    <div className="rating-summary mb-4 p-3 bg-light">
                                                        <div className="row">
                                                            <div className="col-md-4 text-center">
                                                                <h2 className="display-4">{averageRating}</h2>
                                                                <div className="rating-stars mb-2">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className={`bi bi-star${i < Math.round(averageRating) ? '-fill' : ''} text-warning`}
                                                                        ></i>
                                                                    ))}
                                                                </div>
                                                                <p className="text-muted">{productReviews.length} reviews</p>
                                                            </div>
                                                            <div className="col-md-8">
                                                                {Object.entries(ratingDistribution)
                                                                    .sort(([a], [b]) => b - a)
                                                                    .map(([rating, count]) => (
                                                                        <div key={rating} className="d-flex align-items-center mb-2">
                                                                            <span className="me-2">{rating} ★</span>
                                                                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                                                                <div
                                                                                    className="progress-bar bg-warning"
                                                                                    style={{
                                                                                        width: `${productReviews.length > 0 ? (count / productReviews.length) * 100 : 0}%`
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                            <span className="text-muted" style={{ minWidth: '30px' }}>{count}</span>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Review List */}
                                                <div className="review-list">
                                                    {reviewsLoading && (
                                                        <div className="text-center py-4">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading reviews...</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!reviewsLoading && productReviews.length === 0 && (
                                                        <div className="text-center py-4">
                                                            <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                                                        </div>
                                                    )}

                                                    {!reviewsLoading && sortedReviews.map((review) => (
                                                        <div key={review.id} className="review-item border-bottom pb-4 mb-4">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <div>
                                                                    <h6 className="mb-1">{review.userName}</h6>
                                                                    {review.verified && (
                                                                        <span className="badge bg-success me-2">Verified Purchase</span>
                                                                    )}
                                                                    <div className="rating-stars">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <i
                                                                                key={i}
                                                                                className={`bi bi-star${i < review.rating ? '-fill' : ''} text-warning`}
                                                                            ></i>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <small className="text-muted">
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                            {review.title && (
                                                                <h6 className="mb-2">{review.title}</h6>
                                                            )}
                                                            <p className="mb-2">{review.content}</p>
                                                            <div className="review-actions">
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                                    onClick={() => handleHelpfulClick(review.id)}
                                                                >
                                                                    <i className="bi bi-hand-thumbs-up me-1"></i>
                                                                    Helpful ({review.helpfulCount || 0})
                                                                </button>
                                                                {review.replies && review.replies.length > 0 && (
                                                                    <span className="text-muted">
                                                                        {review.replies.length} {review.replies.length === 1 ? 'reply' : 'replies'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Form */}
                                        <div className="col col-lg-4">
                                            <div className="add-review bg-dark-1">
                                                <div className="form-body p-3">
                                                    <h4 className="mb-4">Write a Review</h4>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Name *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control rounded-0"
                                                            value={reviewForm.userName}
                                                            onChange={(e) => handleReviewFormChange('userName', e.target.value)}
                                                            placeholder="Enter your name"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Email *</label>
                                                        <input
                                                            type="email"
                                                            className="form-control rounded-0"
                                                            value={reviewForm.email}
                                                            onChange={(e) => handleReviewFormChange('email', e.target.value)}
                                                            placeholder="Enter your email"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Rating *</label>
                                                        <select
                                                            className="form-select rounded-0"
                                                            value={reviewForm.rating}
                                                            onChange={(e) => handleReviewFormChange('rating', e.target.value)}
                                                        >
                                                            <option value="5">5 - Excellent</option>
                                                            <option value="4">4 - Good</option>
                                                            <option value="3">3 - Average</option>
                                                            <option value="2">2 - Poor</option>
                                                            <option value="1">1 - Terrible</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Review Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control rounded-0"
                                                            value={reviewForm.title}
                                                            onChange={(e) => handleReviewFormChange('title', e.target.value)}
                                                            placeholder="Summary of your review"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Review *</label>
                                                        <textarea
                                                            className="form-control rounded-0"
                                                            rows="4"
                                                            value={reviewForm.content}
                                                            onChange={(e) => handleReviewFormChange('content', e.target.value)}
                                                            placeholder="Share your thoughts about this product..."
                                                        ></textarea>
                                                    </div>
                                                    <div className="d-grid">
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-ecomm"
                                                            onClick={handleSubmitReview}
                                                        >
                                                            Submit Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
    }


};

export default ProductDetails