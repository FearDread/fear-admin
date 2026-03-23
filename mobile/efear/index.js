/**
 * index.js
 *
 * IMPORT ORDER IS CRITICAL — do not reorder the first two imports.
 *
 * polyfills.js MUST come first because @feardread/feature-factory (and Axios
 * bundled inside it) call window.addEventListener and globalThis.addEventListener
 * at module evaluation time — before any component renders. Metro evaluates
 * imports sequentially, so the polyfill runs first and stubs those APIs before
 * the package tries to call them.
 */

// ── 1. Polyfills — MUST BE FIRST ─────────────────────────────────────────────
import './polyfills';

// ── 2. Everything else ────────────────────────────────────────────────────────
import { configureStore }     from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';
import { Provider }           from 'react-redux';

import { name as appName }    from './app.json';
import Storage                from './features/storage';
import { initializeStore }    from './features/store';
import App                    from './App';

// ── Synchronous fallback store ────────────────────────────────────────────────
// Provider must never receive null. This minimal store is replaced by the real
// one after Storage.preload() completes (usually < 50 ms), but prevents any
// "no store" error on the very first render frame.
const FALLBACK_STORE = configureStore({
  reducer: { _boot: (state = {}) => state },
});

// ── Root ──────────────────────────────────────────────────────────────────────
function Root() {
  const [store, setStore] = useState(FALLBACK_STORE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      // Step 1: fill AsyncStorage cache so Storage.load() is synchronous
      try {
        await Storage.preload();
      } catch (err) {
        console.warn('[bootstrap] Storage.preload:', err);
      }

      // Step 2: create the real Redux store
      try {
        const realStore = initializeStore();
        if (alive) { setStore(realStore); setReady(true); }
      } catch (err) {
        console.error('[bootstrap] initializeStore:', err);
        // Keep fallback store; still mark ready so spinner resolves
        if (alive) setReady(true);
      }
    }

    bootstrap();
    return () => { alive = false; };
  }, []);

  return (
    <Provider store={store}>
      {ready ? (
        <App />
      ) : (
        <View style={s.boot}>
          <ActivityIndicator size="large" color="#b30e1c" />
        </View>
      )}
    </Provider>
  );
}

// ── Register synchronously at module level — never inside async ───────────────
AppRegistry.registerComponent(appName, () => Root);

const s = StyleSheet.create({
  boot: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: '#0d0d0d',
  },
});