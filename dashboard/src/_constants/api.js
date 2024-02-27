export const API_BASE_URL = process.env.NODE_ENV == "production"
                ? "https://fear.master.com:4000/fear/api"
                : "http://localhost:4000/fear/api";
  
export const ACCESS_TOKEN_NAME = "x-auth-token";
  
  