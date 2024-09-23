import axios from "axios";
import { API_BSE_URL, AXIOS_CONFIG } from "../app/config";


export const blogService = {

  getBlogs: async () => {
    const response = await axios.get(`${API_BSE_URL}/blog/all`);
    if (response.result) {
      return response.result;
    }
  },

  getBlog: async (id) => {
    const response = await axios.get(`${API_BSE_URL}/blog/${id}`);
    if (response.result) {
      return response.result;
    }
  }
};
