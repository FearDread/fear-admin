// export { default as AuthRouter } from "./AuthRouter";
// export { default as AppRouter } from "./AppRouter";
import React, { useEffect } from "react";
//import { Route } from "react-router-dom";
import AuthRouter from "./AuthRouter";
import AppRouter from "./AppRouter";

//import { Layout } from "antd";
//import Navigation from "@/layout/Navigation";
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";

import { useSelector } from "react-redux";
//import { selectAuth } from "_redux/auth/selectors";

export default function Router() {
  const { isLoggedIn } = useSelector((state) => state.auth);
 // const { isLoggedIn } = useSelector(selectAuth);

  useEffect(() => {
    console.log("isLoggedIn : ", isLoggedIn);
    
  }, [isLoggedIn]);

  if (isLoggedIn === false)
    return (
      <AuthRouter />
    );
  else
    return (
      <AppRouter />
    );
}
// export default App;
