import { API_BASE_URL, ACCESS_TOKEN_NAME } from "variables/api";

class Auth {
  constructor() {
    this.user_token = JSON.parse(localStorage.getItem("auth")) || {};
  }
  getToken() {
    return this.user_token.token;
  }
  getUserId() {
    return this.user_token.user_id;
  }

  getUserDetails() {
    return this.user_token;
  }

  setUserToken(new_token) {
    this.user_token = new_token;
    localStorage.setItem("auth", JSON.stringify(new_token));
  }
  logout() {
    localStorage.removeItem("auth");
  }
}

Auth.token = {
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

export default new Auth();


export function setCookie(cookieName, cookieValue) {
  window.localStorage.setItem(cookieName, JSON.stringify(cookieValue));
}
export function getCookie(cookieName) {
  const result = window.localStorage.getItem(cookieName);
  return JSON.parse(result);
}
export function deleteCookie(cookieName) {
  window.localStorage.removeItem(cookieName);
  return true;
}

