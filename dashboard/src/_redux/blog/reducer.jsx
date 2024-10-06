import * as types from "./types";

const initialState = {
    blog:{},
    blogs:[],
    loading: false,
    success: false,
    isDeleted: false,
    isUpdated: false
}

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_BLOG_REQUEST:
    case types.ALL_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.ALL_BLOG_SUCCESS:
        return {
          loading: false,
          blogs: action.payload,
        };

    case types.NEW_BLOG_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        blog: action.payload
      }

    case types.NEW_BLOG_FAIL: 
    case types.ALL_BLOG_FAIL:
       return {
          loading: false,
          success: false,
          error: action.payload,
        };

    case types.NEW_BLOG_RESET:
      return {
        ...state,
        success: false
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

export default blogReducer;