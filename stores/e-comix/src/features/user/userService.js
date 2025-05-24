import API from "../api";
import cache from "../cache";

const register = async (userData) => {
  const response = await API.post(`user/register`, userData);
  if (response.data) {
    cache.local.set("customer", response.data.result);
    return response.data;
  }
};

const login = async (userData) => {
  const response = await API.post(`user/login`, userData);

  if (response.data) {
    cache.local.set("customer", response.data.result);
    return response.data.result;
  }
};

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

const removeProductFromCart = async (data) => {
  const response = await API.delete(
    `user/delete-product-cart/${data.id}`,

    data.config2
  );
  if (response.data) {
    return response.data;
  }
};

const updateProductFromCart = async (cartDetail) => {
  const response = await API.delete(
    `user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
  );
  if (response.data) {
    return response.data;
  }
};

const createOrder = async (orderDetail) => {
  const response = await API.post(
    `user/cart/create-order/`,
    orderDetail,
  );
  if (response.data) {
    return response.data;
  }
};

const getUserOrders = async () => {
  const response = await API.get(`user/getmyorders`);

  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
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

const emptyCart = async (data) => {
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
