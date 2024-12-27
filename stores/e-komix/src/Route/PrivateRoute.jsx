import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { loading, isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {

  }, []);

  return isLoggedIn ? <>{children}</> : <Navigate to="/authentication" />
}

export default PrivateRoute;
