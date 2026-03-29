/**
 * router.js — FEAR-native React SPA Router
 *
 * Integrates directly with FEAR.js and FEARServer.js to provide:
 *   • Static asset serving with correct per-file-type cache headers
 *   • Security headers on every response
 *   • Health-check endpoint  (GET /health)
 *   • Route-aware request logging against the full App.js route manifest
 *   • SPA fallback — serves index.html for any non-API, non-asset path
 *
 * ─── Why we skip FearServer's setupStaticFiles ───────────────────────────────
 * FearServer.setupStaticFiles() registers a wildcard  app.use('/*', handler)
 * that sends index.html for every unmatched path.  Express processes middleware
 * in registration order, so anything we register AFTER that wildcard is
 * unreachable (health check, security headers, etc.).
 *
 * The fix: pass  { multipleApps: true, apps: [] }  as reactConfig to
 * server.initialize().  FearServer then calls setupMultipleReactApps([]) which
 * iterates over an empty array — a clean no-op — leaving the Express stack
 * empty so this router owns static serving entirely.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Usage in server.js
 * ──────────────────
 *   const { attachSpaRouter } = require('./router');
 *
 *   const fear = await server.initialize(
 *     { root: path.resolve() },
 *     ADD_PAYMENTS,
 *     { multipleApps: true, apps: [] }   // <── skips setupStaticFiles
 *   );
 *
 *   attachSpaRouter(fear, BUILD_DIR);
 *   await server.startServer();
 */

'use strict';

const path    = require('path');
const fs      = require('fs');
const express = require('express');

// ─────────────────────────────────────────────────────────────────────────────
// Client-side route manifest  (mirrored from App.js — keep in sync)
// ─────────────────────────────────────────────────────────────────────────────
const CLIENT_ROUTES = {
  public: [
    '/',
    '/about',
    '/contact',
    '/blog',
    '/blog/:id',
    '/shop',
    '/faq',
    '/cart',
    '/shop-categories',
    '/product/:id',
    '/product-comparison',
    '/wishlist',
  ],
  policy: [
    '/terms',
    '/privacy',
    '/returns',
  ],
  auth: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
  ],
  protected: [
    '/account/dashboard',
    '/account/orders',
    '/account/details',
    '/account/payment-methods',
    '/account/addresses',
    '/checkout',
    '/checkout/review',
    '/checkout/shipping',
    '/checkout/payment',
    '/checkout/details',
    '/checkout/complete',
  ],
  landing: ['/landing'],
  misc:    ['/unauthorized'],
};

const ALL_CLIENT_ROUTES = Object.values(CLIENT_ROUTES).flat();

