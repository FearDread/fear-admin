import axios from "axios";
import qs from "qs";
import { setupCache } from "axios-cache-interceptor/dev";
import StorePersist from "../store/StorePersist.jsx";



const API_BASE_URL = (process.env.NODE_ENV === "production")
                 ? "http://fear.master.com:4000/fear/api/" 
                 : "http://localhost:4000/fear/api/";

const ACCESS_TOKEN_NAME = (process.env.JWT_TOKEN) 
                ? process.env.JWT_TOKEN 
                : "x-token";
                                                          

const instance = axios.create({
    baseURL: `${API_BASE_URL}`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false });
    },
    credentials: true
    //httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

instance.interceptors.request.use(
    (config) => {
        const isAuth = StorePersist.get("auth") ? StorePersist.get("auth") : null;
        let token = isAuth !== null ? isAuth.token : "";
    
        config.headers = {
            Authorization: `Bearer ${token}`,
            [ACCESS_TOKEN_NAME]: token
        };

        return config;
    },
    (error) => { Promise.reject(error) }
);

instance.interceptors.response.use(
    (response) => {
        console.log("API RES :: ", response);
        const messages = response.data.message;

        if (response.status === 200 || 203) { 
            return response;
        }
        if (messages) return Promise.reject({ messages: [messages] });
        
        return Promise.reject({ messages: ["got errors"] });
    },
    (error) => {
        console.log("API ERROR :: ", error);
        if (error.response) {
            if (error.response.status === 401) {
                StorePersist.remove("auth");
                return Promise.reject(error.response);
            }
            if (error.response.status === 500) {
                return Promise.reject(error.response);
            }
        }
        return Promise.reject(error);
    }
);


export const API = instance;

export default API;