import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
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
            <Route path="blog" element={<Blog />} />
          {/*  <Route path="terms" element={<Terms />} />
            <Route path="product/:id" element={<ProductDetails />} /> */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </>
  );
}

export default App;
