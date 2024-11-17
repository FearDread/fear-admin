import StorePersist from "../store/StorePersist.jsx";

const source = process.env.NODE_ENV === "production" ? "http://13.59.85.143:4000" : "http://localhost:4000";
const isAuth = StorePersist.get("auth") ? StorePersist.get("auth") : null;

export const API_BASE_URL = source  + "/fear/api";
export const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";

export const AXIOS_CONFIG = {
  headers: {
    Authorization: `Bearer ${
      isAuth !== null ? isAuth.token : ""
    }`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data"
  },
};
