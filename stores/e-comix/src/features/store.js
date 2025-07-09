import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./user/factory";
import { productReducer } from "./products/factory";
import { brandReducer } from "./brands/slice";
///import blogReducer from "./blogs/blogSlice";
//import contactReducer from "./contact/contactSlice";
import ReducerFactory from "./factory/reduce";

const baseReducer = {
    auth: authReducer,
    brand: brandReducer,
    product: productReducer,
}

const manager = ReducerFactory( { baseReducer} );

const store = configureStore({
  reducer: manager.reduce,
})

store.manager = manager;

export default store;


/*
const store = configureStore({
  reducer: {
    auth: authReducer,
    brand: brandReducer,
    product: productReducer,
    //blog: blogReducer,
    //contact: contactReducer,
  },
});


export default store;
*/
