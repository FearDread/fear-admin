import axios from "axios";
import { api_base_url, axios_config } from "../app/config";

const postQuery = async (contactData) => {
  const response = await axios.post(`${API_BSE_URL}/enquiry`, contactData);
  if (response.data) {
    return response.data;
  }
};

export const contactService = {
  postQuery,
};
