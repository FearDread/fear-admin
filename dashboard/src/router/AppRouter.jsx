import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
//import { AnimatePresence } from "framer-motion";
///import PrivateRoute from "./PrivateRoute";
//import PublicRoute from "./PublicRoute";
import Loader from "components/Loader/Loading";
import AdminLayout from "layouts/Admin/Admin.js"
//
const Dashboard = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "views/Dashboard")
);
const Customer = lazy(() =>
  import(/*webpackChunkName:'CustomerPage'*/ "_dashboard/ProductList")
);
const SelectCustomer = lazy(() =>
  import(/*webpackChunkName:'SelectCustomerPage'*/ "_dashboard/UserList")
);
const Lead = lazy(() => import(/*webpackChunkName:'LeadPage'*/ "views/pages/User"));

//const Product = lazy(() =>
  //import(/*webpackChunkName:'ProductPage'*/ "@/pages/Product")
//);

//const Logout = lazy(() =>
  //import(/*webpackChunkName:'LogoutPage'*/ "@/pages/Logout")
//);
//const NotFound = lazy(() =>
  //import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
//);

export default function AppRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loader />}>
        <Switch location={location} key={location.pathname}>
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
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