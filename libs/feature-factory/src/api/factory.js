import axios from "axios";
import qs from "qs";
import cache from "../cache/cache.js";



/**
 * Creates and configures an Axios instance.
 * @param {string} baseURL - The base URL for API requests.
 * @param {object} [headers={}] - Optional default headers for requests.
 * @returns {object} An object containing configured Axios methods (get, post, put, delete).
 */
export const InstanceFactory = (baseURL, headers = {}) => {
    const API_BASE_URL = (baseURL)
        ? baseURL
        : "http://fear.master.com/fear/api/";

    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            ...headers,
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { indices: false });
        },
        withCredentials: true
        //httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    instance.interceptors.request.use(
        (config) => {
            const isAuth = cache.local.get("auth") ? cache.local.get("auth") : null;
            let token = isAuth !== null ? isAuth.token : "";

            config.headers = {
                Authorization: `Bearer ${token}`,
                ['fear-x-token']: token
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
                    cache.local.remove("auth");
                    return Promise.reject(error.response);
                }
                if (error.response.status === 500) {
                    return Promise.reject(error.response);
                }
            }
            return Promise.reject(error);
        }
    );

    return {
        get: (url, config) => instance.get(url, config),
        post: (url, data, config) => instance.post(url, data, config),
        put: (url, data, config) => instance.put(url, data, config),
        delete: (url, config) => instance.delete(url, config),
        // Add other methods as needed (patch, head, etc.)
    };
};





export default InstanceFactory;