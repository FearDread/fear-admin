import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
//import { AnimatePresence } from "framer-motion";
import PublicRoute from "./PublicRoute";
import Loader from "components/Loader/Loading";
import AuthLayout from "layouts/Auth/Auth.js";

//const Login = lazy(() =>
 // import(/*webpackChunkName:'LoginPage'*/ "views/pages/Login")
//);

const NotFound = lazy(() =>
  import(/*webpackChunkName:'NotFoundPage'*/ "views/pages/NotFound")
);

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loader />}>
        <Switch location={location} key={location.pathname}>
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
          <Redirect path="/" to="/auth/login" />
        </Switch>
    </Suspense>
  );
}
/*

/>
*/