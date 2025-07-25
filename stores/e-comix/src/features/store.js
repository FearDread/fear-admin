import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./user/slice";
import { productSlice } from "./products/slice";
import { brandSlice } from "./brands/slice";
import { cartSlice } from "./cart/slice";
import { blogSlice } from "./blogs/slice";
import cache from "./factory/cache";

export const store = configureStore({
  reducer: {
    user: authSlice.reducer,
    product: productSlice.reducer,
    brand: brandSlice.reducer,
    cart: cartSlice.reducer,
    blog: blogSlice.reducer,
  }
});

store.cache = cache;

export default store;