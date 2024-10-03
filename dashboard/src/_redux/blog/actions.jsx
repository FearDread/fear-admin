import axios from "axios";
import * as Types from "./types";
import { API_BASE_URL } from "../config";

export const read = (id) => async (dispatch) => {
    dispatch({ type: Types.BLOG_DETAILS_REQUEST });
  
    await axios.get(API_BASE_URL + `/blog/${id}`)
      .then((response) => { dispatch({ type: Types.BLOG_DETAILS_SUCCESS, payload: response.data.result }); })
      .catch((error) => { dispatch({ type: Types.BLOG_DETAILS_FAIL, payload: error }); });
};

export const list = () => async (dispatch) => {
    dispatch({ type: Types.ALL_BLOG_REQUEST });
  
    await axios.get(API_BASE_URL + "/blog/all")
      .then((response) => { dispatch({ type: Types.ALL_BLOG_SUCCESS, payload: response.data.result }); })
      .catch((error) => { dispatch({ type: Types.ALL_BLOG_FAIL, payload: error }); });
};
  
export const create = (data) => async (dispatch) => {
    dispatch({type: Types.NEW_BLOG_REQUEST});
  
    await axios.post(API_BASE_URL + `/blog/new`, data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => { dispatch({ type: Types.NEW_BLOG_SUCCESS, payload: response.data.result }); })
      .catch((error) => { dispatch({ type: Types.NEW_BLOG_FAIL, payload: error }); });
};

export const remove = (_id) => async(dispatch) => {
  dispatch({ type: Types.DELETE_BLOG_REQUEST });

  await axios.delete(API_BASE_URL + `/blog/${_id}`)
    .then((response) => { dispatch({ type: Types.DELETE_BLOG_SUCCESS, payload: response.success }); })
    .catch((error) => { dispatch({ type: Types.DELETE_BLOG_FAIL, payload: error }); });
};