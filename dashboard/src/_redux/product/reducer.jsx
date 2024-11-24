import * as types from "./types";

const initialState = {
    product:{},
    products:[],
    newProductData:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_PRODUCT_REQUEST:
    case types.PRODUCT_DETAILS_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.NEW_PRODUCT_REQUEST:
    case types.ADMIN_PRODUCT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload
      }
    case types.ADMIN_PRODUCT_SUCCESS:
    case types.ALL_PRODUCT_SUCCESS: {
      return {
        loading: false,
        products: action.payload,
      };
    }
    case types.PRODUCT_DETAILS_FAIL:
    case types.ALL_PRODUCT_FAIL:
    case types.UPDATE_PRODUCT_FAIL:  
    case types.NEW_PRODUCT_FAIL:
    case types.ADMIN_PRODUCT_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.UPDATE_PRODUCT_SUCCESS:
    case types.NEW_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        newProductData: action.payload,
      };
    case types.UPDATE_PRODUCT_RESET:
    case types.PRODUCT_DETAILS_RESET:
    case types.NEW_PRODUCT_RESET:
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

export default productsReducer;