const fs = require('fs');
const path = require('path');

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
 */
const FearSSR = (function () {

    function FearSSR(fear) {
        this.app = fear.getApp();
        this.logger = fear.getLogger();
        this.cache = null;
        this.isDev = process.env.NODE_ENV !== 'production';
    }

    FearSSR.prototype = {

        read(indexPath) {
            if (!this.isDev && this.cache) return this.cache; 

            const template = fs.readFileSync(indexPath, 'utf-8');
            if (!this.isDev) this.cache = template;
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
        split(template) {
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
         * @param {string}  buildDir      Absolute path to the React build directory
         * @param {object}  [options]
         * @param {boolean} [options.streaming=true]  Stream HTML as it renders (React 18)
         */
        attach(buildDir, options = {}) {
            let renderFn = null;

            const self = this;
            const streaming = options.streaming !== false;
            const indexPath = path.join(buildDir, 'index.html');
            const serverEntryPath = path.join(buildDir, 'server', 'entry-server.mjs');
            const getRenderer = () => {
                if (renderFn) return Promise.resolve(renderFn);
                return import(serverEntryPath).then(function (mod) {
                    renderFn = mod.render;
                    return renderFn;
                });
            }

            if (!fs.existsSync(indexPath)) throw new Error(`[SSR] index.html not found at: ${indexPath}`);

            this.app.get('*', function (req, res, next) {
                const { pathname } = new URL(req.url, `https://${req.headers.host}`);

                // Pass API routes and static assets to the next handler
                if (pathname.startsWith('/fear/api')) return next();
                if (/\.[a-z0-9]+$/i.test(pathname)) return next();

                self.logger.info(`[SSR] Rendering → pages/${pathname}`);

                getRenderer()
                    .then(function (render) {

                        const template = self.read(indexPath);
                        const { head, tail } = self.split(template);

                        const ssrContext = {};

                        return render(
                            pathname,
                            ssrContext,
                            {} // preloaded Redux state — populate from your data-fetching layer
                        ).then(function (result) {
                            const pipe       = result.pipe;
                            const statusCode = result.statusCode;

                            // ── 4. Handle redirects signalled by components ───────────────
                            if (ssrContext.url) {
                                // Bug fix: was `res.redirect(statusCode, ...)` which used the
                                // render's status code; redirects should use ssrContext.redirectStatus
                                const redirectStatus = ssrContext.redirectStatus || 302;
                                self.logger.info(`[SSR] Redirect ${pathname} → ${ssrContext.url}`); // Bug fix: was bare `logger`
                                return res.redirect(redirectStatus, ssrContext.url);
                            }

                            // ── 5. Set response headers ───────────────────────────────────
                            res.statusCode = statusCode;
                            res.setHeader('Content-Type', 'text/html; charset=utf-8');
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

                            if (streaming) {
                                // ── 6a. Streaming response ────────────────────────────────
                                // Write the HTML head immediately so the browser can start
                                // loading scripts and stylesheets while React renders the body.
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
                                // ── 6b. Buffered response (non-streaming) ─────────────────
                                // Collect the entire React output before writing. Safer for
                                // older proxies / CDNs that don't support chunked encoding.
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
                        });
                    })
                    .catch(function (error) {
                        self.logger.error('[SSR] Render failed — falling back to CSR:', error);
                        next();
                    });
            });

            this.logger.info('═══════════════════════════════════════'); 
            this.logger.info('[SSR] Middleware attached');
            this.logger.info(`[SSR] Template  : ${indexPath}`);
            this.logger.info(`[SSR] Server entry: ${serverEntryPath}`);
            this.logger.info(`[SSR] Streaming : ${streaming}`);
            this.logger.info('═══════════════════════════════════════');
        },
    };

    return FearSSR;

})();

module.exports = FearSSR;