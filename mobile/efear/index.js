/**
 * index.js — React Native entry point (fixed)
 *
 * Bug fixes vs previous version:
 *
 *  1. RACE CONDITION (_store null on first render):
 *     Root is now a stateful component. It shows a spinner until
 *     bootstrap() finishes and calls setStore(), THEN renders Provider.
 *
 *  2. FONT LOADING (per-screen nulls):
 *     Fonts are loaded once in App.jsx. Screens never need useFonts.
 *
 *  3. CRASH GUARD:
 *     If Storage.preload() or initializeStore() throws, a bare fallback
 *     store is used so the app renders rather than hanging blank.
 */

import { useEffect, useState }     from 'react';
import { ActivityIndicator, AppRegistry, StyleSheet, View } from 'react-native';
import { Provider }                from 'react-redux';
import { name as efear }         from './app.json';

import Storage                     from './features/storage';
import { initializeStore }         from './features/store';
import App                         from './App';

function Root() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try { await Storage.preload(); }
      catch (e) { console.warn('[bootstrap] Storage.preload:', e); }

      try {
        const s = initializeStore();
        if (!cancelled) setStore(s);
      } catch (e) {
        console.error('[bootstrap] initializeStore:', e);
        // Bare fallback so the app isn't permanently blank
        const { configureStore } = require('@reduxjs/toolkit');
        if (!cancelled) setStore(configureStore({ reducer: { _: (s = {}) => s } }));
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  if (!store) {
    return (
      <View style={s.boot}>
        <ActivityIndicator size="large" color="#b30e1c" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(efear, () => Root);

const s = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0d0d',
  },
});