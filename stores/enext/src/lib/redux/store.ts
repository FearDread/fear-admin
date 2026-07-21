import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './api/productsApi';
// import { ordersApi } from './api/ordersApi';  // etc, one per entity

export const makeStore = () => {
  return configureStore({
    reducer: {
      //counter: counterReducer,
      [productsApi.reducerPath]: productsApi.reducer,
      // [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(productsApi.middleware),
        // .concat(ordersApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];