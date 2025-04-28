import * as types from "./types";

const initialState = {
    event:{},
    events:[],
    loading: false,
    success: false
}

const EventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALL_EVENT_REQUEST:
    case types.ADMIN_EVENT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.ADMIN_EVENT_SUCCESS:
    case types.ALL_EVENT_SUCCESS: {
      return {
        loading: false,
        events: action.payload,
      };
    }
    case types.ALL_EVENT_FAIL:
    case types.ADMIN_EVENT_FAIL: {
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    }
    case types.NEW_EVENT_REQUEST: {
      return { 
        ...state,
        loading: true,
       };
    }

    case types.NEW_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        event: action.payload.data,
      };

    case types.NEW_EVENT_FAIL: {
      console.log(action.type);
      return {
        loading: false,
        error: action.payload,
      };
    }
    case types.NEW_EVENT_RESET:
      return {
        ...state,
        success: false,
      };

    case types.UPDATE_EVENT_SUCCESS:
        return {
          ...state,
          loading: false,
          isUpdated: action.payload,
        };

      case types.DELETE_EVENT_SUCCESS:
        return {
          ...state,
          loading: false,
          isDeleted: action.payload,
        };
      case types.DELETE_EVENT_FAIL:
      case types.UPDATE_EVENT_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case types.UPDATE_EVENT_RESET:
        return {
          ...state,
          isUpdated: false,
        };
  
      case types.DELETE_EVENT_RESET:
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

export default EventsReducer;