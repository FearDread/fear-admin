// store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import productReducer from './products/slice';
import categoryReducer from './categories/slice';
import brandReducer from './brands/slice';

/**
 * Configure the Redux store with all feature slices
 */
export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['your/action/type'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query (if needed in future)
setupListeners(store.dispatch);

export const getState = () => store.getState();
export const dispatch = (action) => store.dispatch(action);

export default store;