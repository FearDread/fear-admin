import * as Types from "./types";

const INITIAL_STATE = {
  current: {},
  loading: false,
  isLoggedIn: false,
  loginSuccess: false,
  registerSuccess: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.LOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case Types.FAILED_REQUEST:
      return INITIAL_STATE;

    case Types.LOGIN_SUCCESS:
      return {
        current: action.payload,
        loading: false,
        isLoggedIn: true,
        loginSuccess: true
      };
    
    case Types.REGISTER_SUCCESS:
      return {
        current: action.payload,
        loading: false,
        isLoggedIn: true,
        registerSuccess: true
      }

    case Types.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default authReducer;
