import { configureStore } from "@reduxjs/toolkit";
//import { authSlice } from "./user/factory";
import { productSlice } from "./products/factory";
//import { brandSlice } from "./brands/factory";

export const store = configureStore({
  reducer: {
    product: productSlice.reducer
  }
  })

export default store;