import * as actionTypes from "../types/auth";
import storePersist from "_redux/storePersist";
import history from "_utils/history";
import axios from "axios";

import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../variables/api.js";

export function login(email, password) {
  console.log("API URL = " + API_BASE_URL);
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.LOGIN_REQUEST });

      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        API_BASE_URL + "/login",
        { email, password },
        config
      );

      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: data.user });
    } catch (error) {

      dispatch({ type: actionTypes.LOGIN_FAIL, payload: error.message });
    }
  };
}

export const logout = () => async (dispatch) => {
 //logout
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
