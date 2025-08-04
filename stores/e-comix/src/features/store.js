import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user/slice";
import { productSlice } from "./products/slice";
import { brandSlice } from "./brands/slice";
import { cartSlice } from "./cart/slice";
import { blogSlice } from "./blogs/slice";
import { CacheFactory } from "@feardread/feature-factory";

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

store.local = CacheFactory.local;
store.session = CacheFactory.session;

export default store;