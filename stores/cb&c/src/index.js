import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Product } from "./features/products/slice";
import  { store }  from "./features/store";
import App from "./App";

import "./assets/css/bootstrap.min.css"
import "./assets/css/all.min.css";
import './assets/css/swiper-bundle.min.css';
import "./assets/css/animate.css";
import "./assets/css/nice-select.css";
import "./assets/css/style.css";

const container = document.getElementById("root");
const root = createRoot(container);

store.dispatch(Product.fetch());
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
