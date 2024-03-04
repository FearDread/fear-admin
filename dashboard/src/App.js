import React, { useEffect, useState, Suspense } from "react";
import { useHistory, useLocation, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";
import Loader from "components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";

function App(props) {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
      console.log("is Authorized = " , isLoggedIn);
 
     if (isLoggedIn) {
        history.push("/admin/dashboard");
     }
  
    }, [history, isLoggedIn]);

  return (
      <Switch>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />  

        <Route path="/admin" render={(props) => (
          isLoggedIn ? <AdminLayout {...props} />
        : <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
        )} />
      </Switch>
  );
}

export default App;