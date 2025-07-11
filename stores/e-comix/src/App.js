import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import SingleProduct from "./pages/SingleProduct";
import BlogDetails from "./pages/BlogDetails";
import Blog from "./pages/Blog";
import Cart from "./pages/Cart";
//import Wishlist from "./pages/Wishlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
//import ForgotPassword from "./pages/Forgotpassword";
import ScrollToTop from "./components/ScrollButton/ScrollToTop";
import Popup from "./components/PopupBanner/Popup";
import Collection from "./pages/Collection";
import Shop from "./pages/Shop"; 

import { PrivateRoutes } from "./routes/PrivateRoutes";
import { OpenRoutes } from "./routes/OpenRoutes";

import "./assets/css/bootstrap.min.css";
import "./assets/css/site.icons.css";
import "./assets/css/aos.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/owl.theme.default.min.css";
import "./assets/css/site.styles.css";


function App() {
  return (
    <>
      <Popup />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="collection" element={<Collection />} />
            <Route path="shop" element={<Shop />} />

            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetails />} />
            <Route
              path="cart"
              element={
                <PrivateRoutes>
                  <Cart />
                </PrivateRoutes>
              }
            />
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
            <Route
              path="checkout"
              element={
                <PrivateRoutes>
                  <Checkout />
                </PrivateRoutes>
              }
            />
            <Route path="compare-product" element={<CompareProduct />} />
            <Route
              path="wishlist"
              element={
                <PrivateRoutes>
                  <Wishlist />
                </PrivateRoutes>
              }
            />
          {/*  <Route path="terms" element={<Terms />} />
            <Route path="product/:id" element={<ProductDetails />} /> 
            <Route path="reset-password/:token" element={<Resetpassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPloicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="term-conditions" element={<TermAndContions />} />
            */}
            </Route>
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </>
  );
}

export default App;
