import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "assets/_css/App.css";
import Home from "pages/Home";
import About from "pages/About";
import Shop from "pages/Shop";
import Contact from "pages/Contact";
import Blog from "pages/Blog";
import Header from "components/Header/Navbar";
import Footer from "components/Footer/Footer";
import ProductDetails from "pages/ProductDetails";
import NotFound from "pages/NotFound";
import ScrollToTop from "components/ScrollButton/ScrollToTop";
import Authentication from "pages/Authentication";
import ResetPass from "components/Authentication/Reset/ResetPass";
import BlogDetails from "components/Blog/BlogDetails/BlogDetails";
import TermsConditions from "pages/TermsConditions";
import ShoppingCart from "components/ShoppingCart/ShoppingCart";
import Popup from "components/PopupBanner/Popup";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Popup />
      <ScrollToTop />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/loginSignUp" element={<Authentication />} />
          <Route path="/resetPassword" element={<ResetPass />} />
          <Route path="/BlogDetails" element={<BlogDetails />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
