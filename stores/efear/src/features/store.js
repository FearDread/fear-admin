// store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import product from './products/slice';
import category from './categories/slice';
import brand from './brands/slice';
import user, { restoreUser } from './user/slice';
import cart from './cart/slice';
import address from "./address/slice";
import wishlist from './wishlist/slice';
import order from "./orders/slice";
import payment from "./payments/slice";
import mail from "./mail/slice";
import Storage from './storage';

export const initializeStore = () => {

  const store = configureStore({
    reducer: {
      addresses: address.reducer,
      orders: order.reducer,
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
    console.log('User session restored from storage');
  }

  return store;
};

export const store = initializeStore();
export const getState = () => store.getState();
export const dispatch = (action) => store.dispatch(action);

export default store;