import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
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
import cache from "../features/factory/cache";
import { store } from "../features/store";
import { Cart } from "../features/cart/slice";
import { Auth } from "../features/user/slice";
import { Product } from "../features/products/slice";

const Layout = (props) => {
  
  const localData = store.local.has("auth") ? store.local.get("auth") : undefined;
  const cartData = useSelector( state => state.cart.data );

  useEffect(() => {
  
    AOS.init({
      offset: 100,
      easing: 'ease',
      delay: 0,
      duration: 800
    });

  }, []);

  useEffect(() => {

    if ( localData && localData.token ) store.dispatch(Cart.getUserCart({id: localData.user._id}));

  }, [])
  return (
    <>
      <Header cart={cartData} user={localData.user} />
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
