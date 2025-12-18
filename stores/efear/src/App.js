import React, { Suspense, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./contexts/routes/PrivateRoute";
import PublicRoute from "./contexts/routes/PublicRoute";

import Layout from "./pages/Layout";
import Home from './pages/Home';
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/shop/Shop";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductComparison from "./pages/products/ProductComparison";
import ProductDetails from "./pages/products/ProductDetails";


import { useRouter } from "./contexts/Router";

import './assets/css/bootstrap.min.css';
import './assets/css/icons.css';
import './assets/css/index.css';
import './assets/css/pace.min.css';
import './assets/css/app.css';

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const App = () => {
  const { currentRoute } = useRouter();

  const renderRoute = () => {
    console.log('current route = ', currentRoute);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PublicRoute><Home /></PublicRoute>} /> 
            <Route path="about" element={<PublicRoute><About /></PublicRoute>} />
            <Route path="shop" element={<PublicRoute><Shop /></PublicRoute>} />
            <Route path="contact" element={<PublicRoute><Contact /></PublicRoute>} />
            <Route path="blog" element={<PublicRoute><Blog /></PublicRoute>} />
            <Route path="product/:id" element={<PublicRoute><ProductDetails /></PublicRoute>} />
            <Route path="product/compare" element={<PublicRoute><ProductComparison /></PublicRoute>} />
            <Route path="auth/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="auth/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* 
            <Route path="account/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="account/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="account/details" element={<PrivateRoute><UserDetails /></PrivateRoute>} />
            <Route path="account/payment-methods" element={<PrivateRoute><PaymentMethods /></PrivateRoute>} />
            <Route path="account/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
            <Route path="account/forgot-password" element={<PrivateRoute><ForgotPassword /></PrivateRoute>} />
            */}
            </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;