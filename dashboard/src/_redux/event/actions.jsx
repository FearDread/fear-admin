import API from "../api/instance";
import * as Types from "./types";

export const list = () => async (dispatch) => {

  dispatch({ type: Types.ADMIN_EVENT_REQUEST });
  
  await API.get("events/all")
    .then((response) => {
      dispatch({ type: Types.ADMIN_EVENT_SUCCESS, payload: response.data.result });
    })
    .catch((error) => {
      dispatch({ type: Types.ADMIN_EVENT_FAIL, payload: error });
    });
};

export const create = (EVENTData) => async (dispatch) => {
    dispatch({type: Types.NEW_EVENT_REQUEST});

    await API.post(`events/new`, EVENTData,
      {headers: { "Content-Type": "multipart/form-data" }})
      .then((response) => {
        console.log("EVENT response :: ", response);
        dispatch({ type: Types.NEW_EVENT_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        dispatch({ type: Types.NEW_EVENT_FAIL, payload: error });
    });
}
  
export function remove (id) {
    return async function(dispatch) {
      try {
        dispatch({ type: Types.DELETE_EVENT_REQUEST });
  
        const { data } = await API.delete(`events/${id}`);
      
        dispatch({ type: Types.DELETE_EVENT_SUCCESS, payload: data.success });
      } catch (error) {
        dispatch({ type: Types.DELETE_EVENT_FAIL, payload: error.message });
      }
  };
}