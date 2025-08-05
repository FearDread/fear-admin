import API from "../api/instance";
import * as Types from "./types";

export const list = () => async (dispatch) => {

  dispatch({ type: Types.ADMIN_TASK_REQUEST });
  
  await API.get("task/all")
    .then((response) => {
      dispatch({ type: Types.ADMIN_TASK_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ADMIN_TASK_FAIL, payload: error });
    });
};

export const create = (data) => async (dispatch) => {
    dispatch({type: Types.NEW_TASK_REQUEST});

    await API.post(`task/new`, data,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("task response :: ", response);
        dispatch({ type: Types.NEW_TASK_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.NEW_TASK_FAIL, payload: error });
    });
}
  
export function remove (id) {
    return async function(dispatch) {
      try {
        dispatch({ type: Types.DELETE_TASK_REQUEST });
  
        const { data } = await API.delete(`task/${id}`);
      
        dispatch({ type: Types.DELETE_TASK_SUCCESS, payload: data.success });
      } catch (error) {
        dispatch({ type: Types.DELETE_TASK_FAIL, payload: error.message });
      }
  };
}

export const reset = () => async (dispatch) => {
  dispatch({type: Types.CLEAR_ERRORS});
}