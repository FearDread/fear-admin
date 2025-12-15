import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";



const Layout = () => {

  return (
    <>
      <b className="screen-overlay"></b>
      <div className="wrapper">
        <Header />
      </div>
      <div className="page-wrapper">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;