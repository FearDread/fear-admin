import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import store from "./app/store";
import App from "./App";
import { FeatureProvider } from "@feardread/feature-provider";
import {BrowserRouter} from "react-router-dom"; 

const theme = createTheme();
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

const Root = ReactDOM.createRoot(document.getElementById("root"));

Root.render(
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <FeatureProvider store={store}>>
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </Provider>
      </FeatureProvider>
    </ThemeProvider>
    </BrowserRouter>
);
