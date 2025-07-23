import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Product } from "./features/products/slice";
import { Cart } from "./features/cart/slice";
import  { store }  from "./features/store";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

store.dispatch(Product.fetch());
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
