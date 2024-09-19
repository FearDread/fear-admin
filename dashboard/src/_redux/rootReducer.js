import { combineReducers } from "redux";
import * as actionTypes from "./types/auth";
import authReducer from "./reducers/auth";
import crudReducer  from "./reducers/crud";
import searchReducer from "./reducers/search";
import brandReducer from "./reducers/brand";

import userReducer from "./reducers/user";

import productsReducer from "./reducers/product";
import storePersist from "./storePersist";
// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  crud: crudReducer,
  brand: brandReducer,
  product: productsReducer,
  search: searchReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  
  const user = storePersist.get("user");
  if ( user ) {
    state.user = user;
    state.user.isLoggedIn = true;
  }
  
  return appReducer(state, action);
};

export default rootReducer;
