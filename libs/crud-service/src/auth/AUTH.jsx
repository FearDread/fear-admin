import * as Types from "./types.js";
import { API_BASE_URL } from "../api/config.jsx";
import StorePersist from "../store/StorePersist.jsx";
import axios from "axios";

const AUTH = {

  login: (email, password) => async (dispatch) => {
    dispatch({ type: Types.LOGIN_REQUEST });
    const config = { headers: { "Content-Type": "application/json" }};
      
    await axios.post( API_BASE_URL + "/auth/login", { email, password }, config )
      .then((response) => {
        StorePersist.set("auth", { user: response.data.user, 
            token: response.data.token, 
            isLoggedIn: true 
        });
        dispatch({ type: Types.LOGIN_SUCCESS, payload: response.data.user }); })
      .catch((error) => { dispatch({ type: Types.LOGIN_FAIL, payload: error.message }); });
  },

  logout: async (dispatch) => {
    StorePersist.remove("auth");

    await axios.get(API_BASE_URL + `/auth/logout`)
      .then((response) => { dispatch({ type: Types.LOGOUT_SUCCESS }); })
      .catch((error) => { dispatch({ type: Types.LOGOUT_FAIL, payload: error }); });
  },
  
  register: (data) => async (dispatch) => {
    dispatch({ type: Types.LOADING_REQUEST });
    const config = { headers: { "Content-Type": "multipart/form-data" }};
    console.log("register data = ", data);
    await axios.post( API_BASE_URL + "/auth/register", data, config )
      .then((response) => {
        StorePersist.set("auth", { user: response.data.user, 
          token: response.data.token, 
          isLoggedIn: true 
        });
        dispatch({ type: Types.REGISTER_SUCCESS, payload: response.data.user });
      })
      .catch((error) => { dispatch({ type: Types.REGISTER_FAIL, payload: error.message }); });
  }
};

export default AUTH;