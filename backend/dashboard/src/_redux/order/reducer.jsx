import * as types from "./types";

const initialState = {
    order:{},
    orders:[],
    newOrderData:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_ORDER_REQUEST:
    case types.ORDER_DETAILS_REQUEST:
    case types.UPDATE_ORDER_REQUEST:
    case types.NEW_ORDER_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        ORDER: action.payload
      }
    case types.ALL_ORDER_SUCCESS: {
      return {
        loading: false,
        ORDERs: action.payload,
      };
    }
    case types.ORDER_DETAILS_FAIL:
    case types.ALL_ORDER_FAIL:
    case types.UPDATE_ORDER_FAIL:  
    case types.NEW_ORDER_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.UPDATE_ORDER_SUCCESS:
    case types.NEW_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        newORDERData: action.payload,
      };
    case types.UPDATE_ORDER_RESET:
    case types.ORDER_DETAILS_RESET:
    case types.NEW_ORDER_RESET:
      return {
        ...state,
        success: false,
      };
    // Clear error
    case types.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default orderReducer;