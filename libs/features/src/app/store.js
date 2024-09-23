import React from "react"
import { configureStore } from "@reduxjs/toolkit";
import { Provider, ReactReduxContextValue } from "react-redux";
import authReducer from "../user/slice";
import productReducer from "../products/slice";
import blogReducer from "../blogs/slice";
import contactReducer from "../contact/slice";


import { createDispatchHook, createSelectorHook } from "react-redux";

const useDispatch = createDispatchHook<StoreState>(context);
const useSelector = createSelectorHook<StoreState>(context);

export const useCurrentUser = () => useSelector(s => s.currentUser);
export const useSetCurrentUser = () => {
  const dispatch = useDispatch();
  return (User) => dispatch({ 
    type: "SET_CURRENT_USER",
    payload: User
  });
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

const context = React.createContext(ReactReduxContextValue(store.getState()), {
  store: store,
  //storeState: initialState,
});

export const FeaturesProvider = ({ children }) => (
  <Provider context={context} store={store}>
    {children}
  </Provider>
);