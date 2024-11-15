import * as Types from "./types";

const INITIAL_KEY_STATE = {
  result: [],
  current: {},
  loading: false,
  success: false,
};

const INITIAL_STATE = {
  order: INITIAL_KEY_STATE,
  product: INITIAL_KEY_STATE,
  category: INITIAL_KEY_STATE,
  brand: INITIAL_KEY_STATE,
  blog: {
    ...INITIAL_KEY_STATE,
    pagination: {
      page: 1,
      pages: 1, 
      count: 10
    }
  },
  create: INITIAL_KEY_STATE,
  read: INITIAL_KEY_STATE,
  update: INITIAL_KEY_STATE,
  delete: INITIAL_KEY_STATE,
  search: { ...INITIAL_KEY_STATE,
    filter: {}, 
    pagination: {
      page: 1,
      pages: 1, 
      count: 10
    }
  }
}

const crudReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  
  switch (action.type) {
    case Types.RESET_STATE:
      return INITIAL_STATE;

    case Types.CURRENT_ITEM:
      return {
        ...state,
        [keyState]: {
          ...state[keyState]
        }
      };
    case Types.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          loading: true,
        },
      };
    case Types.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          loading: false,
          success: false,
        },
      };
    case Types.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          result: payload,
          loading: false,
          success: true,
        },
      };
    case Types.CURRENT_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_KEY_STATE,
          current: payload,
        },
      };
    case Types.RESET_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_STATE[keyState],
        },
      };
    default:
      return state;
  }
};

export default crudReducer;
