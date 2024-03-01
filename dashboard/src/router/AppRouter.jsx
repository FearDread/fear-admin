import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
//import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
//import PublicRoute from "./PublicRoute";
import Loader from "components/Loader/Loading";
import AdminLayout from "layouts/Admin/Admin.js"

export default function AppRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loader />}>
        <Switch location={location} key={location.pathname}>
          <PrivateRoute path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Redirect path="/" to="/admin/dashboard" />
        </Switch>
    </Suspense>
  );
}
/*
<PrivateRoute path="/" component={Dashboard} exact />
<PrivateRoute component={Customer} path="/customer" exact />
<PrivateRoute
  component={SelectCustomer}
  path="/selectcustomer"
  exact
/>
<PrivateRoute component={Lead} path="/lead" exact />
<PrivateRoute component={Product} path="/product" exact />
<PrivateRoute component={Admin} path="/admin" exact />

<PrivateRoute component={Logout} path="/logout" exact />
<PublicRoute path="/login" render={() => <Redirect to="/" />} />
<Route
  path="*"
  component={NotFound}
  render={() => <Redirect to="/notfound" />}
/>
*/