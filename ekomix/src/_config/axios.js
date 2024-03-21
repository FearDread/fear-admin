import axios from "axios";
import { API_BASE_URL } from "./api";

axios.defaults.baseURL = API_BASE_URL;
axios.interceptors.request.use(function (req) {
   const user = localStorage.getItem("user");

   if (user) {
      const { token } = JSON.parse(localStorage.getItem("user"));
      req.headers.authorization = `Bearer ${token}`;
      return req;
   }
   return req;
});
