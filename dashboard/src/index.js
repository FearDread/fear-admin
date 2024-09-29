import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
//import { Store } from "@feardread/crud-service";

import App from "./App";
import {Provider } from "react-redux";
import store from "_redux/store";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";
import "assets/demo/demo.css";
import "assets/css/animated-bg.css";
import "assets/css/loading.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>

);
