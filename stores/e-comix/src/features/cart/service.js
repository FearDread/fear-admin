import { API } from "../factory/api";

const getUserWislist = async () => {
  const response = await API.get(`user/wishlist`);
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await API.post(`cart`, cartData);
  if (response.data) {
    return response.data;
  }
};

const getCart = async (data) => {
  const response = await API.get(`cart`, data);
  if (response.data) {
    return response.data;
  }
};

export const cartService = {
    getCart,
    addToCart,
    getUserWislist
}