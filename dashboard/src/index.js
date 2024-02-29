import React from "react";
import ReactDOM from "react-dom/client";
//import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
//import { Provider } from "react-redux";
//import AuthLayout from "layouts/Auth/Auth.js";
//import AdminLayout from "layouts/Admin/Admin.js";
//import RTLLayout from "layouts/RTL/RTL.js";
//import PrivateRoute from "_helpers/PrivateRoute";

//import store from "./store";

import App from "App.js";
import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";
import "assets/demo/demo.css";
import "assets/css/animated-bg.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />)
/*
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <PrivateRoute path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
        <Redirect from="/*" to="/admin/dashboard" />
      </Switch>
    </Provider>
  </BrowserRouter>
);
*/


//<Redirect from="/*" to="/admin/dashboard" />

