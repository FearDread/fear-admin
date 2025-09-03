import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReactImageZoom from 'react-image-zoom';

import Loader from '../components/Loader/Loader';
import BannerSub from '../components/Banner/BannerSub';
import Recommended from '../components/Carousel/Recommended';
import { Product } from '../features/products/slice';
import { Cart } from "../features/cart/slice";
import defaultProdImg from '../assets/images/abstract_banner_1.jpg';

// Constants
const QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 50,
  STEP: 1,
};

const TABS = {
  DESCRIPTION: 'description',
  REVIEWS: 'reviews',
  SHIPPING: 'shipping',
};

const IMAGE_ZOOM_CONFIG = {
  width: 594,
  height: 600,
  zoomWidth: 600,
};

/**
 * ProductDetails component for displaying detailed product information
 * @returns {JSX.Element} Product details page
 */
const ProductDetails = () => {
  // Router hooks
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [quantity, setQuantity] = useState(QUANTITY_LIMITS.MIN);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS.DESCRIPTION);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  // Redux state
  const {
    data: products,
    loading: isLoading,
    error: apiError,
    product: activeProduct,
  } = useSelector((state) => state.product);

  // Validation
  const productId = useMemo(() => {
    if (!id) {
      setError('Product ID is required');
      return null;
    }
    return id;
  }, [id]);

  // Memoized computed values
  const productImages = useMemo(() => {
    if (!activeProduct?.images || !Array.isArray(activeProduct.images)) {
      return [{ url: defaultProdImg, alt: 'Default product image' }];
    }
    return activeProduct.images.map((img, index) => ({
      url: img.url || defaultProdImg,
      alt: img.alt || `${activeProduct.title || 'Product'} image ${index + 1}`,
    }));
  }, [activeProduct]);

  const currentImage = useMemo(() => {
    return productImages[selectedImageIndex] || productImages[0];
  }, [productImages, selectedImageIndex]);

  const imageZoomProps = useMemo(() => ({
    ...IMAGE_ZOOM_CONFIG,
    img: currentImage.url,
  }), [currentImage.url]);

  const breadcrumbItems = useMemo(() => [
    { label: 'Products', href: '/products', active: false },
    { label: activeProduct?.title || 'Product Details', active: true },
  ], [activeProduct?.title]);

  const productFeatures = useMemo(() => {
    if (!activeProduct) return [];

    return [
      { label: 'Category', value: activeProduct.category },
      { label: 'Brand', value: activeProduct.brand },
      { label: 'SKU', value: activeProduct.sku || activeProduct._id },
      { label: 'Availability', value: activeProduct.stock > 0 ? 'In Stock' : 'Out of Stock' },
    ].filter(item => item.value);
  }, [activeProduct]);

  // Event handlers
  const handleQuantityChange = useCallback((newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);

    if (isNaN(parsedQuantity)) return;

    const clampedQuantity = Math.max(
      QUANTITY_LIMITS.MIN,
      Math.min(QUANTITY_LIMITS.MAX, parsedQuantity)
    );

    setQuantity(clampedQuantity);
  }, []);

  const handleQuantityIncrement = useCallback(() => {
    handleQuantityChange(quantity + 1);
  }, [quantity, handleQuantityChange]);

  const handleQuantityDecrement = useCallback(() => {
    handleQuantityChange(quantity - 1);
  }, [quantity, handleQuantityChange]);

  const handleImageSelect = useCallback((index) => {
    if (index >= 0 && index < productImages.length) {
      setSelectedImageIndex(index);
    }
  }, [productImages.length]);

  const handleAddToCart = useCallback(async () => {
    if (!activeProduct || !productId) {
      toast.error('Product information is not available');
      return;
    }

    if (activeProduct.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    toast.success(`Added ${quantity} item(s) to cart`);
    setIsAddingToCart(true);
    dispatch(Cart.addToCart());
}, [activeProduct, productId, quantity]);


const handleBuyNow = useCallback(async () => {
  await handleAddToCart();
  navigate('/checkout');
}, [handleAddToCart, navigate]);

const handleTabChange = useCallback((tabId) => {
  setActiveTab(tabId);
}, []);

// Effects
useEffect(() => {
  if (!productId) return;

  const fetchProduct = async () => {
    try {
      setError(null);
      await dispatch(Product.fetchOne({ id: productId }));
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product details');
    }
  };

  fetchProduct();
}, [productId, dispatch]);

useEffect(() => {
  if (apiError) {
    setError(typeof apiError === 'string' ? apiError : 'An error occurred');
  }
}, [apiError]);

// Reset selected image when product changes
useEffect(() => {
  setSelectedImageIndex(0);
}, [activeProduct?._id]);

// Loading state
if (isLoading) {
  return (
    <main className="float-start w-100 total-body home-body mt-0">
      <section className="float-start w-100">
        <Loader />
      </section>
    </main>
  );
}

// Error state
if (error) {
  return (
    <main className="float-start w-100 total-body home-body mt-0">
      <section className="float-start w-100 p-5">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h4>Error Loading Product</h4>
            <p>{error}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// No product found
if (!activeProduct) {
  return (
    <main className="float-start w-100 total-body home-body mt-0">
      <section className="float-start w-100 p-5">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <h4>Product Not Found</h4>
            <p>The requested product could not be found.</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

return (
  <>
    <BannerSub />
    <main className="float-start w-100 total-body home-body mt-0">
      {/* Breadcrumb */}
      <section className="bedcrum float-start w-100">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {breadcrumbItems.map((item, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item ${item.active ? 'active' : ''}`}
                  {...(item.active ? { 'aria-current': 'page' } : {})}
                >
                  {item.active ? (
                    item.label
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section className="category float-start w-100 position-relative">
        <div className="listing-page-div">
          <div className="container">
            <div className="row g-5 product-details-div">
              {/* Product Images */}
              <div className="col-lg-6">
                <div className="main-product-image products-slide-1">
                  <ReactImageZoom {...imageZoomProps} />
                </div>

                {productImages.length > 1 && (
                  <div className="other-product-images thum-pic-slide d-flex flex-wrap gap-15 mt-3">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className={`item cursor-pointer ${index === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => handleImageSelect(index)}
                      >
                        <figure className="main-ppic">
                          <img
                            src={image.url}
                            className="img-fluid"
                            alt={image.alt}
                            loading="lazy"
                          />
                        </figure>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="col-lg-6">
                <div className="comon-details-part">
                  <h5 className="tags-ts">{activeProduct.title}</h5>
                  <h2 className="my-2">{activeProduct.slug}</h2>
                  <div className="ratine">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < (activeProduct.rating || 0) ? 'text-warning' : 'text-muted'}`}
                        />
                      ))}
                    </span>
                    <span className="ms-2">
                      ({activeProduct.reviews || 0} Review{activeProduct.reviews !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <h3 className="price-text mt-3">
                    ${activeProduct.price}
                    {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        ${activeProduct.originalPrice}
                      </span>
                    )}
                  </h3>
                  <div className="feature-div-list">
                    <ul className="mt-4">
                      {productFeatures.map((feature, index) => (
                        <li key={index}>
                          <span>{feature.label}:</span>
                          <span>{feature.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="quantity-control d-flex align-items-center mt-4" data-quantity="">
                    <button
                      className="btn quantity-btn"
                      onClick={handleQuantityDecrement}
                      disabled={quantity <= QUANTITY_LIMITS.MIN}
                      aria-label="Decrease quantity"
                    >
                      <i className="fas fa-minus"></i>
                    </button>

                    <input
                      type="number"
                      className="quantity-input mx-2"
                      value={quantity}
                      min={QUANTITY_LIMITS.MIN}
                      max={QUANTITY_LIMITS.MAX}
                      step={QUANTITY_LIMITS.STEP}
                      name="quantity"
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      aria-label="Product quantity"
                    />

                    <button
                      className="btn quantity-btn"
                      onClick={handleQuantityIncrement}
                      disabled={quantity >= QUANTITY_LIMITS.MAX}
                      aria-label="Increase quantity"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="d-flex align-items-center my-4 gap-3">
                    <button
                      className="btn add-btn"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || activeProduct.stock <= 0}
                    >
                      <span>
                        {isAddingToCart ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-shopping-cart"></i>
                        )}
                      </span>
                      <span className="ms-2">
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                      </span>
                    </button>

                    <button
                      className="btn ad-whish"
                      onClick={handleBuyNow}
                      disabled={isAddingToCart || activeProduct.stock <= 0}
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>
                  {activeProduct.stock <= 0 && (
                    <div className="alert alert-warning mt-3">
                      This product is currently out of stock.
                    </div>
                  )}
                  <div className="delivery-part">
                    <h5>
                      Free worldwide shipping for orders over <span>$70</span>
                    </h5>
                    <ul>
                      <li>Order will dispatch within <span>2 Hours</span></li>
                      <li>Order delivery within <span>3 days</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="tabs-details-gn mt-5">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === TABS.DESCRIPTION ? 'active' : ''}`}
                    onClick={() => handleTabChange(TABS.DESCRIPTION)}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === TABS.DESCRIPTION}
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === TABS.REVIEWS ? 'active' : ''}`}
                    onClick={() => handleTabChange(TABS.REVIEWS)}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === TABS.REVIEWS}
                  >
                    Review & Feedback
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === TABS.SHIPPING ? 'active' : ''}`}
                    onClick={() => handleTabChange(TABS.SHIPPING)}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === TABS.SHIPPING}
                  >
                    Shipping Policy
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {/* Description Tab */}
                {activeTab === TABS.DESCRIPTION && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="comon-desctiopn py-5">
                      <h3>Description</h3>
                      <p className="mt-3">
                        {activeProduct.description || 'No description available.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === TABS.REVIEWS && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="listing-paage-divb">
                      <div className="review-div-sec mt-4">
                        {/* Reviews would be loaded here */}
                        <p className="text-muted">Reviews functionality coming soon...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Tab */}
                {activeTab === TABS.SHIPPING && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="listing-paage-divb my-5">
                      <h5>Shipping Information</h5>
                      <p className="mt-3">
                        We offer fast and reliable shipping options for all our products.
                        Orders are processed within 1-2 business days and shipped via
                        our trusted carrier partners.
                      </p>
                      <p>
                        ONLINE RETURN POLICY
                        Effective as of: September 1 2025
                        1. RETURNS. We allow returns for refund only. We do not allow exchanges. For items purchased
                        online, returns are accepted within 30 days of the delivery date. To initiate a return, please contact us at
                        ecomix-support@gmail.com to obtain a return authorization. Be sure to include the item's order
                        number and your reason for the return. Returns that are shipped without authorization may not be
                        accepted. Please allow up to 10 business days for your refund to be processed once we receive your
                        return.
                        2. RETURN SHIPPING. Shipping instructions will be included with your return authorization.
                        3. ELIGIBLE ITEMS. The following items: Clearance items, Final Sale items, Perishable items,
                        Special-Order items, Custom Products, and Gift Cards are not eligible for return/exchange. We reserve
                        the right to refuse any return/exchange, at management's discretion, if the item being
                        returned/exchanged does not meet the criteria set forth within this policy.
                        4. CONDITION OF ITEMS. Except for items that were damaged when purchased, items must be in
                        new, unused, and in saleable condition with all original packaging intact and tags attached.
                        5. FORM OF PAYMENT. Refunds, if issued, will be issued in the original form of payment minus
                        shipping and handling fees unless otherwise stated. If the original form of payment is unavailable, store
                        credit may be issued at our discretion.
                        If you have any questions about this return policy, please contact us at fear.dedyn.io
                      </p>
                      <h5>Packaging & Delivery</h5>
                      <p className="mt-2">
                        All products are carefully packaged to ensure they arrive in
                        perfect condition. Delivery times may vary based on your location.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Products */}
            <div className="like-div-also mt-5">
              <h2>You may also like</h2>
              { /* <Recommended {...{ data: products }} /> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  </>
);
};

export default ProductDetails;