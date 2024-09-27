import axios from "axios";
import * as Types from "./types";
import { API_BASE_URL, AXIOS_CONFIG } from "./config";

export const API = {
  resetState: () => async (dispatch) => {
    dispatch({ type: Types.RESET_STATE });
  },
  resetAction: (actionType) => async (dispatch) => {
    dispatch({ type: Types.RESET_ACTION, keyState: actionType, payload: null });
  },
  currentItem: (data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ITEM, payload: { ...data } });
  },
  currentAction: (actionType, data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ACTION, keyState: actionType, payload: { ...data } });
  },

  list: (entity, currentPage = 1) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "list", payload: null });

    await axios.get(API_BASE_URL + '/' + entity + '/all')
      .then((request) => {
        if (request.data.success === true) {
          const results = {
            result: request.data.result,
            pagination: {
              pageSize: 10,
              current: parseInt(request.data.pagination.page, 10),
              total: parseInt(request.data.pagination.count, 10)
            },
          };
          
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "list", payload: results });
        }
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "list", payload: null });
      });
  },

  create: (entity, formData) => async (dispatch) => {
    dispatch({type: Types.REQUEST_LOADING});
  
    await axios.post(API_BASE_URL + '/' + entity + `/new`, formData,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("Crud response :: ", response);
        if (response.data.success === true) {
          dispatch({ type: Types.REQUEST_SUCCESS, payload: response.data.result, keyState: "create" });
        }
        dispatch({ type: Types.CURRENT_ITEM, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, payload: error, keyState: "create" });
      });
  },
  read: (entity, itemId) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: "read",
      payload: null,
    });

    let data = await request.read(entity, itemId);

    if (data.success === true) {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: data.result,
      });
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: "read",
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: "read",
        payload: null,
      });
    }
  },
  update: (entity, itemId, jsonData) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: "update",
      payload: null,
    });

    let data = await request.update(entity, itemId, jsonData);

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: "update",
        payload: data.result,
      });
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: "update",
        payload: null,
      });
    }
  },

  delete: (entity, itemId) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: "delete",
      payload: null,
    });

    let data = await request.delete(entity, itemId);

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: "delete",
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: "delete",
        payload: null,
      });
    }
  },

  search: (entity, source, option) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: "search",
      payload: null,
    });

    source.cancel();

    source = request.source();
    let data = await request.search(entity, source, option);

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: "search",
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: "search",
        payload: null,
      });
    }
  },
};

export default API;
