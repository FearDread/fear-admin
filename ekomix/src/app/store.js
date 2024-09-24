import { configureStore } from "@reduxjs/toolkit";
import authReducer from "features/src/user/slice";
import productReducer from "features/src/products/slice";
import blogReducer from "features/src/blogs/slice";
import contactReducer from "features/src/contact/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
  },
});
