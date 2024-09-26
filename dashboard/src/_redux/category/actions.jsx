import axios from "axios";
import * as Types from "./types";
import { API_BASE_URL } from "../config";

export const list = () => async (dispatch) => {

  dispatch({ type: Types.ADMIN_CATEGORY_REQUEST });
  
  await axios.get(API_BASE_URL + "/category/all")
    .then((response) => {
      dispatch({ type: Types.ADMIN_CATEGORY_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ADMIN_CATEGORY_FAIL, payload: error });
    });
};

export const create = (data) => async (dispatch) => {
    dispatch({type: Types.NEW_CATEGORY_REQUEST});

    await axios.post(API_BASE_URL + "/category/new", data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("CATEGORY response :: ", response);
        dispatch({ type: Types.NEW_CATEGORY_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.NEW_CATEGORY_FAIL, payload: error });
    });
}
  
export function remove (id) {
    return async function(dispatch) {
      try {
        dispatch({ type: Types.DELETE_CATEGORY_REQUEST });
  
        const { data } = await axios.delete(API_BASE_URL + `/category/${id}`);
      
        dispatch({ type: Types.DELETE_CATEGORY_SUCCESS, payload: data.success });
      } catch (error) {
        dispatch({ type: Types.DELETE_CATEGORY_FAIL, payload: error.message });
      }
  };
}

export const reset = () => async (dispatch) => {
  dispatch({type: Types.CLEAR_ERRORS});
}