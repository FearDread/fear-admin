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
import UserCart from "./pages/admin/UserCart";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ScrollToTop from "./components/ScrollButton/ScrollToTop";
import Popup from "./components/PopupBanner/Popup";
import Collection from "./pages/Collection";
import Terms from "./pages/Terms";
import Shop from "./pages/Shop";
import RefundPolicy from "./pages/PrivacyPolicy";
//import Checkout from "./pages/admin/Checkout"
import Login from "./pages/admin/Login";
import Wishlist from './pages/Wishlist';
//import Wishlist from "./pages/Wishlist";
//import ForgotPassword from "./pages/Forgotpassword";

import { PrivateRoutes } from "./routes/PrivateRoutes";
import { OpenRoutes } from "./routes/OpenRoutes";


import "./assets/css/bootstrap.min.css";
import "./assets/css/site.icons.css";
import "./assets/css/aos.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/owl.theme.default.min.css";
import "./assets/css/site.styles.css";


function App() {
  const products = useSelector(state => state.product.data);
  //const { user } = useSelector( state => state.user );

  return (
    <>
      <Popup />
      <BrowserRouter>
        <Suspense >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home {...products} />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="collection" element={<Collection {...products} />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogDetails />} />
              <Route path="shipping-policy" element={<ShippingPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="refund-policy" element={<RefundPolicy />} />

              <Route path="login" element={<Login />} />
              
              <Route
                path="cart"
                element={
                  <PrivateRoutes>
                    <UserCart />
                  </PrivateRoutes>
                }
              />      
              <Route
                path="wishlist"
                element={
                  <PrivateRoutes>
                    <Wishlist />
                  </PrivateRoutes>
                }
              />


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
