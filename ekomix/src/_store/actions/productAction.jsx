import axios from "axios";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_FAIL,
  ADMIN_PRODUCT_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
 ALL_REVIEW_REQUEST,
 ALL_REVIEW_SUCCESS,
 DELETE_REVIEW_REQUEST,
 DELETE_REVIEW_SUCCESS,
 DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  ALL_REVIEW_FAIL,
} from "../types/productsConstant";
import * as types from "../types/productsConstant";
import { API_BASE_URL } from "../../_config/api";

// get ALL Products
export const getProduct = (
  keyword = "",
  currentPage = 1,
  price = [0, 100000],
  category,
  ratings = 0
) => {
  return async (dispatch) => {
    try {
      // initial state :
      dispatch({
        type: types.ALL_PRODUCT_REQUEST,
      });

      let link = API_BASE_URL + `/product?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      // when category selected by user then using another link
      if (category) {
        link = API_BASE_URL + `/product?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
      }
      const { data } = await axios.get(link);

      dispatch({
        type: types.ALL_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: types.ALL_PRODUCT_FAIL,
        payload: error.message,
      });
    }
  };
};

// Get Products Details
export const getProductDetails = (_id) => async (dispatch) => {
    try {
      dispatch({
        type: types.PRODUCT_DETAILS_REQUEST,
      });

      const { data } = await axios.get(API_BASE_URL + "/product/" + _id);
      console.log('prod = ', data);
      dispatch({
        type: types.PRODUCT_DETAILS_SUCCESS,
        payload: data.product,
      });
    } catch (error) {
      dispatch({
        type: types.PRODUCT_DETAILS_FAIL,
        payload: error.message,
      });
    }
  };

//Add new Review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: types.NEW_REVIEW_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(`/review/new`, reviewData, config);

    dispatch({ type: types.NEW_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: types.NEW_REVIEW_FAIL, payload: error.message });
  }
};

// admin product request :
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: types.ADMIN_PRODUCT_REQUEST });

    const { data } = await axios.get(API_BASE_URL + "/product");
    console.log('prod = ', data);
    dispatch({ type: types.ADMIN_PRODUCT_SUCCESS, payload: data.products });
  } catch (error) {
    dispatch({ type: types.ADMIN_PRODUCT_FAIL, payload: error.message });
  }
};

// Create Product
export function createProduct(productData) {
  return async function(dispatch) {
    try {
      dispatch({
        type: types.NEW_PRODUCT_REQUEST,
      });
         
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post(
        `/admin/product/new`,
        productData,
        config
      );

      dispatch({
        type: types.NEW_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: types.NEW_PRODUCT_FAIL,
        payload: error.message,
      });
    }
  };
}

// Delete Product request

export function deleteProduct(id) {
  return async function(dispatch) {
    try {
      dispatch({ type: types.DELETE_PRODUCT_REQUEST });

      const { data } = await axios.delete(`/api/v1/admin/product/${id}`);
    
      dispatch({ type: types.DELETE_PRODUCT_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({ type: types.DELETE_PRODUCT_FAIL, payload: error.message });
    }
  };
}

// updateProduct;
export const updateProduct = (id, productData) => async (dispatch) => {
         try {
           dispatch({ type: types.UPDATE_PRODUCT_REQUEST });

           const config = {
              headers: { "Content-Type": "multipart/form-data" },
           };

           const { data } = await axios.put(
             `/api/v1/admin/product/${id}`,
             productData,
             config
           );

           dispatch({
             type: types.UPDATE_PRODUCT_SUCCESS,
             payload: data.success,
           });
         } catch (error) {
           dispatch({
             type: types.UPDATE_PRODUCT_FAIL,
             payload: error.message,
           });
         }
       };

 // get all review of product admin ==>
 export const getAllreviews  = (productId) => async (dispatch) =>{

     try {
        dispatch({type : types.ALL_REVIEW_REQUEST})

        const { data } = await axios.get(`/api/v1/reviews?id=${productId}`);
        dispatch({type : types.ALL_REVIEW_SUCCESS , payload : data.reviews})
     } catch (error) {
        dispatch({type : types.ALL_REVIEW_FAIL , payload : error.message})
     }
 }


 // delete product review
export const deleteProductReview = (reviewId , productId) => async (dispatch) =>{
   try {
  dispatch({type : DELETE_REVIEW_REQUEST})

    const { data } = await axios.delete(
      `/api/v1/product/reviews/delete?id=${reviewId}&productId=${productId}`
    );

     dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
   } catch (error) {
      dispatch({type : DELETE_REVIEW_FAIL , payload : error.message})
   }

}


// clear error
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
