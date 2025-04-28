import API from "../api/instance.js";
import * as Types from "./types.js";
import cache from "../cache/cache.jsx";

const loading = Types.REQUEST_LOADING;
const success = Types.REQUEST_SUCCESS;
const failed = Types.REQUEST_FAILED;
const storage = cache({type:'local'});

const cruds = {
  setCurrentItem: (data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ITEM, payload: { ...data } });
  },

  setCurrentAction: (actionType, data) => async (dispatch) => {
    dispatch({ type: Types.CURRENT_ACTION, keyState: actionType, payload: { ...data } });
  },

  all: (entity) => async (dispatch) => {

    dispatch({ type: loading, keyState: entity, payload: null });

    if (storage.has(entity)) {
    
      dispatch({ type: success, keyState: entity, payload: storage.get(entity)})
    
    } else {

      await API.get(entity + '/all', {
        id: "cruds-cache",
        cache: {
          ttl: 1000 * 60
        }
      })
        .then((response) => { 
            storage.set(entity, response.data.result);
            dispatch({ type: success, keyState: entity, payload: response.data.result }); 
        })
        .catch((error) => { dispatch({ type: failed, keyState: entity, payload: error }); })
    }
  },

  list: ( entity, _page = 1, _items = 10) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: entity, payload: null });

    let page = _page ? "page=" + _page : "";
    let items = _items ? "&items=" + _items : "";
    let query = `?${page}${items}`;

    await API.get(entity + query, {
      id: "list-cache",
      cache: {
        ttl: 1000 * 60
      }
    })
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

    await API.get(entity + query)
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result });
        }
      })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error }); });
  },

  create: ( entity, _data ) => async (dispatch) => {
    dispatch({type: Types.REQUEST_LOADING});
  
    await API.post(entity + `/new`, _data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        if ( response.data.success === true ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result });
        }
        dispatch({ type: Types.CURRENT_ITEM, keyState: entity, payload: response.data.result });
      })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: "create", payload: error });});
  },

  read: (entity, _id) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "read", payload: null });

    await API.get(entity + '/' + _id, {
      id: "read-cruds",
      cruds: {
        ttl: 1000 * 60
      }
    })
      .then((response) => { 
        if ( response.data.success ) {
          dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result });
        }
      })
      .catch((error) => {
        dispatch({ type: Types.REQUEST_FAILED, keyState: "read", payload: error });
      });
  },

  update: (entity, _id, _data) => async (dispatch) => {
    dispatch({ type: Types.REQUEST_LOADING, keyState: "update", payload: null });

    await API.put(entity, _id, _data)
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

    await API.delete(entity, _id)
      .then((response) => { dispatch({ type: Types.REQUEST_SUCCESS, keyState: entity, payload: response.data.result }); })
      .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: entity, payload: error });});
  },

  search: ( entity, params ) => async (dispatch) => {
      let link = entity + '/search?';
      let { keyword, category, currentPage, price, ratings } = params;
      
      dispatch({ type: Types.REQUEST_LOADING, keyState: "search" });
      
      link += `category=${category}&keyword=${keyword}&page=${currentPage}&price=${price}&ratings=${ratings}`;  
      if (price instanceof Array) {
        link += `keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      }
    
      await API.get(link, {
        id: 'search-cruds',
        cache: {
          ttl: 1000 * 60
        }
      })
        .then((response) => { dispatch({ type: Types.REQUEST_SUCCESS, keyState: "search", payload: response.data.result });})
        .catch((error) => { dispatch({ type: Types.REQUEST_FAILED, keyState: "search", payload: error }); });
    }
};

export default cruds;