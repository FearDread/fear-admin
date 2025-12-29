import * as Types from "./types";
import API from "../api/instance";

export const create = (data) => async (dispatch) => {
  dispatch({ type: Types.NEW_ORDER_REQUEST });

  await API.post('order/new', data,
    {headers: { "Content-Type": "application/json" }})
    .then((response) => {
      dispatch({ type: Types.NEW_ORDER_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.NEW_ORDER_FAIL, payload: error });
    });
};

export const read = (id) => async (dispatch) => {
  dispatch({ type: Types.ORDER_DETAILS_REQUEST });

  await API.get(`order/${id}`)
    .then((response) => {
      dispatch({ type: Types.ORDER_DETAILS_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ORDER_DETAILS_FAIL, payload: error });
    });
};

// admin ORDER request :
export const list = () => async (dispatch) => {
  dispatch({ type: Types.ALL_ORDERS_REQUEST });

  await API.get("order/all")
    .then((response) => {
      dispatch({ type: Types.ALL_ORDERS_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ALL_ORDERS_FAIL, payload: error });
    });
};

// updateORDER;
export const update = (id, data) => async (dispatch) => {
  dispatch({ type: Types.UPDATE_ORDER_REQUEST });

  await API.put(`order/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((response) => {
        console.log("update response = ", response);
        dispatch({ type: Types.UPDATE_ORDER_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        console.log('error = ', error);
        dispatch({ type: Types.UPDATE_ORDER_FAIL, payload: error });
      });
};

// Delete ORDER request
export const remove = (id) => async (dispatch) => {
  dispatch({ type: Types.DELETE_ORDER_REQUEST });

  await API.delete(`order/${id}`)
    .then((response) => {
      dispatch({ type: Types.DELETE_ORDER_SUCCESS, payload: response.data.success });
    })
    .catch((error) => {
      dispatch({ type: Types.DELETE_ORDER_FAIL, payload: error });
    })
}

// clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERRORS });
};
