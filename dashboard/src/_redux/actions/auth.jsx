import * as actionTypes from "../types/auth";
import Auth from "../../_auth";
import history from "_utils/history";
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

      console.log("API RESULT :: ", response);
      Auth.token.set(response.data.token);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response });
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
