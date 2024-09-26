import * as types from "../types/product";

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
    case types.ADMIN_PRODUCT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ADMIN_PRODUCT_SUCCESS:
    case types.ALL_PRODUCT_SUCCESS: {
      return {
        loading: false,
        products: action.payload,
      };
    }
    case types.ALL_PRODUCT_FAIL:
    case types.ADMIN_PRODUCT_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.NEW_PRODUCT_REQUEST: {
      return { 
        ...state,
        loading: true
       };
    }

    case types.NEW_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        newProductData: action.payload,
      };

    case types.NEW_PRODUCT_FAIL: {
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_PRODUCT_RESET:
      return {
        initialState
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
/*
// product detalis  :
export const productDetailsReducer = (state = { product: {}, products: [], new: [] }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload, // product details from backend
        success: true,
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,

      };
      case PRODUCT_DETAILS_RESET:
        return {
         success: false,
        ...state,
        };

    // error msg clear
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };



    default:
      return state;
  }
};

// new Review Reducer


//cretae a product reducer

export const newProductReducer = (state = { newProductData: [] }, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST: {
      return { loading: true };
    }

    case NEW_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.success,
        newProductData: action.payload.data,
      };

    case NEW_PRODUCT_FAIL: {
      console.log(action.type);
      return {
        loading: false,
        error: action.payload,
      };
    }
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS: {
      return {
        ...state,
        error: null,
      };
    }

    default:
      return state;
  }
};

// delte and Upadate reducer :

export function deleteUpdateReducer(state = { product: {} }, action) {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case DELETE_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}


*/