import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import AdminLayout from "layouts/Admin/Admin.js";
import { loadProfile } from "_actions/userAction";
import Loader from "components/Loader/Loading";


function PrivateRoute({ isAdmin, component: Component, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  if (loading) {
    return <Loader />; 
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/auth/login" />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Redirect to="/auth/login" />;
  }

  // If the user is authenticated and isAdmin check is passed, render the specified component
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default PrivateRoute;
