import { combineReducers } from "redux";
import * as actionTypes from "./types/auth";
import authReducer from "./reducers/auth";
//import crudReducer  from "./crud/reducer";
import searchReducer from "./reducers/search";
import brandReducer from "./reducers/brand";
import userReducer from "./reducers/user";
import productsReducer from "./reducers/product";
import cartReducer from "./cart/reducer";
//import storePersist from "./storePersist";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  //crud: crudReducer,
  brand: brandReducer,
  //coupon: couponReducer,
  product: productsReducer,
  //category: categoryReducer,
  search: searchReducer
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
