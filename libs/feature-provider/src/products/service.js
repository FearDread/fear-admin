import axios from "axios";
import { api_base_url, axios_config } from "../app/config";

const getProducts = async (data) => {
  console.log(data);
  const response = await axios.get(
    `${api_base_url}/product?${data?.brand ? `brand=${data?.brand}&&` : ""}${
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
  const response = await axios.get(`${api_base_url}/product/all`);
  if (response.result) {
    return response.result;
  }
}

const getSingleProduct = async (id) => {
  const response = await axios.get(`${api_base_url}/product/${id}`);
  if (response.result) {
    return response.result;
  }
};

const addToWishlist = async (prodId) => {
  const response = await axios.put(
    `${api_base_url}/product/wishlist`,
    { prodId },
    axios_config
  );
  if (response.result) {
    return response.result;
  }
};

const rateProduct = async (data) => {
  const response = await axios.put(`${api_base_url}/product/rating`, data, axios_config);
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
