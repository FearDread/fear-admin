// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
// Import reducers
import user, { restoreUser } from './user/slice';
import product from './products/slice';
import hipcomic from './hipcomics/slice';
import category from "./categories/slice";
import brand from "./brands/slice";
import order from "./orders/slice";
import event from "./events/slice";
import review from "./review/slice";
import blogposts from "./blog/slice";


export const initializeStore = () => {

  const store = configureStore({
      reducer: {
        users: user.reducer,
        reviews: review.reducer,
        products: product.reducer,
        categories: category.reducer,
        brands: brand.reducer,
        orders: order.reducer,
        events: event.reducer,
        hipcomic: hipcomic.reducer,
        blog: blogposts.reducer,
  },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['users/restoreUser'],
        },
      }).concat(logger),
  });

  // Restore user session from storage
  const storedAuth = Storage.load();
  if (storedAuth) {
    store.dispatch(restoreUser(storedAuth));
    console.log('User session restored from storage');
  }

  return store;
};

export const store = initializeStore();

export default store;