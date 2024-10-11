import axios from "axios";

const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "http://fear.master.com:4000/fear/api" 
                : "http://localhost:4000/fear/api"; 
  
const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${ isAuth !== null ? isAuth.token : ""}`,
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "application/json",
    }
});

instance.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${isAuth !== null ? isAuth.token : ""}`;
          return config;
      },
      error => {
          return Promise.reject(error);
      }
  );

  export default instance;
