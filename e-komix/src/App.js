import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./Assets/App/App.css";

import Home from "../src/Pages/Home";
import About from "../src/Pages/About";
import Shop from "../src/Pages/Shop";
import Contact from "../src/Pages/Contact";
import Blog from "../src/Pages/Blog";
import Header from "../src/Components/Header/Navbar";
import Footer from "../src/Components/Footer/Footer";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/ScrollButton/ScrollToTop";
import Authentication from "./Pages/Authentication";
import ResetPass from "./Components/Authentication/Reset/ResetPass";
import BlogDetails from "./Components/Blog/BlogDetails/BlogDetails";
import TermsConditions from "./Pages/TermsConditions";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import Popup from "./Components/PopupBanner/Popup";
import Profile from "./Components/User/Profile";
//import MyOrder from "./Components/Order/MyOrder";
import PrivateRoute from "./Route/PrivateRoute";
/////import Shipping from "./Components/Cart/Shipping/Shipping";
//import UpdatePassword from "./Components/User/UpdatePassword";
/////import ForgetPassword from "./Components/User/ForgetPassword";
//import ResetPassword from "./Components/User/ResetPassword";
//import UpdateProfile from "./Components/User/UpdateProfile";
import { Toaster } from "react-hot-toast";
import { cruds, cart, auth } from "@feardread/crud-service";
// import Cart from "./Componentss/Cart/Cart/Cart";

const App = () => {
  return (
    <>
      <Popup />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/resetPassword" element={<ResetPass />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<TermsConditions />} />
          <Route path="/authentication" element={<Authentication />} />
          
          <Route 
            path="/cart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>} 
          />
          <Route
            path="/account" element={<PrivateRoute><Profile /></PrivateRoute>}
          />
          {/*
          
 
          <PrivateRoute path="/forgot" element={<ForgetPassword />} />
          <PrivateRoute path="/profile/update" element={<UpdateProfile />} />
          <PrivateRoute path="/password/update" element={<UpdatePassword />} />
          <PrivateRoute path="/orders" element={<MyOrder />} />
          <PrivateRoute path="/shipping" element={<Shipping />} />
          */}
          <Route path="*" element={<NotF87ound />} />
        </Routes>
        <ScrollToTop />
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
