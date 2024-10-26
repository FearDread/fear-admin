
import * as Types from "./types.js";

const INITIAL_STATE = {
    items: [],
    shipping: {},
    totalAmount: 0
};

const cartReducer = (state = INITIAL_STATE, action) => {
    
    switch (action.type) {
        
        case Types.CART_ADD_TO:
          const item = action.payload;
          const isExist = state.items.find(cartItem => {
            return cartItem.productId === item.productId;
          })
          if (isExist) {
            return {
              ...state,
              items: state.items.map((cartItem) => {
                return item.productId === cartItem.productId ? item : cartItem;
              }),
            };
          } else {
            return {
              ...state,
              items: [...state.items, item]
            }
          }

        case Types.CART_REMOVE_ITEM:
          return {
            ...state,
            items: state.items.filter(item => item.productId !== action.payload)
          }

        case Types.CART_SHIPPING_INFO: 
            return {
                ...state,
                shipping:  action.payload,
            };

        default: return state
    }
}

export default cartReducer;