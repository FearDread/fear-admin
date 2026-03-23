/**
 * polyfills.js
 *
 * MUST be the very first import in index.js.
 *
 * Crash chain this file prevents
 * ────────────────────────────────
 * @feardread/feature-factory bundles Axios 1.x which probes the JS environment
 * at module-evaluation time and calls DOM APIs absent in Hermes.
 *
 * CRASH 1 — window.addEventListener (fixed last session)
 *   Axios: const zt = typeof globalThis.postMessage === 'function'  // TRUE in Hermes
 *          zt ? globalThis.addEventListener("message", ...) : setTimeout
 *   Hermes has postMessage (React DevTools) but no addEventListener → crash.
 *   Fix: stub addEventListener before Axios loads.
 *
 * CRASH 2 — window.location.href (this session)
 *   Axios: const dr = typeof window !== 'undefined' && typeof document !== 'undefined'
 *          const hr = dr && window.location.href || "http://localhost"
 *   In React Native without any document polyfill, dr is false → safe fallback.
 *   If document ever gets polyfilled by any package, dr becomes true and
 *   window.location.href crashes because window.location is undefined.
 *   Fix: stub window.location so hr resolves safely regardless of dr.
 *
 * RTK Query note: its focused-state init is guarded:
 *   focused: typeof document === 'undefined' || document.visibilityState !== 'hidden'
 *   → defaults to true when document is absent. No document polyfill needed.
 */

const noop      = () => {};
const noopFalse = () => false;

// 1. Stub addEventListener / removeEventListener / dispatchEvent
[
  typeof globalThis !== 'undefined' ? globalThis : null,
  typeof global     !== 'undefined' ? global     : null,
  typeof window     !== 'undefined' ? window     : null,
].forEach(obj => {
  if (obj && typeof obj.addEventListener !== 'function') {
    obj.addEventListener    = noop;
    obj.removeEventListener = noop;
    obj.dispatchEvent       = noopFalse;
  }
});

// 2. Null postMessage so Axios falls back to setTimeout instead of MessageChannel
//    Only when addEventListener was also missing (i.e. not a real browser).
[
  typeof globalThis !== 'undefined' ? globalThis : null,
  typeof window     !== 'undefined' ? window     : null,
].forEach(obj => {
  if (obj
      && typeof obj.postMessage === 'function'
      && obj.addEventListener === noop) {
    obj.postMessage = noop;
  }
});

// 3. window.location stub
//    Axios reads window.location.href when both window and document are defined.
//    Providing a stub makes this safe even if document gets polyfilled elsewhere.
const LOCATION_STUB = {
  href:     'http://localhost',
  origin:   'http://localhost',
  protocol: 'http:',
  host:     'localhost',
  hostname: 'localhost',
  port:     '',
  pathname: '/',
  search:   '',
  hash:     '',
};

if (typeof window     !== 'undefined' && !window.location)     window.location     = LOCATION_STUB;
if (typeof globalThis !== 'undefined' && !globalThis.location) globalThis.location = LOCATION_STUB;

// 4. DO NOT polyfill `document`
//    Adding document makes Axios think it's in a browser (dr = true) which
//    triggers the window.location crash in environments where location is absent.
//    RTK Query already handles the absent-document case gracefully.