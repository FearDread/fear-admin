

export const API_BASE_URL = process.env.NODE_ENV === "production" 
    ? "http://fear.master.com:4000/fear/api" 
    : "http://localhost:4000/fear/api";