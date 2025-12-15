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

import './assets/css/app.css';

const App = () => {
  const { currentRoute } = useRouter();

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return (
          <PublicRoute>
            <Home />
          </PublicRoute>
        );

      case '/shop':
        return (
          <PublicRoute>
            <Shop />
          </PublicRoute>
        );

        // AUTH AND ADMIN PAGES
      case '/login':
        return <Login />;

      case '/admin/dashboard':
        return (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        );

      case '/admin/orders':
        return (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        );

      default:
        return (
          <PublicRoute>
            <Home />
          </PublicRoute>
        );
    }
  };

  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<Layout />}>
            {currentRoute !== '/login'}
            {renderRoute()}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;