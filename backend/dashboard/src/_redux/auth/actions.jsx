import * as actionTypes from "./types";
import storePersist from "../storePersist.js";
import API from "@feardread/feature-factory";

export const login = (email, password) => async (dispatch) => {
  const config = { headers: { "Content-Type": "multipart/form-data" }};
  dispatch({ type: actionTypes.LOGIN_REQUEST });
      
  await API.post("auth/login", { email, password }, config )
    .then((response) => {
      const data = response.data.result;
      
      storePersist.set("auth", { user: data, token: data,  isLoggedIn: true });
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: data });
    })
    .catch((error) => { dispatch({ type: actionTypes.LOGIN_FAIL, payload: error }); });
}

export const logout = () => async(dispatch) => {
  storePersist.remove("auth");

  await API.post(`auth/logout`)
    .then((response) => { 
      if ( !response.success ) {
        dispatch({ type: actionTypes.LOGOUT_FAIL }) 
      }
      dispatch({ type: actionTypes.LOGOUT_SUCCESS }); })
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
