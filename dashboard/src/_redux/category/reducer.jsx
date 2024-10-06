import * as types from "./types";

const initialState = {
    category:{},
    categories:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_CATEGORY_REQUEST:
    case types.NEW_CATEGORY_REQUEST:
    case types.ADMIN_CATEGORY_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ADMIN_CATEGORY_SUCCESS:
    case types.ALL_CATEGORY_SUCCESS: {
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    }
    case types.ALL_CATEGORY_FAIL:
    case types.ADMIN_CATEGORY_FAIL: {
      return {
        loading: false,
        success: false,
        result: action.payload,
      };
    }

    case types.NEW_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        category: action.payload,
      };

    case types.NEW_CATEGORY_FAIL: {
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_CATEGORY_RESET:
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

export default categoryReducer;