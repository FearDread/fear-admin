import API from "../api";

const getBlogs = async () => {
  const response = await API.get(`blog/all`);
  if (response.data) {
    return response.data;
  }
};

const getBlog = async (id) => {
  const response = await API.get(`blog/${id}`);
  if (response.data) {
    return response.data;
  }
};

export const blogService = {
  getBlogs,
  getBlog,
};

export default blogService;