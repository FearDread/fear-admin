import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '@/lib/redux/api/apiSlice';
import wishlistReducer from '@/lib/redux/slices/wishSlice';
import authReducer from './slices/authSlice';

// Side-effect imports: each of these calls `apiSlice.injectEndpoints(...)`
// when the module loads. They must be imported before `configureStore` runs
// so their endpoints exist on `apiSlice.reducer` from the very first render.
import './api/authApi';
import './api/productsApi';
import './api/categoriesApi';
import './api/cartApi';
import './api/brandsApi';
import './api/mailApi';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  // Add any other plain (non-RTK-Query) feature reducers here, e.g.:
  // wishlist: wishlistReducer,
  // ui: uiReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
//export type RootState = ReturnType<AppStore['getState']>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];