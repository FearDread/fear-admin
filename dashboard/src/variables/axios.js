import axios from "axios";
import storage from "./storage";
import { API_BASE_URL } from "./api";

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(function (req) {
   /*const user = storage.get("user");

   if (user) {
      const { token } = storage.get("user");
      req.headers.authorization = `Bearer ${token}`;

      return req;
   }
*/
   return req;
});