import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import { dispatch } from "../features/store";
import { Product, selectProductsSuccess } from "../features/products/slice";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsLoadingState,
  selectProductsError,
  selectOperationStatus
} from '../features/products/slice';
import { fetchCategories, selectAllCategories } from '../features/categories/slice';
import { fetchBrands, selectAllBrands } from '../features/brands/slice';

const Layout = () => {
  // Select data from store
  const products = useSelector(selectAllProducts); // Now includes filtering & sorting
  const categories = useSelector(selectAllCategories);
  const brands = useSelector(selectAllBrands);
  const loading = useSelector(selectProductsLoading);
  const success = useSelector(selectProductsSuccess);
  const error = useSelector(selectProductsError);
  const loadingState = useSelector(selectProductsLoadingState);
  //const fetchStatus = useSelector(state => selectOperationStatus(state, 'fetch'));

  // Manual refresh
  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  // Fetch data on component mount
  useEffect(() => {

    dispatch(fetchProducts());
    dispatch(fetchCategories());
    //dispatch(fetchBrands());


  }, [dispatch]);


  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="error-container">
        <p>Error: {error.message || error}</p>
        <button onClick={handleRefresh}>Retry</button>
      </div>
    );
  }

  if (!loading && products.length > 0 || success) {
    console.log('categories = ', categories);
  }

  return (
    <>
      <b className="screen-overlay"></b>
      <div className="wrapper">
        <Header />
      </div>
      <div className="page-wrapper">
        <div className="page-content">

          {(!loading && products.length > 0) && (
            <>
              <Outlet {...products} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
};

export default Layout;