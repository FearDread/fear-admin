import { API } from "../api";



const getAllProducts = async () => {
  const response = await API.get("product/all");
  if (response.data) {
    return response.data.result;
  }
}

const getProducts = async (data) => {
  console.log(data);
  const response = await API.get(
    `product?${data?.brand ? `brand=${data?.brand}&&` : ""}${
      data?.tag ? `tags=${data?.tag}&&` : ""
    }${data?.category ? `category=${data?.category}&&` : ""}${
      data?.minPrice ? `price[gte]=${data?.minPrice}&&` : ""
    }${data?.maxPrice ? `price[lte]=${data?.maxPrice}&&` : ""}${
      data?.sort ? `sort=${data?.sort}&&` : ""
    }`
  );

  if (response.data) {
    return response.data.result;
  }
};

const getSingleProduct = async (id) => {
  const response = await API.get(`product/${id}`);
  if (response.data) {
    return response.data.result;
  }
};

const addToWishlist = async (prodId) => {
  const response = await API.put(
    `product/Wishlist`,
    { prodId },
  );
  if (response.data) {
    return response.data;
  }
};

const rateProduct = async (data) => {
  const response = await API.put(`product/rating`, data);
  if (response.data) {
    return response.data;
  }
};

export const productService = {
  getProducts,
  getAllProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
};
