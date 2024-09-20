import axios from "axios";
import * as Types from "../types/brand";
import { API_BASE_URL } from "variables/api";

export const list = () => async (dispatch) => {
    try {
      dispatch({ type: Types.ADMIN_BRAND_REQUEST });
  
      const response = await axios.get(API_BASE_URL + "/brand/all");
  
      dispatch({ type: Types.ADMIN_BRAND_SUCCESS, payload: response.data.result });
    } catch (error) {
      dispatch({ type: Types.ADMIN_BRAND_FAIL, payload: error });
    }
  };

  export const create = (brandData) => async (dispatch) => {
    dispatch({type: Types.NEW_BRAND_REQUEST});
    await axios.post(API_BASE_URL + `/brand/new`, brandData,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("Brand response :: ", response);
        dispatch({ type: Types.NEW_BRAND_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.NEW_BRAND_FAIL, payload: error });
    });
  }
  
  export function remove (id) {
    return async function(dispatch) {
      try {
        dispatch({ type: Types.DELETE_BRAND_REQUEST });
  
        const { data } = await axios.delete(API_BASE_URL + `/brand/${id}`);
      
        dispatch({ type: Types.DELETE_BRAND_SUCCESS, payload: data.success });
      } catch (error) {
        dispatch({ type: Types.DELETE_BRAND_FAIL, payload: error.message });
      }
    };
  }

  export const reset = () => async (dispatch) => {
    dispatch({type: Types.CLEAR_ERRORS});
  }