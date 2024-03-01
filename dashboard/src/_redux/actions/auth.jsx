import * as actionTypes from "../types/auth";
import * as authService from "_auth";
import storePersist from "_redux/storePersist";
import history from "_utils/history";
import axios from "axios";
import { API_BASE_URL } from "../../variables/api.js";

export const login = (loginData) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOGIN_REQUEST,
    payload: { loading: true },
  });

  await authService.login(loginData.email, loginData.password)
    .then((data) => {
        const authValue = {
        current: data.user,
        loading: false, 
        isLoggedIn: true,
      };
      storePersist.set("auth", authValue);
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,          
        payload: data.user,
       });
    
        history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.FAILED_REQUEST,
        payload: err,
      });
    });
};

export const logout = () => async (dispatch) => {
  authService.logout();
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
  history.push("/login");
};

export const register = (signupData) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.REGISTER_USER_REQUEST });
    const config = {
      headers: { "Content-Type": "multipart/form-data" }};

    const { data } = await axios.post(
      API_BASE_URL + "/register",
      signupData,
      config
    );

    dispatch({ type: actionTypes.REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: error.message });
  }
}
