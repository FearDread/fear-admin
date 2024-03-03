import React, { useEffect, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";
import { useSelector } from "react-redux";
import Loader from "components/Loader/Loading";

export default function Router() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    console.log("isLoggedIn : ", isLoggedIn);
  }, [isLoggedIn]);

  if (isLoggedIn === false)
    return (
    <Suspense fallback={<Loader />}>
        <Switch location={location} key={location.pathname}>
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
          <Redirect path="/" to="/auth/login" />
        </Switch>
    </Suspense>
  )
  else
    return (
    <Suspense fallback={<Loader />}>
        <Switch location={location}>
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Redirect path="/*" to="/admin/dashboard" />
        </Switch>
    </Suspense>
  )
}
// export default App;
