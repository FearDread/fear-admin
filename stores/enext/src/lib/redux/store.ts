import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';

import { productsApi } from './api/productsApi';
import { categoriesApi } from './api/categoriesApi';
import { mailApi } from './api/mailApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      [productsApi.reducerPath]: productsApi.reducer,
      [categoriesApi.reducerPath]: categoriesApi.reducer,
      [mailApi.reducerPath]: mailApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(productsApi.middleware)
        .concat(categoriesApi.middleware)
        .concat(mailApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];