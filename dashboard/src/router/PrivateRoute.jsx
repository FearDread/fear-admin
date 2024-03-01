import React from "react";
//import { motion } from "framer-motion";
import { Route, Redirect } from "react-router-dom";

import Auth from "_auth";

const PrivateRoute = ({ component: Component, ...rest }) => {

  return (
    <Route
      {...rest}
      render={(props) =>
        Auth.token.get() ? (
            <Component {...props} />
        ) : (
            <Redirect to="/auth/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
