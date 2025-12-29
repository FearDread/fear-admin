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
import ImageGallery from '../../components/common/ImageGallery';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Local state
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviewForm, setReviewForm] = useState({
        name: '',
        email: '',
        rating: '',
        comment: '',
    });

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

    console.log('product =- ', product);

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

    const carouselOptions = {
        loop: true,
        margin: 10,
        responsiveClass: true,
        nav: false,
        dots: false,
        thumbs: true,
        responsive: {
            0: { items: 1 },
            600: { items: 1 },
            1000: { items: 1 }
        }
    };

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(value, product?.quantity || 999)));
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            productId: product._id,
            id: product._id,
            name: product.title,
            title: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            sku: product.sku,
        };

        dispatch(addItem(cartItem));
        
        // Show success message (you can replace with toast notification)
        alert('Product added to cart!');
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
    const handleSubmitReview = () => {
        console.log('Submitting review:', reviewForm);
        // TODO: Dispatch review submission action
        // dispatch(submitReview({ id, ...reviewForm }));

        // Reset form
        setReviewForm({
            name: '',
            email: '',
            rating: '',
            comment: '',
        });
        alert('Review submitted successfully!');
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

    // Navigation handlers
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
                                                <p className="mb-0">
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
                                                ({product.reviews?.length || 3}) Reviews
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
                                                <h5 className="mb-4">
                                                    {product.reviews?.length || 3} Reviews For The Product
                                                </h5>
                                                <div className="review-list">
                                                    {/* Review content here */}
                                                    <p>Reviews section - integrate with your reviews system</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Form */}
                                        <div className="col col-lg-4">
                                            <div className="add-review bg-dark-1">
                                                <div className="form-body p-3">
                                                    <h4 className="mb-4">Write a Review</h4>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control rounded-0"
                                                            value={reviewForm.name}
                                                            onChange={(e) => handleReviewFormChange('name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control rounded-0"
                                                            value={reviewForm.email}
                                                            onChange={(e) => handleReviewFormChange('email', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Rating</label>
                                                        <select
                                                            className="form-select rounded-0"
                                                            value={reviewForm.rating}
                                                            onChange={(e) => handleReviewFormChange('rating', e.target.value)}
                                                        >
                                                            <option value="">Choose Rating</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Your Review</label>
                                                        <textarea
                                                            className="form-control rounded-0"
                                                            rows="3"
                                                            value={reviewForm.comment}
                                                            onChange={(e) => handleReviewFormChange('comment', e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="d-grid">
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-ecomm"
                                                            onClick={handleSubmitReview}
                                                        >
                                                            Submit a Review
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
            </>
        );
    }


};

export default ProductDetails