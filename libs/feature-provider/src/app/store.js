import React from "react"
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "../user/slice";
import productReducer from "../products/slice";
import blogReducer from "../blogs/slice";
import contactReducer from "../contact/slice";

export * as Product from "../products/slice";
export * as Blog from "../blogs/slice";


import { createDispatchHook, createSelectorHook } from "react-redux";

const useDispatch = createDispatchHook<StoreState>(context);
const useSelector = createSelectorHook<StoreState>(context);

import validateAction from "./lib/validate-action";

export const createStore = (reducer, initialState) => {
  const store = {};

  store.state = initialState;
  store.listeners = [];
  store.subscribe = listener => store.listeners.push(listener);
  store.dispatch = action => {
    validateAction(action);

    store.state = reducer(store.state, action);
    store.listeners.forEach(listener => listener(action));
  };
  store.getState = () => store.state;
  store.dispatch({ type: "@@redux/INIT" });

  return store;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

const context = React.createContext(store.getState(), {
  store: store,
  //storeState: initialState,
});

export default FeaturesProvider = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);