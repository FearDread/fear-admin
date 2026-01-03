import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import BestSelling from "../components/products/BestSelling";

import { dispatch } from "../features/store";
import { Product, selectProductsSuccess } from "../features/products/slice";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../features/products/slice';
import { fetchCategories, selectAllCategories } from '../features/categories/slice';
import ProductQuickView from "../components/products/ProductQuickView";

// Load Stripe with publishable key from environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
  }, []);

  // Stripe options configuration
  const stripeOptions = useMemo(() => ({
    // Stripe Elements appearance customization
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  }), []);

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
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
          <BestSelling />
        </div>
      </div>
      <Footer categories={(!loading) ? categories : []} products={products}/>

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
    </Elements>
  );
};

export default Layout;