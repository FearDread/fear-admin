import * as actionTypes from "./types";
import storePersist from "../storePersist.js";
import API from "../api/instance";

export const login = (email, password) => async (dispatch) => {
  const config = { headers: { "Content-Type": "multipart/form-data" }};
  dispatch({ type: actionTypes.LOGIN_REQUEST });
      
  await API.post("auth/login", { email, password }, config )
    .then((response) => {
      storePersist.set("auth", { user: response.data.user, 
          token: response.data.token, 
          isLoggedIn: true 
        });
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response.data.user });
    })
    .catch((error) => { dispatch({ type: actionTypes.LOGIN_FAIL, payload: error }); });
}

export const logout = () => async(dispatch) => {
  storePersist.remove("auth");

  await API.get(`auth/logout`)
    .then((response) => { dispatch({ type: actionTypes.LOGOUT_SUCCESS }); })
    .catch((error) => { dispatch({ type: actionTypes.LOGOUT_FAIL, payload: error.message }); });
}

export const register = (signupData) => async (dispatch) => {
  dispatch({ type: actionTypes.REGISTER_USER_REQUEST });
  
  const config = { headers: { "Content-Type": "multipart/form-data" }};  
  await API.post("user/register", signupData, config )
    .then((response) => {
      storePersist.set("user", JSON.stringify(response.data.user));
      dispatch({ type: actionTypes.REGISTER_USER_SUCCESS, payload: response.data.user });
    })
    .catch((error) => { dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: error }); })
}
