import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import { Product } from "../features/products/slice";

const Layout = () => {
  const dispatch = useDispatch(); 
  const products = useSelector(state => state.products);

  const fetchProducts = () => {
    dispatch(Product.fetch());
  }

  useEffect(() => {
    fetchProducts();
    //console.log('p state ', state);
    console.log('products = ', products);
  }, [])

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