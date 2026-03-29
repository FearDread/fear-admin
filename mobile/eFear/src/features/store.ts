import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import product from './products/slice';
import category from './categories/slice';
import brand from './brands/slice';
import user, { restoreUser, setCurrentUser } from './user/slice';
import cart from './cart/slice';
import address from "./address/slice";
import wishlist from './wishlist/slice';
import order from "./orders/slice";
import payment from "./payments/slice";
import mail from "./mail/slice";
import blog from "./blog/slice";
import review from "./review/slice";
import Storage from './storage';
import { API } from "@feardread/feature-factory";

export const initializeStore = () => {
    console.log('base url ', API.getBaseUrl());
  API.setBaseUrl('https://fear.dedyn.io/fear/api');
  console.log('base url ', API.getBaseUrl());
  const store = configureStore({
    reducer: {
      addresses: address.reducer,
      orders: order.reducer,
      blog: blog.reducer,
      reviews: review.reducer,
      payments: payment.reducer,
      products: product.reducer,
      categories: category.reducer,
      brands: brand.reducer,
      users: user.reducer,
      cart: cart.reducer,
      wishlist: wishlist.reducer,
      mail: mail.reducer,
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
    store.dispatch(setCurrentUser(storedAuth.currentUser))
    console.log('User session restored from storage', storedAuth);
  }

  return store;
};
export const store = initializeStore();

// ✅ Correct TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional helpers
export const getState = store.getState;
export const dispatch = store.dispatch;
