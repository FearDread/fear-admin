import axios from "axios";
import { API_BSE_URL, AXIOS_CONFIG } from "../app/config";

const postQuery = async (contactData) => {
  const response = await axios.post(`${API_BSE_URL}/enquiry`, contactData);
  if (response.data) {
    return response.data;
  }
};

export const contactService = {
  postQuery,
};
