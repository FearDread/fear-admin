import { configureStore } from '@reduxjs/toolkit';
import { setupListeners }  from '@reduxjs/toolkit/query';
import logger              from 'redux-logger';

// ── Slice imports (mirrors original store.js exactly) ────────────────────────
import product  from './products/slice';
import category from './categories/slice';
import brand    from './brands/slice';
import user, { restoreUser, setCurrentUser } from './user/slice';
import cart,    { hydrateCart }              from './cart/slice';
import address  from './address/slice';
import wishlist from './wishlist/slice';
import order    from './orders/slice';
import payment  from './payments/slice';
import mail     from './mail/slice';
import blog     from './blog/slice';
import review   from './review/slice';

// ── Supporting utilities ──────────────────────────────────────────────────────
import Storage         from './storage';
import { injectStore } from './api';

// ── Store factory ─────────────────────────────────────────────────────────────
export const initializeStore = () => {

  const store = configureStore({
    reducer: {
      // Reducer keys match original store.js exactly so every existing
      // useSelector(state => state.XXX) call works without changes.
      addresses:  address.reducer,
      orders:     order.reducer,
      blog:       blog.reducer,
      reviews:    review.reducer,
      payments:   payment.reducer,
      products:   product.reducer,
      categories: category.reducer,
      brands:     brand.reducer,
      users:      user.reducer,
      cart:       cart.reducer,
      wishlist:   wishlist.reducer,
      mail:       mail.reducer,
    },

    middleware: (getDefaultMiddleware) => {
      const base = getDefaultMiddleware({
        serializableCheck: {
          // Matches original: restoreUser carries a non-serializable date sometimes
          ignoredActions: ['users/restoreUser'],
        },
      });
      // Only attach redux-logger in development — same intent as original
      return __DEV__ ? base.concat(logger) : base;
    },
  });

  // ── Inject store into Axios interceptor (replaces circular-dep pattern) ────
  injectStore(store);

  // ── Restore auth session from Storage cache (populated by preload()) ───────
  // Mirrors original:
  //   store.dispatch(restoreUser(storedAuth))
  //   store.dispatch(setCurrentUser(storedAuth.currentUser))
  const storedAuth = Storage.load();
  if (storedAuth) {
    store.dispatch(restoreUser(storedAuth));
    store.dispatch(setCurrentUser(storedAuth.currentUser));
    if (__DEV__) console.log('[store] Session restored:', storedAuth.currentUser?.email);
  }

  // ── Rehydrate cart from AsyncStorage (async — fires after render is safe) ──
  // Web version had no cart persistence; this is a RN enhancement.
  Storage.loadCart().then((items) => {
    if (items?.length) store.dispatch(hydrateCart(items));
  });

  // ── RTK Query listener setup (no-op if no RTK Query apis added yet) ────────
  setupListeners(store.dispatch);

  return store;
};

// ── Singleton exports (mirrors original) ─────────────────────────────────────
export const store     = initializeStore();
export const getState  = () => store.getState();
export const dispatch  = (action) => store.dispatch(action);

export default store;