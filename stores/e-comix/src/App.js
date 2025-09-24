import React, { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
// Layouts
import Layout from "./layouts/Layout";
// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import BlogDetails from "./pages/BlogDetails";
import Blog from "./pages/Blog";
import Collection from "./pages/Collection";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
// Policy Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy"; // Fixed duplicate import
// Protected Pages
import Wishlist from './pages/Wishlist';
import UserCart from "./pages/admin/UserCart";
import Profile from "./pages/admin/Profile";
import Checkout from "./pages/admin/Checkout";
import UserOrder from "./pages/admin/UserOrder";
// Route Components
import { PrivateRoutes } from "./routes/PrivateRoutes";
import { OpenRoutes } from "./routes/OpenRoutes";
// Components
import ScrollToTop from "./components/ScrollButton/ScrollToTop";
import Popup from "./components/PopupBanner/Popup";
// Store
import store from "./features/store";
// Styles
import "./assets/css/bootstrap.min.css";
import "./assets/css/site.icons.css";
import "./assets/css/aos.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/owl.theme.default.min.css";
import "./assets/css/site.styles.css";

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => (
  <PrivateRoutes>{children}</PrivateRoutes>
);

function App() {
  // Memoize user data to prevent unnecessary re-renders
  const user = useMemo(() => {
    return store.local.has("auth") ? store.local.get("auth") : null;
  }, []);

  // Redux selectors
  const productData = useSelector(state => state.product.data);
  const userData = useSelector(state => state.user.data);

  // Sync local storage with Redux state
  useEffect(() => {
    if (user && userData && userData.token === user.token) {
      store.local.set('auth', userData);
    }
  }, [userData, user]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout {...productData} />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="collection" element={<Collection />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetails />} />
            {/* Authentication Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {/* Policy Routes */}
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            {/* Protected Routes */}
            <Route 
              path="cart" 
              element={
                <ProtectedRoute>
                  <UserCart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="order" 
              element={
                <ProtectedRoute>
                  <UserOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="wishlist" 
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <PrivateRoutes>
                  <Profile />
                </PrivateRoutes>
              } 
            />
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Suspense>
      
      <ScrollToTop />
      {/* Uncomment when needed: <Popup /> */}
    </BrowserRouter>
  );
}

export default App;