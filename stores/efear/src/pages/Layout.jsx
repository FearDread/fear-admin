import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import { store } from "../features/store";
import { Product } from "../features/products/slice";

const Layout = () => {
  const dispatch = store.dispatch; 
  //const products = useSelector(state => state.products);
  const { loading, loadingState, data: products } = useSelector(state => state.products)

  useEffect(() => {

    if (loading) {

    }
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