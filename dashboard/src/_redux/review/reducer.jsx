import * as types from "./types";

const initialState = {
    review:{},
    reviews:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_REVIEW_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ALL_REVIEW_SUCCESS: {
      return {
        loading: false,
        reviews: action.payload,
      };
    }
    case types.ALL_REVIEW_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.NEW_REVIEW_REQUEST: {
      return { 
        ...state,
        loading: true
       };
    }

    case types.NEW_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        review: action.payload,
      };

    case types.NEW_REVIEW_FAIL: {
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_REVIEW_RESET:
      return {
        initialState
      };
    default:
      return state;
  }
};

export default reviewReducer;