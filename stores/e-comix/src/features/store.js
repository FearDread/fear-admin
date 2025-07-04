import { configureStore } from "@reduxjs/toolkit";
//import authReducer from "./user/userSlice";
import { productReducer } from "./products/factory";
import { brandReducer } from "./brands/slice";
///import blogReducer from "./blogs/blogSlice";
//import contactReducer from "./contact/contactSlice";

const store = configureStore({
  reducer: {
    //auth: authReducer,
    brand: brandReducer,
    product: productReducer,
    //blog: blogReducer,
    //contact: contactReducer,
  },
});

export default store;
