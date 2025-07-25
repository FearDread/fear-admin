import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./user/slice";
import { productSlice } from "./products/slice";
import { brandSlice } from "./brands/slice";
import { cartSlice } from "./cart/slice";
import { blogSlice } from "./blogs/slice";
import cache from "./factory/cache";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import FeatureFactory  from "./factory";

const apiSlice = FeatureFactory().apiSlice;

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: authSlice.reducer,
    product: productSlice.reducer,
    brand: brandSlice.reducer,
    cart: cartSlice.reducer,
    blog: blogSlice.reducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
setupListeners(store.dispatch);

store.cache = cache;

export default store;