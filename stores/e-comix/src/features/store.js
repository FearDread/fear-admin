import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user/slice";
import { productSlice } from "./products/slice";
import { brandSlice } from "./brands/slice";
import { cartSlice } from "./cart/slice";
import { blogSlice } from "./blogs/slice";
import cache from "./factory/cache";
//import { setupListeners } from "@reduxjs/toolkit/query/react";


export const store = configureStore({
   reducer: {
    user: userSlice.reducer,
    product: productSlice.reducer,
    brand: brandSlice.reducer,
    cart: cartSlice.reducer,
    blog: blogSlice.reducer,
  }
});

//setupListeners(store.dispatch);

store.local = cache.local;
store.session = cache.session;

export default store;