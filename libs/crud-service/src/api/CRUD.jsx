import axios from "axios";
import * as Types from "./types.js";
import { API_BASE_URL, AXIOS_CONFIG } from "./config.jsx";

const CRUD = {

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

  all: (entity) => async (dispatch) => {
    if (entity === undefined) {
      console.log("Error :: Missing entity");
      return;
    }
    dispatch({ type: Types.REQUEST_LOADING, keyState: "list", payload: null });

    await axios.get(API_BASE_URL + '/' + entity + '/all')
      .then((response) => { dispatch({ type: Types.REQUEST_SUCCESS, payload: response.data.result, keyState: "list" }); })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: "list", payload: error }); })
  },

  list: (entity, _page = 1) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "list", payload: null });

    await axios.get(API_BASE_URL + '/' + entity)
      .then((response) => {
        if ( response.data.success === true ) {
         (response.data.pagination) ? response.data.pagination : { page:_page, pages:null, count:0 };
          
          const results = { result: response.data.result,
            pagination: {pageSize: 10,
              current: parseInt(response.data.result.page, 10),
              total: parseInt(response.data.result.count, 10)
            }}; 
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: "list", payload: results });
        }
        dispatch({ type: Types.CURRENT_ITEM, payload: response.data.result });
      })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: "list", payload: error }); });
  },

  create: (entity, _data) => async (dispatch) => {
    dispatch({type: Types.REQUEST_LOADING});
  
    await axios.post(API_BASE_URL + '/' + entity + `/new`, _data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, payload: response.data.result, keyState: "create" });
        }
        dispatch({ type: Types.CURRENT_ITEM, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, payload: error, keyState: "create" });
      });
  },

  read: (entity, _id) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "read", payload: null });

   await axios.get(API_BASE_URL + '/' + entity + '/' + _id)
    .then((response) => {
      if ( response.data.success ) {
        dispatch({ type: Types.CURRENT_ITEM, payload: response.data.result });
      }
      dispatch({ type: Types.REQUEST_SUCCESS, keyState: "read", payload: response.data.result });
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
        dispatch({ type: Types.REQUEST_SUCCESS, keyState: "delete", payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "delete", payload: error });
      });
  },

  search: (
      keyword = "",
      currentPage = 1,
      price = [0, 100000],
      category,
      ratings = 0
    ) => async (dispatch) => {
      dispatch({ type: Types.REQUEST_LOADING });

      let link = API_BASE_URL + `/${entity}?`;
      
      link += `keyword=${keyword}&page=${currentPage}&price=${price[0]}&ratings=${ratings}`;  
      if (category) {
        link += `keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
      }
    
      await axios.get(API_BASE_URL + link)
        .then((response) => {
          dispatch({ type: Types.REQUEST_SUCCESS, payload: response.data.result });
        })
        .catch((error) => {
          dispatch({ type: Types.REQUEST_FAILED, payload: error });
        });
    },
};

CRUD.cart = {};

CRUD.wishlist = {};

export default CRUD;