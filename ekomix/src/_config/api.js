export const API_BASE_URL = process.env.NODE_ENV === "production"
                ? "http://172.128.10.101:4000/fear/api" 
                : "http://localhost:4000/fear/api"; 
