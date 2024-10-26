import { combineReducers } from "redux";
import * as actionTypes from "../api/types";
import authReducer from "../auth/reducer.jsx";
import crudReducer  from "../api/reducer.jsx";
import cartReducer from "../cart/reducer.jsx";

const appReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  cart: cartReducer
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;