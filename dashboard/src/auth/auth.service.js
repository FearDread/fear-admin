import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../variables/api";

import axios from "axios";
import errorHandler from "../_request/error";
import successHandler from "../_request/success";
import storePersist from "../redux/storePersist";

import { getCookie, setCookie, deleteCookie } from "./cookie";

export const login = async (loginAdminData) => {
  const { email, password } = loginAdminData;
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      API_BASE_URL + "/auth/login",
      { email, password },
      config
    );
    token.set(response.data.result.token);

    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = () => {
  token.remove();
  storePersist.clear();
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
