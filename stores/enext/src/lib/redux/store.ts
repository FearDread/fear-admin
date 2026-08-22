import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/lib/redux/api/apiSlice';
import authReducer from '@/lib/redux/slices/authSlice';
import wishlistReducer from '@/lib/redux/slices/wishSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];