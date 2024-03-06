import * as actionTypes from "../types/auth";
import storage from "../storage";
import axios from "axios";

import { API_BASE_URL } from "../../variables/api.js";

export function login(email, password) {

  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.LOGIN_REQUEST });

      const config = { headers: { "Content-Type": "application/json" } };
      const response = await axios.post(
        API_BASE_URL + "/login",
        { email, password },
        config
      );

      storage.set("_current", response.data.result.user);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response.data.result.user });
    } catch (error) {

      dispatch({ type: actionTypes.LOGIN_FAIL, payload: error.data.message });
    }
  };
}

export function logout() {
  return async function (dispatch) {
    try {
      storage.remove("_current");

      await axios.get(API_BASE_URL + `/logout`); // token will expired from cookies and no more user data access
      
      dispatch({ type: actionTypes.LOGOUT_SUCCESS });

    } catch (error) {
      storage.remove("_current");
      dispatch({ type: actionTypes.LOGOUT_FAIL, payload: error.message });
    }
  }
}

export const register = (signupData) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.REGISTER_USER_REQUEST });
    const config = {
      headers: { "Content-Type": "multipart/form-data" }};

    const response = await axios.post(
      API_BASE_URL + "/register",
      signupData,
      config
    );
    
    console.log("setting _current user", response.data);
    storage.set("_current", response.data.result.user);
    dispatch({ type: actionTypes.REGISTER_USER_SUCCESS, payload: response.data.result.user });
  } catch (error) {
    dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: error });
  }
}
