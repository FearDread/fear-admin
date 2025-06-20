import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./user/userSlice";
import { productReducer } from "./products/factory";
import blogReducer from "./blogs/blogSlice";
import contactReducer from "./contact/contactSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
  },
});

export default store;
