/**
 * polyfills.js — MUST be the first import in index.js
 *
 * Rules for this file
 * ──────────────────────────────────────────────────────────────────────────────
 * • Use `var` and `function` declarations — no arrow functions in hot paths
 * • NEVER call Object.defineProperty on a global object
 *   → Hermes raises a *native* (non-JS) exception "Global was not installed"
 *     when JS tries to define properties on its internal global before the
 *     engine has finished its own setup.
 * • Wrap every mutation in its own try/catch so one failure can't cascade
 * • Keep the file completely flat — no Array.forEach, no helper closures
 *
 * What we're fixing
 * ──────────────────────────────────────────────────────────────────────────────
 * @feardread/feature-factory bundles Axios 1.x.  At module-evaluation time
 * Axios does three things that crash in Hermes:
 *
 *  1. It = globalThis ?? ... → typeof It.postMessage === 'function' is TRUE
 *     (Hermes has postMessage for React DevTools) so Axios tries
 *     It.addEventListener("message", …)  ← "addEventListener is not a function"
 *     Fix: stub addEventListener; null out postMessage so Axios uses setTimeout.
 *
 *  2. const dr = typeof window !== 'undefined' && typeof document !== 'undefined'
 *     const hr = dr && window.location.href || "http://localhost"
 *     If document is defined, dr=true and window.location.href crashes.
 *     Fix: provide a window.location stub via direct assignment (try/catch).
 *
 *  3. The package footer: window.addEventListener("auth:failure", …)
 *     Same as (1) — already fixed by the addEventListener stub.
 *
 * RTK Query: its focused-state slice is already guarded with
 *   typeof document === 'undefined' || …
 * so it falls back to focused=true when document is absent.
 * Do NOT polyfill document — it would flip Axios's `dr` flag.
 */

/* jshint esversion: 5 */
'use strict';

var __noop      = function() {};
var __noopFalse = function() { return false; };

// ─── 1. globalThis ────────────────────────────────────────────────────────────
try {
  if (typeof globalThis !== 'undefined') {
    if (typeof globalThis.addEventListener !== 'function') {
      globalThis.addEventListener    = __noop;
      globalThis.removeEventListener = __noop;
      globalThis.dispatchEvent       = __noopFalse;
    }
    // Null postMessage so Axios picks setTimeout, not the broken MessageChannel path
    if (typeof globalThis.postMessage === 'function' &&
        globalThis.addEventListener === __noop) {
      globalThis.postMessage = __noop;
    }
  }
} catch (_) {}

// ─── 2. global ────────────────────────────────────────────────────────────────
try {
  if (typeof global !== 'undefined') {
    if (typeof global.addEventListener !== 'function') {
      global.addEventListener    = __noop;
      global.removeEventListener = __noop;
      global.dispatchEvent       = __noopFalse;
    }
    if (typeof global.postMessage === 'function' &&
        global.addEventListener === __noop) {
      global.postMessage = __noop;
    }
  }
} catch (_) {}

// ─── 3. window ────────────────────────────────────────────────────────────────
try {
  if (typeof window !== 'undefined') {
    if (typeof window.addEventListener !== 'function') {
      window.addEventListener    = __noop;
      window.removeEventListener = __noop;
      window.dispatchEvent       = __noopFalse;
    }
    if (typeof window.postMessage === 'function' &&
        window.addEventListener === __noop) {
      window.postMessage = __noop;
    }
  }
} catch (_) {}

// ─── 4. window.location stub (direct assignment only — no Object.defineProperty)
// Axios reads window.location.href for its origin value.
// Direct assignment with try/catch is the only safe approach in Hermes;
// Object.defineProperty on the global raises a native "Global was not installed"
// exception before the engine has finished its own setup.
try {
  if (typeof window !== 'undefined') {
    var __hasHref = false;
    try { __hasHref = !!(window.location && typeof window.location.href === 'string'); } catch (_) {}

    if (!__hasHref) {
      try {
        window.location = {
          href:     'http://localhost',
          origin:   'http://localhost',
          protocol: 'http:',
          host:     'localhost',
          hostname: 'localhost',
          port:     '',
          pathname: '/',
          search:   '',
          hash:     '',
          assign:   __noop,
          replace:  __noop,
          reload:   __noop,
        };
      } catch (_) {
        // Assignment blocked (e.g. non-writable property).
        // Axios will fall back to "http://localhost" via its own || guard
        // as long as window.location.href throws or returns undefined.
        // Nothing more we can do here without Object.defineProperty.
      }
    }
  }
} catch (_) {}