import axios from "axios";
import * as Types from "./types.js";
import { API_BASE_URL } from "./config.jsx";

const cruds = {

  getCurrentState: () => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ITEM });
  },

  resetCurrentState: () => async (dispatch) => {
    dispatch({ type: Types.RESET_STATE });
  },

  resetCurrentAction: (actionType) => async (dispatch) => {
    dispatch({ type: Types.RESET_ACTION, keyState: actionType, payload: null });
  },

  setCurrentItem: (data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ITEM, payload: { ...data } });
  },

  setCurrentAction: (actionType, data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ACTION, keyState: actionType, payload: { ...data } });
  },

  all: (entity) => async (dispatch) => {
    if (entity === undefined) {
      console.log("Error :: Missing entity");
      return;
    }
    dispatch({ type: Types.REQUEST_LOADING, keyState: entity, payload: null });

    await axios.get(API_BASE_URL + '/' + entity + '/all')
      .then((response) => { dispatch({ type: Types.REQUEST_SUCCESS, payload: response.data.result, keyState: entity }); })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error }); })
  },

  list: ( entity, _page = 1, _items = 10) => async (dispatch) => {
    if (entity === undefined) {
      console.log("Error :: Missing entity");
      return;
    }
    dispatch({ type: Types.REQUEST_LOADING, keyState: entity, payload: null });

    let page = _page ? "page=" + _page : "";
    let items = _items ? "&items=" + _items : "";
    let query = `?${page}${items}`;

    await axios.get(API_BASE_URL + '/' + entity + query)
      .then((response) => {
        if ( response.data.success === true ) {
          const results = { result: response.data.result, pagination: response.data.pagination}; 
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: results });
        }
      })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error }); });
  },

  filter: ( entity, option = {} ) => async (dispatch) => {
    let filter = option.filter ? "filter=" + option.filter : "";
    let equal = option.equal ? "&equal=" + option.equal : "";
    let query = `?${filter}${equal}`;

    await axios.get(API_BASE_URL + '/' + entity + query)
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result });
        }
      })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error }); });
  },

  create: ( entity, _data ) => async (dispatch) => {
    dispatch({type: Types.REQUEST_LOADING});
  
    await axios.post(API_BASE_URL + '/' + entity + `/new`, _data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "create", payload: response.data.result });
        }
        dispatch({ type: Types.CURRENT_ITEM, keyState: entity, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "create", payload: error });
      });
  },

  read: (entity, _id) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "read", payload: null });

    await axios.get(API_BASE_URL + '/' + entity + '/' + _id)
      .then((response) => { 
        if ( response.data.success ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "read", payload: response.data.result });
        }
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "read", payload: error });
      });
  },

  update: (entity, _id, _data) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "update", payload: null });

    await axios.put(API_BASE_URL + '/' + entity, _id, _data)
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "update", payload: response.data.result });
        }
        dispatch({ type: Types.CURRENT_ITEM, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "update", payload: error });
      });
  },

  delete: (entity, _id) => async (dispatch) => {
    dispatch({type: Types.REQUEST_LOADING, keyState: "delete", payload: null });

    await axios.delete(API_BASE_URL + '/' + entity, _id)
      .then((response) => {
        dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error });
      });
  },

  search: (
      entity,
      keyword = "",
      currentPage = 1,
      price = [0, 100000],
      category,
      brand,
      ratings = 0
    ) => async (dispatch) => {
      dispatch({ type: Types.REQUEST_LOADING, keyState: "search" });

      let link = API_BASE_URL + `/` + entity + '?';
      
      link += `keyword=${keyword}&page=${currentPage}&price=${price[0]}&ratings=${ratings}`;  
      if (category) {
        link += `keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
      }
    
      await axios.get(API_BASE_URL + link)
        .then((response) => {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "search", payload: response.data.result });
        })
        .catch((error) => {
          dispatch({ type: Types.REQUEST_FAILED, keyState: "search", payload: error });
        });
    }
};

export default cruds;