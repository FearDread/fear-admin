import * as actionTypes from "../types/auth";

const INITIAL_STATE = {
  user: {},
  isLoggedIn: false,
  loading: false
}
const authReducer = (state = INITIAL_STATE, action) => {
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
