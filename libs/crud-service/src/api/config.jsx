import StorePersist from "../store/StorePersist.jsx";

const isAuth = StorePersist.get("auth") ? StorePersist.get("auth") : null;

export const AXIOS_CONFIG = {
  headers: {
    Authorization: `Bearer ${
      isAuth !== null ? isAuth.token : ""
    }`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data"
  },
};

export const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "http://fear.master.com:4000/fear/api" 
                : "http://localhost:4000/fear/api"; 
  
export const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";
