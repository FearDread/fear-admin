import * as types from "./types";

const initialState = {
    task:{},
    tasks:[],
    loading: false,
    success: false
}

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_TASK_REQUEST:
    case types.ADMIN_TASK_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ADMIN_TASK_SUCCESS:
    case types.ALL_TASK_SUCCESS: {
      return {
        loading: false,
        TASKs: action.payload,
      };
    }
    case types.ALL_TASK_FAIL:
    case types.ADMIN_TASK_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.NEW_TASK_REQUEST: {
      return { 
        ...state,
        loading: true,
       };
    }

    case types.NEW_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        TASK: action.payload.data,
      };

    case types.NEW_TASK_FAIL: {
      console.log(action.type);
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_TASK_RESET:
      return {
        ...state,
        success: false,
      };

    case types.UPDATE_TASK_SUCCESS:
        return {
          ...state,
          loading: false,
          isUpdated: action.payload,
        };

      case types.DELETE_TASK_SUCCESS:
        return {
          ...state,
          loading: false,
          isDeleted: action.payload,
        };
      case types.DELETE_TASK_FAIL:
      case types.UPDATE_TASK_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case types.UPDATE_TASK_RESET:
        return {
          ...state,
          isUpdated: false,
        };
  
      case types.DELETE_TASK_RESET:
        return {
          ...state,
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

export default taskReducer;