// store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import product from './products/slice';
import category from './categories/slice';
import brand from './brands/slice';
import user from './user/slice';
import cart from './cart/slice';
import wishlist from './wishlist/slice';

/**
 * Configure the Redux store with all feature slices
 */

export const store = configureStore({
  reducer: {
    products: product.reducer,
    categories: category.reducer,
    brands: brand.reducer,
    users: user.reducer,
    cart: cart.reducer,
    wishlist: wishlist.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: false,
      },
    }),
  devTools: true,
});

// Setup listeners for RTK Query (if needed in future)
//setupListeners(store.dispatch);

export const getState = () => store.getState();
export const dispatch = (action) => store.dispatch(action);

export default store;