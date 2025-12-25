import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  getFeaturedProducts,
  selectAllProducts,
  selectFeaturedProducts,
  selectProductsLoading,
  selectProductsError
} from '../../features/products/slice';
import { dispatch } from "../../features/store";

// Product list item component
const ProductListItem = ({ product }) => {
  const renderStars = (rating = 5) => {
    return [...Array(rating)].map((_, i) => (
      <i key={i} className="bx bxs-star text-white"></i>
    ));
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="bottom-product-img">
          <a href={`/product-details/${product.id}`}>
            <img 
              src={product.image || product.thumbnail || 'assets/images/products/placeholder.png'} 
              width="100" 
              alt={product.title || 'Product'} 
            />
          </a>
        </div>
        <div className="ms-0">
          <h6 className="mb-0 fw-light mb-1">
            {product.title || product.name || 'Product Name'}
          </h6>
          <div className="rating font-12">
            {renderStars(product.rating)}
          </div>
          <p className="mb-0 text-white">
            <strong>${product.price?.toFixed(2) || '0.00'}</strong>
          </p>
        </div>
      </div>
      <hr/>
    </>
  );
};

// Product list section component
const ProductListSection = ({ title, products, loading }) => {
  if (loading) {
    return (
      <div className="col">
        <div className="mb-3">
          <h6 className="mb-3 text-uppercase">{title}</h6>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col">
        <div className="mb-3">
          <h6 className="mb-3 text-uppercase">{title}</h6>
          <p className="text-white">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col">
      <div className="mb-3">
        <h6 className="mb-3 text-uppercase">{title}</h6>
        {products.slice(0, 4).map((product, index) => (
          <ProductListItem key={product.id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export const BestSelling = ({ products }) => {
  const allProducts = useSelector(selectAllProducts);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // Fetch products on mount
  useEffect(() => {

    if (!products) dispatch(fetchProducts());
    dispatch(getFeaturedProducts());

  }, [dispatch]);

  // Derive product lists from data
  const bestSellingProducts = allProducts
    .filter(p => p.sales || p.bestseller)
    .sort((a, b) => (b.sales || 0) - (a.sales || 0));

  const newArrivals = allProducts
    .filter(p => p.isNew || p.newArrival)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const topRatedProducts = allProducts
    .filter(p => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (error) {
    return (
      <section className="py-4 border-top">
        <div className="container">
          <div className="alert alert-danger">
            Error loading products: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 border-top">
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
          <ProductListSection 
            title="Best Selling Products" 
            products={bestSellingProducts}
            loading={loading}
          />
          
          <ProductListSection 
            title="Featured Products" 
            products={featuredProducts}
            loading={loading}
          />
          
          <ProductListSection 
            title="New arrivals" 
            products={newArrivals}
            loading={loading}
          />
          
          <ProductListSection 
            title="Top rated Products" 
            products={topRatedProducts}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}

export default BestSelling;