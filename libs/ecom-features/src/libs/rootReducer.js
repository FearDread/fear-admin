import { combineReducers } from "redux";
import * as actionTypes from "./types/auth";
//import authReducer from "./auth/reducer";
import crudReducer  from "./api/reducer";
//import searchReducer from "./search/reducer";

//import storePersist from "./storePersist";

const appReducer = combineReducers({
  //auth: authReducer,
  crud: crudReducer,
  //search: searchReducer
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
