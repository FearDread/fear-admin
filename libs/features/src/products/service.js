import axios from "axios";
import { API_BSE_URL, AXIOS_CONFIG } from "../app/config";

const getProducts = async (data) => {
  console.log(data);
  const response = await axios.get(
    `${API_BSE_URL}/product?${data?.brand ? `brand=${data?.brand}&&` : ""}${
      data?.tag ? `tags=${data?.tag}&&` : ""
    }${data?.category ? `category=${data?.category}&&` : ""}${
      data?.minPrice ? `price[gte]=${data?.minPrice}&&` : ""
    }${data?.maxPrice ? `price[lte]=${data?.maxPrice}&&` : ""}${
      data?.sort ? `sort=${data?.sort}&&` : ""
    }`
  );

  if (response.data) {
    return response.data;
  }
};

const getAdminProducts = async () => {
  const response = await axios.get(`${API_BSE_URL}/product/all`);
  if (response.result) {
    return response.result;
  }
}

const getSingleProduct = async (id) => {
  const response = await axios.get(`${API_BSE_URL}/product/${id}`);
  if (response.result) {
    return response.result;
  }
};

const addToWishlist = async (prodId) => {
  const response = await axios.put(
    `${API_BSE_URL}/product/wishlist`,
    { prodId },
    AXIOS_CONFIG
  );
  if (response.result) {
    return response.result;
  }
};

const rateProduct = async (data) => {
  const response = await axios.put(`${API_BSE_URL}/product/rating`, data, AXIOS_CONFIG);
  if (response.result) {
    return response.result;
  }
};

export const productSevice = {
  getAdminProducts,
  getProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
};
