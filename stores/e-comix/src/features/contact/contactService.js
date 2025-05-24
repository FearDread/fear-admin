import API from "../api";

const postQuery = async (contactData) => {
  
  await API.post(`enquiry`, contactData)
    .then((response) => {
      if (response.data) {
        return response.data.result;
      }
    })
    .catch((error) => { return error; });
};

export const contactService = {
  postQuery,
};
