import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  selectProductsLoading,
} from '../../features/products/slice';
import {
  addItem,
} from '../../features/cart/slice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../features/wishlist/slice';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductComparisonCard from '../../components/products/ProductComparisonCard';
import BrandSection from '../../components/home/BrandSection';

const COMPARE_STORAGE_KEY = 'comparisonProductIds';

export const ProductComparison = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productIdsParam = searchParams.get('products');
  const productIds = useMemo(
    () => (productIdsParam ? productIdsParam.split(',').filter(Boolean) : []),
    [productIdsParam]
  );
  const loading = useSelector(selectProductsLoading);

  const handleAddToCart = (product) => {
    if (!product) return;
    dispatch(
      addItem({
        productId: product._id,
        id:        product._id,
        name:      product.title,
        title:     product.title,
        image:     product.images?.[0]?.url || '',
        price:     product.salePrice || product.price,
        quantity:  1,
        sku:       product.sku,
      })
    );
  };

  const handleRemoveFromComparison = (productId) => {
    const updatedIds = productIds.filter((id) => id !== productId);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(updatedIds));
    navigate(updatedIds.length === 0 ? '/shop' : `/product-comparison?products=${updatedIds.join(',')}`);
  };

  const handleToggleWishlist = (product) => {
    if (!product) return;
    const item = {
      id:            product._id,
      productId:     product._id,
      title:         product.title,
      name:          product.title,
      image:         product.images?.[0]?.url || '',
      price:         product.salePrice || product.price,
      originalPrice: product.price,
      rating:        product.rating,
      sku:           product.sku,
    };
    if (product.isInWishlist) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item));
    }
  };
  const BreadcrumbSection = () => (
    <section className="py-3 border-bottom d-none d-md-flex">
      <div className="container">
        <div className="page-breadcrumb d-flex align-items-center">
          <h3 className="breadcrumb-title pe-3">Product Comparison</h3>
          <div className="ms-auto">
            <Breadcrumbs
              items={[{ label: 'Products', path: '/shop', icon: 'bx bx-shopping-bag', isActive: true }]}
            />
          </div>
        </div>
      </div>
    </section>
  );

  if (loading && productIds.length > 0) {
    return (
      <>
        <BreadcrumbSection />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p className="mt-3">Loading products for comparison…</p>
        </div>
      </>
    );
  }

  if (productIds.length === 0) {
    return (
      <>
        <BreadcrumbSection />
        <section className="py-5">
          <div className="container text-center py-5 content-card">
            <i className="bx bx-list-check display-1 text-muted" />
            <h3 className="mt-3">No Products to Compare</h3>
            <p className="text-muted">Add products to your comparison list to see them here.</p>
            <button
              className="btn btn-primary btn-dark btn-ecomm"
              onClick={() => navigate('/shop')}
            >
              Browse Products
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BreadcrumbSection />

      <section className="py-4">
        <div className="container">

          {/* Page header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">
              Comparing {productIds.length} Product{productIds.length !== 1 ? 's' : ''}
            </h3>
            <button className="btn btn-dark btn-ecomm btn-sm" onClick={() => navigate('/shop')}>
              <i className="bx bx-plus me-1" />Add More Products
            </button>
          </div>

          {/* All product cards in one responsive row, max 4 across */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
            {productIds.map((id) => (
              <div key={id} className="col">
                <ProductComparisonCard
                  productId={id}
                  onRemove={handleRemoveFromComparison}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="alert alert-info mt-4 bg-dark-4">
            <h6 className="alert-heading">
              <i className="bx bx-info-circle me-2" />Comparison Tips
            </h6>
            <ul className="mb-0 text-light">
              <li>Compare up to 4 products at once for better decision making</li>
              <li>Click product images or titles to view full details</li>
              <li>Add to cart or wishlist directly from the product cards</li>
              <li>Hit the <strong>×</strong> on any card to remove it from comparison</li>
            </ul>
          </div>

        </div>
      </section>
            <BrandSection />
    </>
  );
};

export default ProductComparison;