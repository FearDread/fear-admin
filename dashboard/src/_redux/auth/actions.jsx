import * as actionTypes from "./types";
import storePersist from "../storePersist.js";
import axios from "axios";
import { API_BASE_URL, AXIOS_CONFIG } from "../config";

export function login(email, password) {

  return async function (dispatch) {
    dispatch({ type: actionTypes.LOGIN_REQUEST });
      
    const config = { headers: { "Content-Type": "application/json", "Content-Type": "Access-Control-Allow-Origin" } };
    await axios.post( API_BASE_URL + "/auth/login", { email, password }, config )
      .then((response) => {
        storePersist.set("auth", { user: response.data.user, 
            token: response.data.token, 
            isLoggedIn: true 
          });
        dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response.data.user });
      })
      .catch((error) => {
        dispatch({ type: actionTypes.LOGIN_FAIL, payload: error.message });
      });
  }
}

export function logout() {
  return async function (dispatch) {
    try {
      storePersist.remove("auth");

      await axios.get(API_BASE_URL + `/auth/logout`);
      
      dispatch({ type: actionTypes.LOGOUT_SUCCESS });

    } catch (error) {
      dispatch({ type: actionTypes.LOGOUT_FAIL, payload: error.message });
    }
  }
}

export const register = (signupData) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.REGISTER_USER_REQUEST });
    const config = {
      headers: { "Content-Type": "multipart/form-data" }};

    const res = await axios.post(
      API_BASE_URL + "/user/register",
      signupData,
      config
    );
    console.log("Register USER res :: ", res);
    storePersist.set("user", JSON.stringify(res.data.user));

    dispatch({ type: actionTypes.REGISTER_USER_SUCCESS, payload: res.data.user });
  } catch (error) {
    dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: error });
  }
}
