import API from "../api/instance";
import * as Types from "./types.js";
import StorePersist from "../store/StorePersist.jsx";

const cart = {
    create: (_data) => async (dispatch, getState) => {
        await API.post("cart/product/" + _data.productId, _data)
            .then((response) => {
                console.log('added to cart :: ', response);
                dispatch({ type: Types.CART_ADD_TO, payload: response.data.result })
                StorePersist.set("cart", {items: getState().cart.items});
            })
            .catch((error) => { dispatch({ type: Types.CART_FAIL, payload: error }); }
        );
    },

    read: (userId) => async (dispatch) => {
        await API.get("cart/mycart", userId)
            .then((response) => { dispatch({ type: Types.CART_USER, payload: response.data.result }) })
            .catch((error) => { dispatch({ type: Types.CART_FAIL, payload: null })});
    },

    update: (product) => async (dispatch) => {

    },
  
    remove: (id) => async (dispatch, getState) => {
        dispatch({ type: CART_REMOVE_ITEM, payload: id });
        StorePersist.set("cart", {items: getState().cart.items});
    },

    shipping: (data) => async (dispatch) => {
        dispatch({ type: CART_SHIPPING_INFO, payload: data });
        StorePersist.set("shipping", { data });
    }
  }

  export default cart;