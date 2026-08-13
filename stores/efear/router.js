'use strict';

const path    = require('path');
const fs      = require('fs');
const express = require('express');

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

const COMPILED_ROUTES = ALL_CLIENT_ROUTES.map(pattern => {
  const src = pattern
    .replace(/\//g,     '\\/')
    .replace(/:[^/]+/g, '[^\\/]+');
  return { pattern, regex: new RegExp(`^${src}\\/?$`) };
});

function matchClientRoute(pathname) {
  for (const { pattern, regex } of COMPILED_ROUTES) {
    if (regex.test(pathname)) return { matched: true, pattern };
  }
  return { matched: false, pattern: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared middleware
// ─────────────────────────────────────────────────────────────────────────────

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options',        'SAMEORIGIN');
  res.setHeader('X-XSS-Protection',       '1; mode=block');
  res.setHeader('Referrer-Policy',        'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy',     'camera=(), microphone=(), geolocation=()');
  next();
}

function buildStaticMiddleware(buildDir) {
  return express.static(buildDir, {
    index:       false,
    fallthrough: true,
    etag:        true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (/\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|ico|webp|map)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  });
}

function buildSpaFallback(indexHtml, logger, verbose) {
  return function spaFallback(req, res, next) {
    const { pathname } = new URL(
      req.url,
      `https://${req.headers.host || 'localhost'}`
    );

    if (/\.[a-z0-9]+$/i.test(pathname)) return next();
    if (pathname.startsWith('/fear/api')) return next();

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
// Mode: 'spa'  (original CRA behavior — unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function attachSpaRouter(fear, buildDir, options = {}) {
  const app     = fear.getApp();
  const logger  = fear.getLogger();
  const verbose = options.verbose ?? (process.env.NODE_ENV !== 'production');

  const indexHtml = path.join(buildDir, 'index.html');

  if (!fs.existsSync(buildDir)) {
    throw new Error(
      `[SPA Router] Build directory not found: ${buildDir}\n` +
      'Run "npm run build" before starting the server.'
    );
  }
  if (!fs.existsSync(indexHtml)) {
    throw new Error(`[SPA Router] index.html not found in: ${buildDir}`);
  }

  app.use(securityHeaders);

  app.get('/health', (_req, res) => {
    res.json({
      status:    'ok',
      mode:      'spa',
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

  app.use(buildStaticMiddleware(buildDir));
  app.get('*', buildSpaFallback(indexHtml, logger, verbose));
  app.use((_req, res) => res.status(404).send('Not Found'));

  logger.info('═══════════════════════════════════════');
  logger.info('[SPA Router] Attached to FEAR instance (mode: spa)');
  logger.info(`[SPA Router] Build dir   : ${buildDir}`);
  logger.info(`[SPA Router] Client routes registered : ${ALL_CLIENT_ROUTES.length}`);
  Object.entries(CLIENT_ROUTES).forEach(([group, routes]) => {
    logger.info(`             ├─ ${group.padEnd(10)} ${routes.length} route(s)`);
  });
  logger.info(`[SPA Router] Verbose logging : ${verbose}`);
  logger.info('═══════════════════════════════════════');
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode: 'next'  — Express is API-only; Next.js owns frontend rendering
// ─────────────────────────────────────────────────────────────────────────────

function attachApiRouter(fear, options = {}) {
  const app     = fear.getApp();
  const logger  = fear.getLogger();
  const verbose = options.verbose ?? (process.env.NODE_ENV !== 'production');
  const nextOrigin = options.nextOrigin
    || process.env.NEXT_PUBLIC_ORIGIN
    || 'http://localhost:3000';

  app.use(securityHeaders);

  // Next's rewrite proxy makes requests same-origin from the browser's
  // perspective in production, so this is only needed for local dev when
  // hitting :4000 directly (curl, Postman, or Next dev before rewrites
  // are wired up).
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', nextOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  app.get('/health', (_req, res) => {
    res.json({
      status:    'ok',
      mode:      'next',
      timestamp: new Date().toISOString(),
      env:       process.env.NODE_ENV || 'development',
      frontend: {
        framework: 'next',
        origin:    nextOrigin,
        note:      'Rendering is owned by the Next.js app, not this server.',
      },
    });
  });

  // No static assets, no SPA fallback — anything that isn't /fear/api/*
  // (mounted upstream by FEAR.setupRoutes) or /health has no business
  // hitting this server directly.
  app.use((req, res) => {
    if (verbose) {
      const { matched, pattern } = matchClientRoute(req.path);
      const label = matched
        ? `would have been a client route (${pattern}) — now owned by Next.js`
        : 'unrecognized path';
      logger.info(`[API Router]  ${req.method}  ${req.path}  → 404 (${label})`);
    }
    res.status(404).json({
      error: 'Not Found',
      message: 'This server only exposes /fear/api/* and /health. Frontend routes are served by the Next.js app.',
    });
  });

  logger.info('═══════════════════════════════════════');
  logger.info('[API Router] Attached to FEAR instance (mode: next)');
  logger.info(`[API Router] Expected Next.js origin : ${nextOrigin}`);
  logger.info('[API Router] Frontend rendering is NOT handled here — see next.config.js rewrites');
  logger.info('═══════════════════════════════════════');
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary export — dual-mode attach
// ─────────────────────────────────────────────────────────────────────────────

function attach(fear, buildDirOrOptions, maybeOptions = {}) {
  // Keeps the original attach(fear, buildDir, options) call signature working
  // unmodified for existing SPA call sites, while also accepting the newer
  // attach(fear, options) signature for 'next' mode.
  let buildDir;
  let options;

  if (typeof buildDirOrOptions === 'string') {
    buildDir = buildDirOrOptions;
    options  = maybeOptions;
  } else {
    options  = buildDirOrOptions || {};
    buildDir = options.buildDir;
  }

  const mode = options.mode || process.env.FRONTEND_MODE || 'spa';

  if (mode === 'next') {
    return attachApiRouter(fear, options);
  }

  if (!buildDir) {
    throw new Error(
      "[Router] mode 'spa' requires a buildDir — pass it as the 2nd argument " +
      'or as options.buildDir.'
    );
  }

  return attachSpaRouter(fear, buildDir, options);
}

module.exports = {
  attach,
  attachSpaRouter,
  attachApiRouter,
  CLIENT_ROUTES,
  ALL_CLIENT_ROUTES,
  matchClientRoute,
};