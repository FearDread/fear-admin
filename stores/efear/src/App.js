import React, { Suspense, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./contexts/routes/PrivateRoute";
import PublicRoute from "./contexts/routes/PublicRoute";

import Layout from "./pages/Layout";
import Home from './pages/Home';
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";

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
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;