import React, { useEffect, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";



const AuthLayout = (props) => {
  React.useEffect(() => {
    document.documentElement.classList.remove("nav-open");
  });


  return (
    <>
        
    <div id="wrapper">
      <div className="loader-wrapper"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
      <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
