export const API_BASE_URL = "http://fear.master.com:4000/fear/api";
/*
export const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "http://fear.master.com:4000/fear/api"
                : "http://localhost:4000/fear/api";
		*/
  
export const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-auth-token";
