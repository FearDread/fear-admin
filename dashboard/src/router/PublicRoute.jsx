import React from "react";

import { Route, Redirect } from "react-router-dom";
import Auth from "_auth";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the admin is logged in
    // Otherwise, redirect the admin to /signin page
    <Route
      {...rest}
      render={(props) =>
        Auth.token.get() ? (
          <Redirect to="/admin/dashboard" />
        ) : (
            <Component {...props} />

        )
      }
    />
  );
};

export default PublicRoute;
