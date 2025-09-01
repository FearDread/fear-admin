import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
// Components
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Subscribe from "../components/Subscribe/Subscribe"; 
import LoginModal from "../components/Modals/LoginModal";
import RegisterModal from "../components/Modals/RegisterModal";
import OffCanvasModal from "../components/Modals/OffCanvasModal";
// Store and actions
import { store } from "../features/store";
import { Cart } from "../features/cart/slice";
// Styles
import "react-toastify/dist/ReactToastify.css";

// Constants
const AOS_CONFIG = {
  offset: 100,
  easing: 'ease',
  delay: 0,
  duration: 800
};

const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light"
};

const Layout = (productData) => {
  const dispatch = useDispatch();
  
  // Memoize auth data to prevent unnecessary re-renders
  const authData = useMemo(() => {
    return store.local.has("auth") ? store.local.get("auth") : null;
  }, []);
  
  const cartData = useSelector(state => state.cart.data);
  const user = authData?.user || null;

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init(AOS_CONFIG);
  }, []);

  // Load user cart if authenticated
  useEffect(() => {
    console.log('productData = ', productData);
    if (authData?.token && authData?.user?._id) {
      dispatch(Cart.getUserCart({ id: authData.user._id }));
    }
  }, [authData, dispatch]);

  return (
    <>
      <Header {...cartData} {...user} />
      <main>
        <Outlet  {...productData} />
      </main>
      <Subscribe />
      <Footer />
      
      {/* Modals */}
      <LoginModal />
      <RegisterModal />
      <OffCanvasModal />
      
      {/* Toast Notifications */}
      <ToastContainer {...TOAST_CONFIG} />
    </>
  );
};

export default Layout;
