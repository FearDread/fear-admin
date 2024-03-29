import * as actionTypes from "../types/auth";
import storage from "../storage";
import axios from "axios";
//import "../axios"

import { API_BASE_URL } from "../../variables/api.js";

export function login(email, password) {

  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.LOGIN_REQUEST });
      console.log('url = ' + API_BASE_URL);
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await axios.post(
        API_BASE_URL + "/users/login",
        { email, password },
        config
      );
        console.log('res =' , response)
      storage.set("user", response.data.user);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response.data.user });
    } catch (error) {
      console.log('res =' , error)
      dispatch({ type: actionTypes.LOGIN_FAIL, payload: error.message });
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
      storage.remove("user");
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
      API_BASE_URL + "/users/register",
      signupData,
      config
    );
    console.log(response);
    storage.set("user", response.data.user);
    dispatch({ type: actionTypes.REGISTER_USER_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: error });
  }
}
