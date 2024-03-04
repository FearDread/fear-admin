import { combineReducers } from "redux";
import * as actionTypes from "./types/auth";
import authReducer from "./reducers/auth";
import crudReducer  from "./reducers/crud";
import searchReducer from "./reducers/search";

import userReducer from "./reducers/user";

import productsReducer from "./reducers/product";

// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  crud: crudReducer,
  product: productsReducer,
  search: searchReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
