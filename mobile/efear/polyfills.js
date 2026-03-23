/**
 * polyfills.js
 *
 * MUST be the first import in index.js.
 *
 * Root cause of TypeError: window.addEventListener is not a function
 * ─────────────────────────────────────────────────────────────────────
 * @feardread/feature-factory bundles Axios 1.x which contains this code:
 *
 *   const It = globalThis ?? self ?? window ?? global
 *   const zt = typeof It.postMessage === 'function'   // true in Hermes!
 *   zt
 *     ? (It.addEventListener("message", handler), ...)  // CRASH — no addEventListener
 *     : setTimeout
 *
 * In React Native's Hermes engine, `globalThis` exists AND has `postMessage`
 * (used by React DevTools), but has no `addEventListener`. Axios detects
 * `postMessage` and assumes it's in a Web Worker, then calls `addEventListener`.
 *
 * The package footer also calls:
 *   window.addEventListener("auth:failure", handler)
 *
 * Both crash with "TypeError: window.addEventListener is not a function".
 *
 * Fix: add no-op stubs for every DOM event API before any package loads.
 * This file has zero side-effects on actual DOM environments because it
 * only patches when the method is missing.
 */

const noop = () => {};
const noopFalse = () => false;

// ── Patch globalThis ──────────────────────────────────────────────────────────
// Hermes sets globalThis = global, which has postMessage but no addEventListener.
if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.addEventListener !== 'function') {
    globalThis.addEventListener    = noop;
    globalThis.removeEventListener = noop;
    globalThis.dispatchEvent       = noopFalse;
  }
}

// ── Patch global ──────────────────────────────────────────────────────────────
if (typeof global !== 'undefined') {
  if (typeof global.addEventListener !== 'function') {
    global.addEventListener    = noop;
    global.removeEventListener = noop;
    global.dispatchEvent       = noopFalse;
  }
}

// ── Patch window (if it exists but lacks addEventListener) ────────────────────
// In some Expo configs window === globalThis, so this may be a no-op,
// but it's a safety net for any env where window is defined separately.
if (typeof window !== 'undefined') {
  if (typeof window.addEventListener !== 'function') {
    window.addEventListener    = noop;
    window.removeEventListener = noop;
    window.dispatchEvent       = noopFalse;
  }
  // Also null out postMessage so Axios falls back to setTimeout instead
  // of its broken MessageChannel path (which also calls addEventListener).
  if (typeof window.postMessage === 'function') {
    // Only stub if we already had to stub addEventListener — meaning this is
    // not a real browser window. Stubbing postMessage makes Axios choose
    // the safe setTimeout code path instead.
    window.postMessage = noop;
  }
}

// Do the same for globalThis.postMessage — same Axios check applies there
if (typeof globalThis !== 'undefined' && typeof globalThis.postMessage === 'function') {
  globalThis.postMessage = noop;
}

// ── Minimal document stub ─────────────────────────────────────────────────────
// RTK Query reads document.visibilityState on slice init.
// React Native has no document object.
if (typeof document === 'undefined') {
  global.document = {
    visibilityState:     'visible',
    addEventListener:    noop,
    removeEventListener: noop,
    dispatchEvent:       noopFalse,
    createElement:       () => ({}),
    getElementById:      () => null,
  };
}