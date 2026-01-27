import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CustomProvider } from 'rsuite';
import store from "./features/store";

import App from "./App";

import './index.css';
import "./assets/css/App.css";
import 'rsuite/dist/rsuite.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <CustomProvider>

      <Provider store={store}>
        <App />
      </Provider>

    </CustomProvider>
  </BrowserRouter>

);
