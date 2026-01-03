import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchProduct,
  selectProductById,
  selectProductsLoading,
} from '../../features/products/slice';
import {
  selectBrandById,
} from '../../features/brands/slice';
import {
  addItem,
  selectIsInCart,
} from '../../features/cart/slice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../../features/wishlist/slice';
import Breadcrumbs from "../../components/common/Breadcrumbs";

export const ProductComparison = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get product IDs from URL query params (e.g., ?products=id1,id2,id3)
  const productIdsParam = searchParams.get('products');
  const [productIds, setProductIds] = useState([]);
  const [comparisonProducts, setComparisonProducts] = useState([]);
      const product = useSelector(selectProductById);
      const brand = useSelector(selectBrandById)
      const isInCart = useSelector(selectIsInCart);
      const isInWishlist = useSelector(selectIsInWishlist);
    
      const products = productIds.map(id => {
        return {
          ...product,
      };
    }).filter(Boolean);
    
  // Parse product IDs from URL
  useEffect(() => {
    if (productIdsParam) {
      const ids = productIdsParam.split(',').filter(Boolean);
      setProductIds(ids);
    }
  }, [productIdsParam]);

  // Fetch products based on IDs
  useEffect(() => {
    if (productIds.length > 0) {
      productIds.forEach(id => {
        dispatch(fetchProduct({ id }));
      });
    }
    if ( products && products.length > 0 ) {
      setComparisonProducts(products);
    }
  }, [productIds, dispatch]);

  // Get products from Redux store
  const loading = useSelector(selectProductsLoading);

  const handleAddToCart = (product) => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      id: product._id,
      name: product.title,
      title: product.title,
      image: product.images?.[0]?.url || '',
      price: product.salePrice || product.price,
      quantity: 1,
      sku: product.sku,
    };

    dispatch(addItem(cartItem));
    alert(`${product.title} added to cart!`);
  };

  // Handle remove from comparison
  const handleRemoveFromComparison = (productId) => {
    const updatedIds = productIds.filter(id => id !== productId);
    
    if (updatedIds.length === 0) {
      navigate('/products');
    } else {
      navigate(`/comparison?products=${updatedIds.join(',')}`);
    }
  };

  // Handle add/remove wishlist
  const handleToggleWishlist = (product) => {
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

    if (product.isInWishlist) {
      dispatch(removeFromWishlist(wishlistItem.id));
    } else {
      dispatch(addToWishlist(wishlistItem));
    }
  };

  // Render rating stars
  const renderStars = (rating) => {
    return (
      <>
        {rating || 0} <i className='bx bxs-star text-warning'></i>
      </>
    );
  };

  // Get comparison attributes
  const getComparisonAttributes = () => {
    if (comparisonProducts.length === 0) return [];

    return [
      { key: 'price', label: 'Price', render: (product) => `$${(product.salePrice || product.price)?.toFixed(2)}` },
      { key: 'sku', label: 'Model', render: (product) => product.sku || product._id },
      { key: 'brand', label: 'Brand', render: (product) => product.brand?.name || 'N/A' },
      { key: 'rating', label: 'Rating', render: (product) => renderStars(product.rating) },
      { key: 'description', label: 'Summary', render: (product) => product.shortDescription || product.description || 'No description available' },
    ];
  };

  // Loading state
  if (loading && comparisonProducts.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products for comparison...</p>
      </div>
    );
  }

  // No products to compare
  if (comparisonProducts.length === 0) {
    return (
      <>
        <section className="py-3 border-bottom d-none d-md-flex">
          <div className="container">
            <div className="page-breadcrumb d-flex align-items-center">
              <h3 className="breadcrumb-title pe-3">Product comparison</h3>
              <div className="ms-auto">
            <Breadcrumbs 
             items={[
                { label: 'Products', path: '/shop', icon: 'bx bx-shopping-bag', isActive: true },
              ]} />
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container text-center py-5 content-card">
            
            <i className="bx bx-list-check display-1 text-muted"></i>
            <h3 className="mt-3">No Products to Compare</h3>
            <p className="text-muted">Add products to your comparison list to see them here.</p>
            
            <button className="btn btn-primary btn-dark btn-ecomm" onClick={() => navigate('/shop')}>
              Browse Products
            </button>
          </div>
        </section>
      </>
    );
  }

  const attributes = getComparisonAttributes();

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Product comparison</h3>
            <div className="ms-auto">
            <Breadcrumbs 
             items={[
                { label: 'Products', path: '/shop', icon: 'bx bx-shopping-bag', isActive: true },
              ]} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Comparing {comparisonProducts.length} Products</h3>
            <button 
              className="btn btn-dark btn-ecomm btn-sm"
              onClick={() => navigate('/shop')}
            >
              <i className="bx bx-plus me-1"></i>Add More Products
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th className="align-middle text-center" style={{ width: '200px' }}>
                    <p className="mb-0 text-uppercase fs-5 fw-light text-white">
                      Product<br />Details
                    </p>
                  </th>
                  {comparisonProducts.map((product) => (
                    <th key={product._id} className="align-middle text-center">
                      <div className="position-relative">
                        <button
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                          onClick={() => handleRemoveFromComparison(product._id)}
                          title="Remove from comparison"
                        >
                          <i className="bx bx-x"></i>
                        </button>
                        <img 
                          src={product.images?.[0]?.url || 'assets/images/products/placeholder.png'} 
                          alt={product.title}
                          width="230"
                          className="img-fluid"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/products/${product._id}`)}
                        />
                        <h6 className="mt-2 mb-0">{product.title}</h6>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr) => (
                  <tr key={attr.key}>
                    <td className="fw-bold">{attr.label}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product._id} className="text-center">
                        {attr.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Stock Status Row */}
                <tr>
                  <td className="fw-bold">Stock Status</td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="text-center">
                      {product.quantity > 0 ? (
                        <span className="badge bg-success">In Stock ({product.quantity})</span>
                      ) : (
                        <span className="badge bg-danger">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Action Buttons Row */}
                <tr>
                  <td className="fw-bold">Actions</td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="text-center">
                      <div className="d-flex flex-column gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-white btn-ecomm btn-sm"
                          disabled={!product.quantity || product.isInCart}
                        >
                          <i className={`bx ${product.isInCart ? 'bx-check' : 'bxs-cart-add'} me-1`}></i>
                          {product.isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className={`btn btn-ecomm btn-sm ${product.isInWishlist ? 'btn-warning' : 'btn-light'}`}
                        >
                          <i className={`bx ${product.isInWishlist ? 'bxs-heart' : 'bx-heart'} me-1`}></i>
                          {product.isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bx bx-show me-1"></i>View Details
                        </button>
                        <button
                          onClick={() => handleRemoveFromComparison(product._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <i className="bx bx-trash me-1"></i>Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Helpful Tips */}
          <div className="alert alert-info mt-4">
            <h6 className="alert-heading">
              <i className="bx bx-info-circle me-2"></i>Comparison Tips
            </h6>
            <ul className="mb-0">
              <li>Compare up to 4 products at once for better decision making</li>
              <li>Click on product images to view full details</li>
              <li>Add products to cart directly from the comparison table</li>
              <li>Remove products you don't want to compare anymore</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductComparison;