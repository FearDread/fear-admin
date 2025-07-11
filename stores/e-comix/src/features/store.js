import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./user/factory";
import { productSlice } from "./products/factory";
import { brandSlice } from "./brands/factory";
///import blogReducer from "./blogs/blogSlice";
//import contactReducer from "./contact/contactSlice";
import FeatureFactory from "./factory";

const baseReducer = {
    auth: authSlice.reducer,
    brand: brandSlice.reducer,
    product: productSlice.reducer,
}

const manager = FeatureFactory().manager( { baseReducer} );

const store = configureStore({
  reducer: baseReducer
})

store.manager = manager;
console.log('store = ', store);
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
