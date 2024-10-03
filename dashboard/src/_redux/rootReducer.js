import { combineReducers } from "redux";
import * as actionTypes from "./types/auth";
import authReducer from "./reducers/auth";
//import crudReducer  from "./crud/reducer";
import searchReducer from "./reducers/search";
import brandReducer from "./brand/reducer";
import userReducer from "./reducers/user";
import productsReducer from "./product/reducer";
import cartReducer from "./cart/reducer";
import categoriesReducer from "./category/reducer";
import reviewReducer from "./review/reducer";
import blogReducer from "./blog/reducer";
//import storePersist from "./storePersist";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  blog: blogReducer,
  brand: brandReducer,
  review: reviewReducer,
  product: productsReducer,
  cat: categoriesReducer,
  search: searchReducer
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
