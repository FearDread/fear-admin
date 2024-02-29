import { combineReducers } from "redux";

import authReducer from "./reducers/auth";
import crudReducer  from "./reducers/crud";
import searchReducer from "./reducers/search";

import * as actionTypes from "./types/auth";

// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  search: searchReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
