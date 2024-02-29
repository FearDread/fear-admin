import { API_BASE_URL, ACCESS_TOKEN_NAME } from "variables/api";

import axios from "axios";
import error from "_request/errorHandler";
import success from "_request/successHandler";
import storePersist from "_redux/storePersist";

import { getCookie, setCookie, deleteCookie } from "./cookie";

export const login = async (email, password) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      API_BASE_URL + "/login",
      { email, password },
      config
    )
    
    token.set(response.data.result.token);
    return success(response);

  } catch (error) {
    return error(error);
  }
};

export const logout = () => {
  token.remove();
  storePersist.clear();
};

export const register = async (signupData) => {
  try {
    const response  = await axios.post(
      API_BASE_URL + "/register",
      signupData,
    );

    token.set(response.data.result.token);
    return success(response);

  } catch (err) {
    return error(err);
  }
};

export const token = {
  get: () => {
    return getCookie(ACCESS_TOKEN_NAME);
  },
  set: (token) => {
    return setCookie(ACCESS_TOKEN_NAME, token);
  },
  remove: () => {
    return deleteCookie(ACCESS_TOKEN_NAME);
  },
};
