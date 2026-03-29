/**
 * entry-client.jsx — Client-Side Hydration Entry Point
 *
 * Replaces index.js as the Webpack / Vite client entry.
 *
 * Instead of  ReactDOM.createRoot().render()  (which wipes and re-renders the
 * DOM from scratch), this uses  ReactDOM.hydrateRoot()  which:
 *   1. Walks the server-generated DOM that was streamed by entry-server.jsx
 *   2. Diffs it against the React element tree in memory
 *   3. Attaches event handlers in place — no DOM nodes are destroyed or
 *      re-created during the initial load
 *
 * The Redux store is rehydrated from  window.__REDUX_STATE__  which the
 * server injects as an inline <script> via bootstrapScriptContent.
 *
 * CSS imports live here (not in entry-server.jsx) because Node has no
 * stylesheet parser — your bundler handles them at build time.
 */

import React                  from 'react';
import ReactDOM               from 'react-dom/client';
import { BrowserRouter }      from 'react-router-dom';
import { Provider }           from 'react-redux';

import { createStore }        from './features/store';   // factory (see entry-server note ①)
import App                    from './App';

// ── CSS imports ──────────────────────────────────────────────────────────────
// These must NOT be imported in entry-server.jsx.
import './assets/css/bootstrap.min.css';
import './assets/css/owl.carousel.min.css';
import './assets/css/icons.css';
import './assets/css/pace.min.css';
import './assets/css/app.css';
import './assets/css/index.css';
import './assets/css/efear.css';

// ─────────────────────────────────────────────────────────────────────────────
// 1.  Rehydrate Redux store
//     window.__REDUX_STATE__ is injected by entry-server.jsx via
//     bootstrapScriptContent.  If it's absent (e.g. during local development
//     without SSR), the store starts empty — the app still works.
// ─────────────────────────────────────────────────────────────────────────────
const preloadedState = window.__REDUX_STATE__ ?? {};

// Remove the bootstrap state from the global scope so it can't be tampered
// with after the store is created.
delete window.__REDUX_STATE__;

const store = createStore(preloadedState);

// ─────────────────────────────────────────────────────────────────────────────
// 2.  Hydration
//     The component tree passed to hydrateRoot MUST be byte-for-byte identical
//     to the one rendered by entry-server.jsx.  Any structural mismatch causes
//     a hydration warning and forces React to re-render the mismatched subtree
//     from scratch (defeating the purpose of SSR).
//
//     Checklist:
//       ✓  Same Provider wrappers in the same order
//       ✓  BrowserRouter here  ↔  StaticRouter in entry-server.jsx
//       ✓  Same <App /> component
//       ✓  No conditional rendering at the top level that differs server/client
// ─────────────────────────────────────────────────────────────────────────────
const container = document.getElementById('root');

ReactDOM.hydrateRoot(
  container,

  // ── Wrap in StrictMode for development-time double-render checks ─────────
  // StrictMode is safe with hydrateRoot — React handles it correctly in prod.
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3.  Development / CSR fallback
//
//     During local development you may run without an SSR server (plain CRA /
//     Vite dev server).  In that case the server sends a bare index.html with
//     an empty <div id="root">, so hydrateRoot receives no server markup and
//     React falls back to a full client render automatically.
//
//     You can also force a full CSR render during development by setting:
//       VITE_DISABLE_SSR=true   (or similar env flag in your bundler)
//     and switching hydrateRoot → createRoot conditionally:
//
//     import.meta.env.VITE_DISABLE_SSR
//       ? ReactDOM.createRoot(container).render(<tree />)
//       : ReactDOM.hydrateRoot(container, <tree />);
// ─────────────────────────────────────────────────────────────────────────────