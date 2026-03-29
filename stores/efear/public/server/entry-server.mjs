/**
 * entry-server.jsx — Server-Side Rendering Entry Point
 *
 * Invoked by the FEAR/Express SSR middleware on every request.
 * Uses React 18's renderToPipeableStream for streaming HTML so the
 * browser can start parsing and loading assets before the full page
 * is done rendering.
 *
 * What this file is responsible for:
 *   • Wrapping the app in the same Provider tree as the client entry
 *   • Accepting a pre-populated Redux store so server-fetched data is
 *     embedded in the initial HTML (no client waterfall for first data)
 *   • Accepting the request URL so StaticRouter can match routes
 *   • Resolving with { pipe, abort } so the Express handler controls
 *     the response stream
 *
 * What this file is NOT responsible for:
 *   • CSS imports  — Vite/webpack handles those at build time; importing
 *     them here crashes Node because it has no stylesheet parser
 *   • document / window globals — this runs in Node, not in a browser
 */

import React                        from 'react';
import { renderToPipeableStream }   from 'react-dom/server';
import { StaticRouter }             from 'react-router-dom/server';
import { Provider }                 from 'react-redux';

import { createStore }              from './features/store';   // factory — see note ①
import App                          from './App';

// ─────────────────────────────────────────────────────────────────────────────
// ① Store factory
//
//   The server handles many concurrent requests, each needing its own Redux
//   store (shared state = data leaking between users).  Replace your current
//   singleton export:
//
//     // features/store.js — ADD this alongside your existing `store` export
//     export const createStore = (preloadedState = {}) =>
//       configureStore({ reducer: rootReducer, preloadedState });
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the React app to a Node.js Readable stream.
 *
 * @param {string}  url            - Request URL (e.g. '/product/42')
 * @param {object}  [ssrContext]   - Shared object that lets components signal
 *                                   redirect / 404 back to the Express handler
 * @param {object}  [preloadedState] - Redux state already fetched on the server
 *
 * @returns {Promise<{
 *   pipe:        function,   pipe(res) to stream HTML into the Express response
 *   abort:       function,   call on timeout to flush the shell immediately
 *   store:       object,     Redux store so the handler can serialize state
 *   statusCode:  number      200 | 301 | 302 | 404 derived from ssrContext
 * }>}
 */
export function render(url, ssrContext = {}, preloadedState = {}) {
  // Each request gets an isolated Redux store pre-loaded with any data that
  // was fetched during the server-side data-fetching phase.
  const store = createStore(preloadedState);

  return new Promise((resolve, reject) => {
    let didError     = false;
    let shellReady   = false;

    // ── Determine HTTP status from ssrContext ────────────────────────────
    // Components can write to ssrContext during render:
    //   ssrContext.url       → redirect target
    //   ssrContext.status    → override status code (e.g. 404)
    const getStatus = () => {
      if (ssrContext.url)                   return ssrContext.redirectStatus || 302;
      if (ssrContext.status)                return ssrContext.status;
      if (didError && !shellReady)          return 500;
      return 200;
    };

    const { pipe, abort } = renderToPipeableStream(

      // ── App tree (must be identical in shape to entry-client.jsx) ──────
      <Provider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Provider>,

      {
        // ── onShellReady ────────────────────────────────────────────────
        // Fires when the outermost <Suspense> boundary resolves — the shell
        // is safe to stream.  Resolve the promise here so the Express handler
        // can write response headers before any bytes are sent.
        onShellReady() {
          shellReady = true;
          resolve({
            pipe,
            abort,
            store,
            statusCode: getStatus(),
          });
        },

        // ── onShellError ────────────────────────────────────────────────
        // The shell itself failed (e.g. a synchronous throw in a top-level
        // component).  Reject so the Express handler can fall back to a
        // non-SSR response.
        onShellError(error) {
          reject(error);
        },

        // ── onError ─────────────────────────────────────────────────────
        // Called for errors inside Suspense boundaries (after the shell).
        // We record the error but don't abort — React streams an error
        // boundary fallback in its place.
        onError(error) {
          didError = true;
          console.error('[SSR] Render error:', error);
        },

        // ── onAllReady ──────────────────────────────────────────────────
        // Alternative to onShellReady for crawlers / static generation.
        // Uncomment and swap with onShellReady if you want to wait for ALL
        // Suspense boundaries before streaming (better for SEO bots that
        // don't support streaming, at the cost of TTFB).
        //
        // onAllReady() {
        //   resolve({ pipe, abort, store, statusCode: getStatus() });
        // },

        // Progressive enhancement identifier injected into the HTML stream.
        // React uses this on the client to match server nodes during hydration.
        bootstrapScriptContent: `window.__REDUX_STATE__ = ${
          JSON.stringify(store.getState()).replace(/</g, '\\u003c')
        };`,
      }
    );

    // Abort streaming after a timeout so slow renders don't hang the server.
    // The client entry will hydrate whatever partial HTML was sent.
    const STREAM_TIMEOUT_MS = 10_000;
    setTimeout(() => {
      console.warn(`[SSR] Render timed out for ${url} — flushing shell`);
      abort();
    }, STREAM_TIMEOUT_MS);
  });
}