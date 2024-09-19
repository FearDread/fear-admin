import * as types from "../types/brand";

const initialState = {
    brand:{},
    brands:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const brandsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_BRAND_REQUEST:
    case types.ADMIN_BRAND_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ADMIN_BRAND_SUCCESS:
    case types.ALL_BRAND_SUCCESS: {
      return {
        loading: false,
        BRANDs: action.payload,
      };
    }
    case types.ALL_BRAND_FAIL:
    case types.ADMIN_BRAND_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.NEW_BRAND_REQUEST: {
      return { loading: true };
    }

    case types.NEW_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        newBRANDData: action.payload.data,
      };

    case types.NEW_BRAND_FAIL: {
      console.log(action.type);
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_BRAND_RESET:
      return {
        ...state,
        loading: false,
        newBRANDData: []
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

export default brandsReducer;