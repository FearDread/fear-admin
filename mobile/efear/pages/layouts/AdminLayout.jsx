import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import { dispatch } from "../features/store";
import { fetchCategories, selectAllCategories } from '../features/categories/slice';

const AdminLayout = () => {
  const categories = useSelector(selectAllCategories);
  // Manual refresh
  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  // Fetch data on component mount
  useEffect(() => {


    dispatch(fetchCategories());

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
        <Outlet />
        </div>
      </div>
      <Footer />
    </>
  )
};

export default AdminLayout;