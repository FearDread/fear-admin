import API from "../factory/api";
import cache from "../factory/cache";

export const register = async (userData) => {
  const response = await API.post(`auth/register`, userData);
  if (response.data) {
    cache.local.set("auth", response.data.result);
    return response.data;
  }
};

export const login = async (userData) => {
  const response = await API.post(`auth/login`, userData);
  if (response.data) {

    cache.local.set("auth", response.data.user);
    return response.data;
  }
};

export const getUserWislist = async () => {
  const response = await API.get(`user/wishlist`);
  if (response.data) {
    return response.data;
  }
};  

export const addToCart = async (cartData) => {
  const response = await API.post(`cart`, cartData);
  if (response.data) {
    return response.data;
  }
};

export const getCart = async (data) => {
  const response = await API.get(`cart`, data);
  if (response.data) {
    return response.data;
  }
};

export const removeProductFromCart = async (data) => {
  const response = await API.delete(
    `user/delete-product-cart/${data.id}`,

    data.config2
  );
  if (response.data) {
    return response.data;
  }
};

export const updateProductFromCart = async (cartDetail) => {
  const response = await API.delete(
    `user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
  );
  if (response.data) {
    return response.data;
  }
};

export const createOrder = async (orderDetail) => {
  const response = await API.post(
    `user/cart/create-order/`,
    orderDetail,
  );
  if (response.data) {
    return response.data;
  }
};

export const getUserOrders = async () => {
  const response = await API.get(`user/getmyorders`);

  if (response.data) {
    return response.data;
  }
};

export const updateUser = async (data) => {
  const response = await API.put(
    `user/edit-user`,
    data.data,
    data.config2,
  );

  if (response.data) {
    return response.data;
  }
};

const forgotPasswordToken = async (data) => {
  const response = await API.post(
    `user/forgot-password-token`,
    data
  );

  if (response.data) {
    return response.data;
  }
};

const resetPass = async (data) => {
  const response = await API.put(
    `user/reset-password/${data.token}`,
    {
      password: data?.password,
    }
  );

  if (response.data) {
    return response.data;
  }
};

export const emptyCart = async (data) => {
  const response = await API.delete(`user/empty-cart`, data);

  if (response.data) {
    return response.data;
  }
};

export const authService = {
  register,
  login,
  getUserWislist,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  createOrder,
  getUserOrders,
  updateUser,
  forgotPasswordToken,
  resetPass,
  emptyCart,
};

export default authService;
