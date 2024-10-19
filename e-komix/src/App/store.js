import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../Features/Cart/cartSlice";
import wishListSlice from "../Features/Wishlist/wishListSlice";
import { STORE } from "@feardread/crud-service";

const features = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishListSlice,
  },
});

const store = combineReducers(features, STORE);

export default store;
