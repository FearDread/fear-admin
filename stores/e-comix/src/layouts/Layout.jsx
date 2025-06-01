import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import BannerMain from "../components/Banner/BannerMain";
import Subscribe from "../components/Subscribe/Subscribe"; 
import LoginModal from "../components/Modals/LoginModal";
import RegisterModal from "../components/Modals/RegisterModal";
import OffCanvasModal from "../components/Modals/OffCanvasModal";
import AOS from "aos";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {


  useEffect(() => {
    /*
    window.addEventListener("scroll", () => {
      var height = window.scrollY;
      if (height > 100) {
        document.documentElement.classList.add('fixed-menu')
      } else {
        document.documentElement.classList.remove('fixed-menu');
      }
    });
  */
    AOS.init({
      offset: 100,
      easing: 'ease',
      delay: 0,
      duration: 800
    });

  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Subscribe />
      <Footer />
      <LoginModal />
      <RegisterModal />
      <OffCanvasModal />   
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Layout;