// Pre-compile every pattern to a RegExp once at module load time.
// :param segments become [^\\/]+ (any non-slash characters).
const COMPILED_ROUTES = ALL_CLIENT_ROUTES.map(pattern => {
  const src = pattern
    .replace(/\//g,     '\\/')
    .replace(/:[^/]+/g, '[^\\/]+');
  return { pattern, regex: new RegExp(`^${src}\\/?$`) };
});

/**
 * Test whether a URL pathname matches any registered client-side route.
 *
 * @param   {string}  pathname
 * @returns {{ matched: boolean, pattern: string|null }}
 */
function matchClientRoute(pathname) {
  for (const { pattern, regex } of COMPILED_ROUTES) {
    if (regex.test(pathname)) return { matched: true, pattern };
  }
  return { matched: false, pattern: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware factories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Security headers — applied to every response regardless of content type.
 */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options',        'SAMEORIGIN');
  res.setHeader('X-XSS-Protection',       '1; mode=block');
  res.setHeader('Referrer-Policy',        'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy',     'camera=(), microphone=(), geolocation=()');
  next();
}

/**
 * Express.static wrapper for the React build directory.
 *
 * Fingerprinted assets (.js, .css, fonts, images) receive a 1-year immutable
 * cache.  index.html is intentionally excluded — it's served by the SPA
 * fallback handler below with no-cache headers so users always get the latest
 * bundle references.
 *
 * @param {string} buildDir - Absolute path to the React build folder.
 */
function buildStaticMiddleware(buildDir) {
  return express.static(buildDir, {
    index:       false,  // never auto-serve index.html from static middleware
    fallthrough: true,   // let unknown paths continue to the next handler
    etag:        true,
    lastModified: true,
    setHeaders(res, filePath) {
      // Long-lived cache for any fingerprinted asset
      if (/\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|ico|webp|map)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  });
}

/**
 * SPA fallback handler factory.
 *
 * Serves index.html for every request that is:
 *   • Not a static asset  (no file extension in the pathname)
 *   • Not a FEAR API call (/fear/api/…)
 *
 * React Router then renders the correct page client-side, including its own
 * 404 component for paths that don't match any <Route>.
 *
 * @param {string}   indexHtml  Absolute path to build/index.html.
 * @param {object}   logger     FEAR logger instance.
 * @param {boolean}  verbose    Log every request with its route classification.
 */
function buildSpaFallback(indexHtml, logger, verbose) {
  return function spaFallback(req, res, next) {
    const { pathname } = new URL(
      req.url,
      `https://${req.headers.host || 'localhost'}`
    );

    // Assets with extensions that weren't found by express.static → true 404
    if (/\.[a-z0-9]+$/i.test(pathname)) return next();

    // FEAR API routes are handled by the FEAR router stack — never touch them
    if (pathname.startsWith('/fear/api')) return next();

    // The HTML shell must never be cached; React bundles are versioned in JS/CSS
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma',        'no-cache');
    res.setHeader('Expires',       '0');

    if (verbose) {
      const { matched, pattern } = matchClientRoute(pathname);
      const label = matched
        ? `✅  known route  →  ${pattern}`
        : `🔀  SPA fallback  →  React Router handles`;
      logger.info(`[SPA Router]  ${req.method}  ${pathname}  ${label}`);
    }

    res.sendFile(indexHtml, err => {
      if (err) {
        logger.error('[SPA Router] Failed to serve index.html:', err.message);
        if (!res.headersSent) res.status(500).send('Internal Server Error');
      }
    });
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attach the full SPA router to a FEAR instance.
 *
 * Middleware registration order on fear.getApp()
 * ──────────────────────────────────────────────
 *   1. Security headers     applied globally before any response is sent
 *   2. GET /health          lightweight liveness check (never cached)
 *   3. express.static       fingerprinted assets from build/
 *   4. GET *  (SPA)         index.html for all non-asset, non-FEAR-API paths
 *   5. Final 404            static assets not found in the build directory
 *
 * @param {object}  fear              FEAR instance (returned by server.initialize)
 * @param {string}  buildDir          Absolute path to the React build directory
 * @param {object}  [options]
 * @param {boolean} [options.verbose] Log every routed request (default: true outside production)
 */
function attachSpaRouter(fear, buildDir, options = {}) {
  const app    = fear.getApp();
  const logger = fear.getLogger();
  const verbose = options.verbose ?? (process.env.NODE_ENV !== 'production');

  // ── Guard: validate build artefacts exist before registering anything ───
  const indexHtml = path.join(buildDir, 'index.html');

  if (!fs.existsSync(buildDir)) {
    throw new Error(
      `[SPA Router] Build directory not found: ${buildDir}\n` +
      'Run "npm run build" before starting the server.'
    );
  }
  if (!fs.existsSync(indexHtml)) {
    throw new Error(
      `[SPA Router] index.html not found in: ${buildDir}`
    );
  }

  // ── 1. Security headers ─────────────────────────────────────────────────
  app.use(securityHeaders);

  // ── 2. Health check ─────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status:    'ok',
      timestamp: new Date().toISOString(),
      env:       process.env.NODE_ENV || 'development',
      routes: {
        total:  ALL_CLIENT_ROUTES.length,
        groups: Object.fromEntries(
          Object.entries(CLIENT_ROUTES).map(([k, v]) => [k, v.length])
        ),
      },
    });
  });

  // ── 3. Static assets ────────────────────────────────────────────────────
  app.use(buildStaticMiddleware(buildDir));

  // ── 4. SPA fallback ─────────────────────────────────────────────────────
  app.get('*', buildSpaFallback(indexHtml, logger, verbose));

  // ── 5. Final 404 for missing static assets ──────────────────────────────
  app.use((_req, res) => res.status(404).send('Not Found'));

  // ── Log summary ─────────────────────────────────────────────────────────
  logger.info('═══════════════════════════════════════');
  logger.info('[SPA Router] Attached to FEAR instance');
  logger.info(`[SPA Router] Build dir   : ${buildDir}`);
  logger.info(`[SPA Router] Client routes registered : ${ALL_CLIENT_ROUTES.length}`);
  Object.entries(CLIENT_ROUTES).forEach(([group, routes]) => {
    logger.info(`             ├─ ${group.padEnd(10)} ${routes.length} route(s)`);
  });
  logger.info(`[SPA Router] Verbose logging : ${verbose}`);
  logger.info('═══════════════════════════════════════');
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  attach: attachSpaRouter,
  CLIENT_ROUTES,
  ALL_CLIENT_ROUTES,
  matchClientRoute,
};