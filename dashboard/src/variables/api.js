export const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "localhost:4000/fear/api"
                : "172.128.10.101:4000/fear/api"; 
  
export const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";
