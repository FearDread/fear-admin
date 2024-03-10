import * as actionTypes from "../types/auth";
import storage from "../storage";

const INITIAL_STATE = {
  user: {},
  loading: false,
  isLoggedIn: false,
};
const authReducer = (state = INITIAL_STATE, action) => {
  const user = storage.get("user");
  if ( user ) {
    state.user = user;
    state.isLoggedIn = true;
  }
  
  console.log('init store state : ', state);
  switch (action.type) {
    case actionTypes.LOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.REGISTER_USER_FAIL:
    case actionTypes.FAILED_REQUEST:
      return INITIAL_STATE;

    case actionTypes.REGISTER_USER_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return {
        user: action.payload,
        loading: false,
        isLoggedIn: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default authReducer;
