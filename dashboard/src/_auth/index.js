import { ACCESS_TOKEN_NAME } from "variables/api";

const auth = {
  user: {},
  isAdmin: false,
  token: {
    get: () => {
      const result = window.localStorage.getItem(ACCESS_TOKEN_NAME);
      return JSON.parse(result);
    },
    set: (token) => {
      window.localStorage.setItem(ACCESS_TOKEN_NAME, JSON.stringify(token));
    },
    remove: () => {
      window.localStorage.removeItem(ACCESS_TOKEN_NAME);
      return true;
    },
  }
}
export default auth;


