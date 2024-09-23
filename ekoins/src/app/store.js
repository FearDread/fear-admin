import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../libs/features/src/user/slice";
import productReducer from "../../../libs/features/src/products/slice";
import blogReducer from "../../../libs/features/src/blogs/slice";
import contactReducer from "../../../libs/features/src/contact/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
  },
});
