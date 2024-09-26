import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/user/slice";
import productReducer from "../features/products/slice";
import blogReducer from "../features/blogs/slice";
import contactReducer from "../features/contact/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
  },
});
