import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import BestSelling from "../components/common/BestSelling";

import { dispatch } from "../features/store";
import { Product, selectProductsSuccess } from "../features/products/slice";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsLoadingState,
  selectProductsError,
  selectSortedProducts
} from '../features/products/slice';
import { fetchCategories, selectAllCategories } from '../features/categories/slice';
import ProductQuickView from "../components/products/ProductQuickView";

const Layout = () => {
  // Select data from store
  const products = useSelector(selectAllProducts); // Now includes filtering & sorting
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectProductsLoading);
  const success = useSelector(selectProductsSuccess);
  const error = useSelector(selectProductsError);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };
  // Manual refresh
  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  // Fetch data on component mount
  useEffect(() => {

    dispatch(fetchProducts());
    dispatch(fetchCategories());

  }, [dispatch]);

  return (
    <>
      <b className="screen-overlay"></b>
      <div className="wrapper">
        <Header />
      </div>
      <div className="page-wrapper">
        <div className="page-content">
          {(loading && products.length === 0) && (
            <>
              <div className="loading-container">
                <p>Loading products...</p>
              </div>
            </>
          )}
          {(!loading && error) && (
            <>
              <div className="error-container">
                <p>Error: {error.message || error}</p>
                <button onClick={handleRefresh}>Retry</button>
              </div>
            </>
          )}
          {(!loading && products.length > 0) && (
            <>
              <Outlet {...products} />
            </>
          )}
          <BestSelling />
        </div>
      </div>
      <Footer />

      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  )
};

export default Layout;