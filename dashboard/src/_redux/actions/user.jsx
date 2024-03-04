import axios from "axios";
import * as actionTypes from "../types/user";
import storePersist from "../storePersist";
import { API_BASE_URL } from "../../variables/api.js";


export function loadProfile() {
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.LOAD_USER_REQUEST });
      // Check if user data is available in session storage
      const userData = storePersist.get("user");
      if ( userData !== undefined ) {
        const user = JSON.parse(userData);
        dispatch({ type: actionTypes.LOAD_USER_SUCCESS, payload: user });
      
      } else {
  
        const response = await axios.get(API_BASE_URL + "/profile");
        storePersist.set("user", response.result.user);
  
        dispatch({ type: actionTypes.LOAD_USER_SUCCESS, payload: response });
      }
    } catch (error) {
      dispatch({ type: actionTypes.LOAD_USER_FAIL, payload: error });
    }
  }
};

export function updateProfile(userData) {
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.UPDATE_PROFILE_REQUEST });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };


      const { data } = await axios.put(
        API_BASE_URL + `/profile/update`,
        userData,
        config
      );

     if(data.user !== undefined && data.user) {
      sessionStorage.removeItem("user");
       sessionStorage.setItem("user", JSON.stringify(data.user))
     }

      dispatch({
        type: actionTypes.UPDATE_PROFILE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: actionTypes.UPDATE_PROFILE_FAIL, payload: error.message })
    }
  }
}


export function updatePassword(userPassWord) {
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.UPDATE_PASSWORD_REQUEST });

      const { data } = await axios.put(
        API_BASE_URL + `/password/update`,
        userPassWord,
        {headers: {"Content-Type": "application/json"}}
      );

      dispatch({type: actionTypes.UPDATE_PASSWORD_SUCCESS, payload: data.success,});
    
    } catch (error) {
      dispatch({ type: actionTypes.UPDATE_PASSWORD_FAIL, payload: error.message })
    }
  }
}
// forgetPassword;

export function forgetPassword(email) {
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.FORGOT_PASSWORD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        `/api/v1/password/forgot`,
        email,
        config
      );

      dispatch({
        type: actionTypes.FORGOT_PASSWORD_SUCCESS,
        payload: data.message,
      });
    } catch (error) {
      dispatch({ type: actionTypes.FORGOT_PASSWORD_FAIL, payload: error.message });
    }
  };
}


// reset password action
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/v1/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: actionTypes.RESET_PASSWORD_FAIL,
      payload: error.message,
    });
  }
};


// get All user Action --> admin 
export const getAllUsers  = () => async (dispatch) =>{
     
  try {

    dispatch({type : actionTypes.ALL_USERS_REQUEST})

    const response = await axios.get(API_BASE_URL + "/admin/users");

    dispatch({ type: actionTypes.ALL_USERS_SUCCESS, payload: response.users});
    
  } catch (error) {
      dispatch({type : actionTypes.ALL_USERS_FAIL , payload : error.message})
  }

}

// get User details --> admin

export const getUserDetails = (id) => async (dispatch) => {
  try {
     dispatch({type : actionTypes.USER_DETAILS_REQUEST})
     
     const { data } = await axios.get(API_BASE_URL + `/admin/user/${id}`);
     
     dispatch({ type: actionTypes.USER_DETAILS_SUCCESS, payload: data.user });

  } catch (error) {
     dispatch({ type: actionTypes.USER_DETAILS_FAIL , error : error.message});
  }
}

// upadte user role ---> admin
export const updateUser = (id, userData) => async (dispatch) => {
       console.log(id);
  try {
     dispatch({type : actionTypes.UPDATE_USER_REQUEST})


     const config  = {headers : {"Content-Type" : "application/json"}}
     const { data } = await axios.put(
      API_BASE_URL + "/admin/user/:id}",
       userData,
       config
     );
      console.log(data);
      dispatch({ type: actionTypes.UPDATE_USER_SUCCESS, payload: data.success });

  } catch (error) {
      dispatch({type : actionTypes.UPDATE_USER_FAIL , payload : error.message} )
  }

}

export const deleteUser  =(id) => async (dispatch) =>{
  try {
       dispatch({ type: actionTypes.DELETE_USER_REQUEST });
       
       const { data } = await axios.delete(API_BASE_URL + `/admin/user/${id}`);
      
       dispatch({type : actionTypes.DELETE_USER_SUCCESS , payload : data})

  } catch (error) {
      dispatch({type : actionTypes.DELETE_USER_FAIL , payload : error.message})
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: actionTypes.CLEAR_ERRORS });
};

