/**
 * ssr-middleware.js — FEAR SSR Middleware
 *
 * Sits between FEAR's API routes and the SPA static fallback.
 * For every non-API, non-asset GET request it:
 *
 *   1. Reads the index.html template from disk (cached after first read)
 *   2. Calls entry-server.jsx render() to stream the React app
 *   3. Splices the Redux state and streamed HTML into the template
 *   4. Streams the complete response to the browser
 *
 * On any render failure it falls through to next() so the SPA static
 * handler in router.js serves the bare index.html as a CSR fallback —
 * the user still sees a working page, just without SSR.
 *
 * Integration (in server.js — add BEFORE attachSpaRouter):
 * ──────────────────────────────────────────────────────────
 *   const { attachSsrMiddleware } = require('./ssr-middleware');
 *
 *   const fear = await server.initialize(...);
 *   attachSsrMiddleware(fear, BUILD_DIR);   // ← add this line
 *   attachSpaRouter(fear, BUILD_DIR);
 *   await server.startServer();
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Template cache ────────────────────────────────────────────────────────────
// index.html is read from disk once and held in memory.  Set to null to
// disable caching (useful during development with hot-reload).
let templateCache = null;

/**
 * Read index.html from the build directory.
 * In production the file is cached; in development it's re-read every request
 * so edits to the template are reflected without a server restart.
 *
 * @param {string}  indexPath
 * @param {boolean} isDev
 * @returns {string}
 */
const SSR = {
    readTemplate(indexPath, isDev) {
        if (!isDev && templateCache) return templateCache;

        const template = fs.readFileSync(indexPath, 'utf-8');
        if (!isDev) templateCache = template;
        return template;
    },
    /**
 * Split index.html at the SSR injection point.
 *
 * The template must contain:
 *   <div id="root"><!--ssr-outlet--></div>
 *
 * Everything before the comment becomes the "head" chunk streamed first;
 * everything after becomes the "tail" chunk streamed once React finishes.
 *
 * @param {string} template
 * @returns {{ head: string, tail: string }}
 */
    splitTemplate(template) {
        const MARKER = '<!--ssr-outlet-->';
        const idx = template.indexOf(MARKER);

        if (idx === -1) {
            throw new Error(
                '[SSR] index.html is missing the <!--ssr-outlet--> marker.\n' +
                'Add it inside the root div:\n' +
                '  <div id="root"><!--ssr-outlet--></div>'
            );
        }

        return {
            head: template.slice(0, idx),
            tail: template.slice(idx + MARKER.length),
        };
    },
    /**
     * Attach the SSR middleware to the FEAR Express app.
     *
     * @param {object}  fear          FEAR instance (from server.initialize)
     * @param {string}  buildDir      Absolute path to the React build directory
     * @param {object}  [options]
     * @param {boolean} [options.streaming=true]  Stream HTML as it renders (React 18)
     */
    attach(fear, buildDir, options = {}) {
        const app = fear.getApp();
        const logger = fear.getLogger();
        const isDev = process.env.NODE_ENV !== 'production';
        const streaming = options.streaming !== false;
        const indexPath = path.join(buildDir, 'index.html');

        // ── Validate template exists ──────────────────────────────────────────────
        if (!fs.existsSync(indexPath)) {
            throw new Error(`[SSR] index.html not found at: ${indexPath}`);
        }

        // ── Dynamically import the ESM server bundle ──────────────────────────────
        // Vite / webpack compiles entry-server.jsx to:
        //   build/server/entry-server.js   (configurable via vite.config.js)
        // We import lazily so the module is loaded after the build exists.
        const serverEntryPath = path.join(buildDir, 'server', 'entry-server.mjs');

        let renderFn = null;

        async function getRenderer() {
            if (renderFn) return renderFn;
            // Dynamic import works for both CJS and ESM builds
            const mod = await import(serverEntryPath);
            renderFn = mod.render;
            return renderFn;
        }

        // ── SSR handler ───────────────────────────────────────────────────────────
        app.get('*', async (req, res, next) => {
            const { pathname } = new URL(req.url, `https://${req.headers.host}`);

            // Pass API routes and static assets to the next handler
            if (pathname.startsWith('/fear/api')) return next();
            if (/\.[a-z0-9]+$/i.test(pathname)) return next();

            logger.info(`[SSR] Rendering → pages/${pathname}`);

            try {
                // ── 1. Load renderer ─────────────────────────────────────────────────
                const render = await getRenderer();

                // ── 2. Load and split index.html template ────────────────────────────
                const template = this.readTemplate(indexPath, isDev);
                const { head, tail } = this.splitTemplate(template);

                // ── 3. SSR context object ────────────────────────────────────────────
                // Components can write to this during render:
                //   ssrContext.url         → redirect destination
                //   ssrContext.status      → override HTTP status (404, etc.)
                //   ssrContext.redirectStatus → 301 or 302 (default 302)
                const ssrContext = {};

                // ── 4. Call entry-server.jsx render() ────────────────────────────────
                const { pipe, abort, statusCode } = await render(
                    pathname,
                    ssrContext,
                    {} // preloaded Redux state — populate from your data-fetching layer
                );

                // ── 5. Handle redirects signalled by components ───────────────────────
                if (ssrContext.url) {
                    logger.info(`[SSR] Redirect ${pathname} → ${ssrContext.url}`);
                    return res.redirect(statusCode, ssrContext.url);
                }

                // ── 6. Set response headers ───────────────────────────────────────────
                res.statusCode = statusCode;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

                if (streaming) {
                    // ── 7a. Streaming response ──────────────────────────────────────────
                    // Write the HTML head immediately so the browser can start loading
                    // scripts and stylesheets while React renders the body.
                    res.write(head);

                    // Pipe the React stream into the response, then append the tail.
                    // The 'end' event fires after React finishes flushing all chunks.
                    pipe({
                        write(chunk) { res.write(chunk); },
                        end() {
                            res.write(tail);
                            res.end();
                        },
                        // Node Writable interface compatibility
                        on(event, handler) {
                            if (event === 'drain') return;
                            res.on(event, handler);
                        },
                        once(event, handler) { res.once(event, handler); },
                        emit(event, ...args) { res.emit(event, ...args); },
                    });

                } else {
                    // ── 7b. Buffered response (non-streaming) ───────────────────────────
                    // Collect the entire React output before writing.  Safer for older
                    // proxies / CDNs that don't support chunked transfer encoding.
                    const chunks = [];
                    pipe({
                        write(chunk) { chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); },
                        end() {
                            const body = Buffer.concat(chunks).toString('utf-8');
                            res.send(head + body + tail);
                        },
                        on() { },
                        once() { },
                        emit() { },
                    });
                }

            } catch (error) {
                logger.error('[SSR] Render failed — falling back to CSR:', error);

                // ── 8. CSR fallback ───────────────────────────────────────────────────
                // Pass to the static SPA handler in router.js which serves the bare
                // index.html.  The client bundle hydrates as a full CSR render.
                next();
            }
        });

        logger.info('═══════════════════════════════════════');
        logger.info('[SSR] Middleware attached');
        logger.info(`[SSR] Template  : ${indexPath}`);
        logger.info(`[SSR] Server entry: ${serverEntryPath}`);
        logger.info(`[SSR] Streaming : ${streaming}`);
        logger.info('═══════════════════════════════════════');
    },
}



module.exports = SSR;