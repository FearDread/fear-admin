import API from "API";
import API from "../api/instance";
import * as Types from "./types";
import {  } from "../config";

// Get Products Details
export const read = (id) => async (dispatch) => {
  dispatch({ type: Types.PRODUCT_DETAILS_REQUEST });

  await API.get(`product/${id}`)
    .then((response) => {
      dispatch({ type: Types.PRODUCT_DETAILS_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.PRODUCT_DETAILS_FAIL, payload: error });
    });
};

// admin product request :
export const list = () => async (dispatch) => {
  dispatch({ type: Types.ADMIN_PRODUCT_REQUEST });

  await API.get("product/all")
    .then((response) => {
      dispatch({ type: Types.ADMIN_PRODUCT_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ADMIN_PRODUCT_FAIL, payload: error });
    });
};

// Create Product
export const create = (data) => async (dispatch) => {
  dispatch({type: Types.NEW_PRODUCT_REQUEST});

  await API.post(`product/new`, data,
    {headers: { "Content-Type": "multipart/form-data" }})
    .then((response) => {
      dispatch({ type: Types.NEW_PRODUCT_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.NEW_PRODUCT_FAIL, payload: error });
  });
}

// updateProduct;
export const update = (id, data) => async (dispatch) => {
  dispatch({ type: Types.UPDATE_PRODUCT_REQUEST });

  await API.put(`product/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((response) => {
        console.log("update response = ", response);
        dispatch({ type: Types.UPDATE_PRODUCT_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        console.log('error = ', error);
        dispatch({ type: Types.UPDATE_PRODUCT_FAIL, payload: error });
      });
};

// Delete Product request
export const remove = (id) => async (dispatch) => {
  dispatch({ type: Types.DELETE_PRODUCT_REQUEST });

  await API.delete(`product/${id}`)
    .then((response) => {
      dispatch({ type: Types.DELETE_PRODUCT_SUCCESS, payload: response.data.success });
    })
    .catch((error) => {
      dispatch({ type: Types.DELETE_PRODUCT_FAIL, payload: error });
    })
}

// get ALL Products
export const search = (
  keyword = "",
  currentPage = 1,
  price = [0, 100000],
  category,
  ratings = 0
) => async (dispatch) => {
    dispatch({ type: Types.ALL_PRODUCT_REQUEST });

    let link = `product?keyword=${keyword}&page=${currentPage}&price=${price[0]}&ratings=${ratings}`;  
    if (category) {
      link = `/api/v1/product?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
    }
    
    await API.get(link)
      .then((response) => {
        dispatch({ type: Types.ALL_PRODUCT_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.ALL_PRODUCT_FAIL, payload: error });
      });
};

// clear error
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERRORS });
};
