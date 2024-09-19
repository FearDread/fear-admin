const getTokenFromLocalStorage = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;

export const AXIOS_CONFIG = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data"
  },
};

export const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "http://172.128.10.101:4000/fear/api" 
                : "http://localhost:4000/fear/api"; 
  
export const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";
