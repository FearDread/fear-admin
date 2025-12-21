
// components/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchProduct,
    getRecommendations,
    selectCurrentProduct,
    selectProductsLoading,
    selectProductsError,
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
import OwlCarousel from 'react-owl-carousel';

export const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    const breadcrumbs = useSelector(state =>
        product?.categoryId ? selectCategoryBreadcrumbs(state, product.categoryId) : []
    );
    const isBrandFavorite = useSelector(state =>
        product?.brandId ? selectIsBrandFavorite(state, product.brandId) : false
    );

    useEffect(() => {
        if (productId) {
            dispatch(fetchProduct({ id: productId }));
            dispatch(getRecommendations({ id: productId, limit: 4 }));
        }
    }, [dispatch, productId]);

    // Fetch related data when product loads
    useEffect(() => {
        if (product) {
            if (product.categoryId) {
                dispatch(fetchCategory({ id: product.categoryId }));
            }
            if (product.brandId) {
                dispatch(fetchBrand({ id: product.brandId }));
            }
        }
    }, [product, dispatch]);

    const carouselOptions = {
        loop: true,
        margin: 10,
        responsiveClass: true,
        nav: false,
        dots: false,
        thumbs: true,
        thumbsPrerendered: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    }
    // Handle quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(value, product?.quantity || 999)));
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            productId: product.id,
            product,
            quantity,
            size: selectedSize,
            color: selectedColor,
            price: product.salePrice || product.price,
        };

        console.log('Adding to cart:', cartItem);
        // TODO: Dispatch to cart slice
        // dispatch(addToCart(cartItem));
        alert('Product added to cart!');
    };

    // Handle add to wishlist
    const handleAddToWishlist = () => {
        if (!product) return;

        console.log('Adding to wishlist:', product);
        // TODO: Dispatch to wishlist slice
        // dispatch(addToWishlist(product));
        alert('Product added to wishlist!');
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
        // dispatch(submitReview({ productId, ...reviewForm }));

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
                    <button className="btn btn-primary" onClick={() => dispatch(fetchProduct({ id: productId }))}>
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

    // Calculate pricing
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.salePrice / product.price) * 100)
        : 0;

    // Get product images
    const images = product.images || (product.image ? [product.image] : ['assets/images/product-gallery/01.png']);

    // Product colors (if available)
    const colors = product.colors || ['primary', 'danger', 'success', 'warning'];

    // Product sizes (if available)
    const sizes = product.sizes || ['S', 'M', 'L', 'XS', 'XL'];

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

    return (
        <>
            {/* Breadcrumb Section */}
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">{product.name}</h3>
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
                                    {breadcrumbs.map((crumb) => (
                                        <li key={crumb.id} className="breadcrumb-item">
                                            <a
                                                href={`/categories/${crumb.id}`}
                                                onClick={(e) => { e.preventDefault(); handleCategoryClick(crumb.id); }}
                                            >
                                                {crumb.name}
                                            </a>
                                        </li>
                                    ))}
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {product.name}
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
                                        {/* Main Image */}

                                                      <OwlCarousel
                                                        className="product-gallery owl-carousel owl-theme border mb-3 p-3"
                                                        {...carouselOptions}
                                                      >
                                            <div className="item">
                                                <img
                                                    src={images[selectedImageIndex]}
                                                    className="img-fluid"
                                                    alt={product.name}
                                                />
                                            </div>
                                            </OwlCarousel>


                                        {/* Thumbnails */}
                                        <OwlCarousel className="owl-thumbs d-flex justify-content-center">
                                            {images.map((img, index) => (
                                                <button
                                                    key={index}
                                                    className={`owl-thumb-item ${selectedImageIndex === index ? 'active' : ''}`}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                >
                                                    <img src={img} alt={`${product.name} ${index + 1}`} />
                                                </button>
                                            ))}
                                        </OwlCarousel>
                                        
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
                                        <h3 className="mt-3 mt-lg-0 mb-0">{product.name}</h3>

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
                                            <dd className="col-sm-9">#{product.sku || product.id}</dd>
                                            <dt className="col-sm-3">Category</dt>
                                            <dd className="col-sm-9">{category?.name || 'General'}</dd>
                                            {product.deliveryInfo && (
                                                <>
                                                    <dt className="col-sm-3">Delivery</dt>
                                                    <dd className="col-sm-9">{product.deliveryInfo}</dd>
                                                </>
                                            )}
                                        </dl>

                                        {/* Quantity, Size, Colors */}
                                        <div className="row row-cols-auto align-items-center mt-3">
                                            {/* Quantity */}
                                            <div className="col">
                                                <label className="form-label">Quantity</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
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
                                                        <option value="">Select Size</option>
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
                                                                className={`color-indigator-item bg-${color} ${selectedColor === color ? 'border border-dark border-2' : ''}`}
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
                                                disabled={!product.inStock}
                                            >
                                                <i className="bx bxs-cart-add"></i>
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={handleAddToWishlist}
                                                className="btn btn-light btn-ecomm"
                                            >
                                                <i className="bx bx-heart"></i>
                                                Add to Wishlist
                                            </button>
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
                                    "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi."}</p>
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
                                    "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park."}</p>
                            </div>

                            {/* Tags Tab */}
                            <div
                                className={`tab-pane fade ${activeTab === 'tags' ? 'show active' : ''}`}
                                id="tags"
                                role="tabpanel"
                            >
                                <div className="tags-box w-50">
                                    {product.tags && product.tags.map((tag, index) => (
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
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Men Wear</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Women Wear</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Laptops</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Formal Shirts</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Topwear</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Headphones</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Bottom Wear</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Bags</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Sofa</a>
                                            <a href="#" className="tag-link" onClick={(e) => e.preventDefault()}>Shoes</a>
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
                                                {product.reviews && product.reviews.map((review, index) => {

                                                    <div key={review.id || index}>
                                                        <div className="d-flex align-items-start">
                                                            <div className="review-user">
                                                                <img
                                                                    src={review.avatar || `assets/images/avatars/avatar-${(index % 3) + 1}.png`}
                                                                    width="65"
                                                                    height="65"
                                                                    className="rounded-circle"
                                                                    alt={review.name}
                                                                />
                                                            </div>
                                                            <div className="review-content ms-3">
                                                                <div className="rates cursor-pointer fs-6">
                                                                    {renderStars(review.rating || 4)}
                                                                </div>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <h6 className="mb-0">David Buckley</h6>
                                                                    <p className="mb-0 ms-auto">February 22, 2021</p>
                                                                </div>
                                                                <p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="d-flex align-items-start">
                                                            <div className="review-user">
                                                                <img src="assets/images/avatars/avatar-3.png" width="65" height="65" className="rounded-circle" alt="" />
                                                            </div>
                                                            <div className="review-content ms-3">
                                                                <div className="rates cursor-pointer fs-6">
                                                                    <i className="bx bxs-star text-warning"></i>
                                                                    <i className="bx bxs-star text-warning"></i>
                                                                    <i className="bx bxs-star text-warning"></i>
                                                                    <i className="bx bxs-star text-warning"></i>
                                                                    <i className="bx bxs-star text-light-4"></i>
                                                                </div>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <h6 className="mb-0">Peter Costanzo</h6>
                                                                    <p className="mb-0 ms-auto">February 26, 2021</p>
                                                                </div>
                                                                <p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}
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
};

export default ProductDetails