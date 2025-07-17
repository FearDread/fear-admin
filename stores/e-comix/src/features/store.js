import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./user/slice";
import { productSlice } from "./products/slice";
import { brandSlice } from "./brands/slice";
import { cartSlice } from "./cart/slice";
import { blogSlice } from "./blogs/slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    brand: brandSlice.reducer,
    cart: cartSlice.reducer,
    blog: blogSlice.reducer,
  }
});