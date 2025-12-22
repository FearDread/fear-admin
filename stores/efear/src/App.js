// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./contexts/routes/PrivateRoute";
import PublicRoute from "./contexts/routes/PublicRoute";
// Layout
import Layout from "./pages/Layout";

// Eager-loaded components (critical for initial render)
import Home from './pages/Home';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Lazy-loaded components (code splitting for better performance)
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const ShopCategories = lazy(() => import("./pages/shop/ShopCategories"));
const ProductComparison = lazy(() => import("./pages/products/ProductComparison"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));

// Account pages (lazy loaded)
/*
const Dashboard = lazy(() => import("./pages/account/Dashboard"));
const Orders = lazy(() => import("./pages/account/Orders"));
const UserDetails = lazy(() => import("./pages/account/UserDetails"));
const PaymentMethods = lazy(() => import("./pages/account/PaymentMethods"));
const Addresses = lazy(() => import("./pages/account/Addresses"));
//const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
// Error pages
//const Unauthorized = lazy(() => import("./pages/Unauthorized"));
*/
/**
 * Loading fallback component with better UX
 */
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading...</p>
    </div>
  </div>
);

/**
 * 404 Not Found Page
 */
const NotFound = () => (
  <div className="container">
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  </div>
);

/**
 * Route configuration for better organization
 */
const routeConfig = {
  public: [
    { path: "/", element: <Home />, exact: true },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/blog", element: <Blog /> },
    { path: "/shop", element: <Shop /> },
    { path: "/shop-categories", element: <ShopCategories /> },
    { path: "/product/:id", element: <ProductDetails /> },
    { path: "/compare", element: <ProductComparison /> },
  ],
  auth: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    //{ path: "/forgot-password", element: <ForgotPassword /> },
  ],
  protected: []
  /*
  protected: [
    { path: "/account/dashboard", layout: <AdminLayout />, element: <Dashboard /> },
    { path: "/account/orders", element: <Orders /> },
    { path: "/account/details", element: <UserDetails /> },
    { path: "/account/payment-methods", element: <PaymentMethods /> },
    { path: "/account/addresses", element: <Addresses /> },
  ],
  */
};

/**
 * Main App Component
 */
export const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" exact element={<Layout />}>
            {routeConfig.public.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PublicRoute>{route.element}</PublicRoute>}
              />
            ))}

            {routeConfig.auth.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PublicRoute restricted>{route.element}</PublicRoute>}
              />
            ))}
            {routeConfig.protected.map((route) => (
              <Route path="/account" element={
                <Route key={route.path} path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
              }
              />
            ))}

            <Route path="/unauthorized" element={<NotFound />} />
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;