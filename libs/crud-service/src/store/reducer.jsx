import { combineReducers } from "redux";
import * as actionTypes from "../api/types";
//import authReducer from "./auth/reducer";
import crudReducer  from "../api/reducer.jsx";

const appReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;