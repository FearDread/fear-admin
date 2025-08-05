import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import BlogDetails from "./pages/BlogDetails";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ScrollToTop from "./components/ScrollButton/ScrollToTop";
import Popup from "./components/PopupBanner/Popup";
import Collection from "./pages/Collection";
import Terms from "./pages/Terms";
import Shop from "./pages/Shop";
import RefundPolicy from "./pages/PrivacyPolicy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from './pages/Wishlist';
import UserCart from "./pages/admin/UserCart";
import Profile from "./pages/admin/Profile";
import Checkout from "./pages/admin/Checkout";
import UserOrder from "./pages/admin/UserOrder";
import { PrivateRoutes } from "./routes/PrivateRoutes";
import { OpenRoutes } from "./routes/OpenRoutes";

import store from "./features/store";

import "./assets/css/bootstrap.min.css";
import "./assets/css/site.icons.css";
import "./assets/css/aos.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/owl.theme.default.min.css";
import "./assets/css/site.styles.css";


function App() {
  const user = (store.local.has("auth")) ? store.local.get("auth") : undefined;
  //const { data: userState, success } = useSelector(state => state.user);
  const products = useSelector(state => state.product.data);
  const check = useSelector(state => state.user.data);


  useEffect(() => {
  
    if ( user && (check.token == user.token) ) {
      store.local.set('auth', check);
    }
  }, [check, user]);

  return (
    <>
      {/* <Popup  /> */ }
      <BrowserRouter>
        <Suspense >
          <Routes>
            
            <Route path="/" element={<Layout {...products} />}>
              
              <Route index element={<Home />} />

                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="collection" element={<Collection />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogDetails />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="refund-policy" element={<RefundPolicy />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              
              <Route
                path="cart"
                element={
                  <PrivateRoutes>
                    <UserCart />
                  </PrivateRoutes>
                } />  
                              <Route
                path="order"
                element={
                  <PrivateRoutes>
                    <UserOrder />
                  </PrivateRoutes>
                } />    
              <Route
                path="wishlist"
                element={
                  <PrivateRoutes>
                    <Wishlist />
                  </PrivateRoutes>
                } />
              
              <Route
                path='profile'
                element={
                  <PrivateRoutes>
                    <Profile />
                  </PrivateRoutes>
                } /> 
              <Route
                path='checkout'
                element={
                  <PrivateRoutes>
                    <Checkout />
                  </PrivateRoutes>
                } /> 
           {/*
                <Route
                  path='order'
                  element={
                    <PrivateRoutes>
                      <UserOrder />
                    </PrivateRoutes>
                } />
                */}
            </Route>
          </Routes>
        </Suspense>
        <ScrollToTop />
      </BrowserRouter>
    </>
  );
}

export default App;

{ /*
            <Route
              path="orders"
              element={
                <PrivateRoutes>
                  <Orders />
                </PrivateRoutes>
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
            */}
