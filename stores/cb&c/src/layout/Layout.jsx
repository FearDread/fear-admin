import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export const Layout = () => {

    return (
            <>
            <div className="bg-gray-900 text-white min-h-screen">
              <Header />
                <Outlet />
              <Footer />

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
                theme="dark"
              />
              </div>
            </>
    )
}

export default Layout;