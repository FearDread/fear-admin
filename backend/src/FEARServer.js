#!/usr/bin/env node

/**
 * FEARServer :: process bootstrap for the FEAR app.
 *
 * TLS termination, HTTP→HTTPS redirect, and the public listening port are
 * nginx's job, not this file's. This process binds one plain HTTP server on
 * a loopback port (127.0.0.1:PORT by default) and nginx reverse-proxies to
 * it — see VCHAT_INTEGRATION.md §3 for the vhost config that does that,
 * including the `upgrade`/`Connection` headers the WebSocket needs.
 *
 */

const path = require('path');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');

const FearServer = (function () {
    // Private constants
    const DEFAULT_PATHS = {
        root: path.resolve(),
        app: 'backend/admin/build',
        build: 'backend/admin/build'
    };

    const DEFAULT_PORT = 4000;
    const DEFAULT_HOST = '127.0.0.1'; // loopback only — nginx is the public listener
    const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

    // Constructor
    function FearServer() {
        this.fear = null;
        this.server = null;
        this.Router = null;
        this.isShuttingDown = false;
        this.rootDir = path.resolve();
        this.reactApps = []; // Track multiple React apps
        this.envLoaded = false;
        this._handlersSetup = false;
        this._spaFallbacks = []; // mounted in startServer(), after anything attached post-initialize()
    }

    FearServer.prototype = {
        constructor: FearServer,

        /**
         * Load environment variables from .env file
         * @param {string|Object} envConfig - Path to .env file or dotenv config object
         */
        loadEnv(envConfig) {
            let envPath;
            let options = {};

            // Handle different config formats
            if (typeof envConfig === 'string') {
                envPath = envConfig;
            } else if (typeof envConfig === 'object') {
                envPath = envConfig.path;
                options = envConfig;
            }

            // Auto-detect .env file if not specified
            if (!envPath) {
                const possiblePaths = [
                    path.join(this.rootDir, '.env'),
                    path.join(this.rootDir, '.env.local'),
                    path.join(this.rootDir, '.env.development'),
                    path.join(this.rootDir, '.env.production'),
                    path.join(process.cwd(), '.env'),
                ];

                // Check NODE_ENV for environment-specific files
                if (process.env.NODE_ENV) {
                    possiblePaths.unshift(
                        path.join(this.rootDir, `.env.${process.env.NODE_ENV}`),
                        path.join(this.rootDir, `.env.${process.env.NODE_ENV}.local`)
                    );
                }

                // Find first existing .env file
                envPath = possiblePaths.find(p => fs.existsSync(p));
            }

            if (envPath && !fs.existsSync(envPath)) {
                console.warn(`⚠️  Warning: .env file not found at ${envPath}`);
                return false;
            }

            if (!envPath) {
                console.warn('Warning: No .env file found in common locations');
                console.warn('   Checked:', [
                    path.join(this.rootDir, '.env'),
                    path.join(this.rootDir, `.env.${process.env.NODE_ENV || 'development'}`),
                    path.join(process.cwd(), '.env')
                ]);
                return false;
            }

            // Load the .env file
            const result = dotenv.config({ path: envPath, ...options });

            if (result.error) {
                console.error('Error loading .env file:', result.error);
                return false;
            }

            this.envLoaded = true;
            return true;
        },

        /**
         * Validate that required files exist for React app
         * @param {string} buildPath - Path to build directory
         * @param {string} indexPath - Path to index.html
         */
        validateReactApp(buildPath, indexPath) {
            if (!fs.existsSync(buildPath)) {
                throw new Error(`Build directory not found: ${buildPath}`);
            }

            if (!fs.existsSync(indexPath)) {
                throw new Error(`index.html not found: ${indexPath}`);
            }

            this.fear.getLogger().info('✓ React app files validated');
            return true;
        },

        /**
         * Configure static file serving for React SPA
         * @param {string} root - Root directory path
         * @param {string} app - App directory path relative to root
         * @param {string} build - Build directory path for index.html
         * @param {string} basePath - Base path for the app (e.g., '/admin', '/dashboard')
         */
        setupStaticFiles(root, app, build, basePath = '') {
            this.rootDir = root || path.resolve();

            // Construct paths - handle both absolute and relative paths
            const buildPath = path.isAbsolute(app)
                ? app
                : path.join(this.rootDir, app);

            const indexPath = path.isAbsolute(build)
                ? path.join(build, "index.html")
                : path.join(this.rootDir, build, "index.html");

            // Normalize base path
            const normalizedBasePath = basePath
                ? `/${basePath.replace(/^\/+|\/+$/g, '')}`
                : '';

            this.fear.getLogger().info('═══════════════════════════════════════');
            this.fear.getLogger().info('React App Path Resolution:');
            this.fear.getLogger().info(`→ Build path: ${buildPath}`);
            this.fear.getLogger().info(`→ Index path: ${indexPath}`);
            this.fear.getLogger().info(`→ Base path: ${normalizedBasePath || '/'}`);

            // Validate React app exists
            try {
                this.validateReactApp(buildPath, indexPath);
            } catch (error) {
                this.fear.getLogger().error('React app validation failed:', error.message);
                throw error;
            }

            // Serve static files with caching headers
            this.fear.getApp().use(
                normalizedBasePath,
                (req, res, next) => {
                    this.fear.getLogger().debug(`Static file request: ${req.path}`);
                    next();
                },
                express.static(buildPath, {
                    index: false,
                    fallthrough: true,
                    maxAge: '1h',
                    etag: true,
                    lastModified: true,
                    setHeaders: (res, filePath) => {
                        if (filePath.endsWith('index.html')) {
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        }
                        else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
                            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                        }
                    }
                })
            );

            // The SPA fallback is deferred to startServer(). A catch-all mounted here would sit
            // ahead of anything attached between initialize() and startServer() — server.js
            // attaches the SSR middleware in that window, and an earlier catch-all swallowed
            // every request before SSR ever saw it.
            this._spaFallbacks.push({ basePath: normalizedBasePath, indexPath });

            // Track registered React apps
            this.reactApps.push({
                basePath: normalizedBasePath || '/',
                buildPath,
                indexPath
            });

            this.fear.getLogger().info(`React app configured at: ${normalizedBasePath || '/'}`);
        },

        /**
         * Mount the SPA fallbacks registered by setupStaticFiles(). Longest base path first so
         * '/admin' wins over '/'. `app.use(prefix, fn)` prefix-matches already, so no wildcard
         * segment is needed (and `/*` breaks on Express 5).
         */
        _mountSpaFallbacks() {
            const logger = this.fear.getLogger();
            const assetPattern = /\.(js|mjs|css|map|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|eot|json|txt|xml)$/i;

            [...this._spaFallbacks]
                .sort((a, b) => b.basePath.length - a.basePath.length)
                .forEach(({ basePath, indexPath }) => {
                    this.fear.getApp().use(basePath || '/', (req, res, next) => {
                        // Only page navigations get index.html. API routes (originalUrl: req.path is
                        // stripped of the mount prefix), non-GET requests and missing assets fall
                        // through, so a missing bundle is a 404 instead of HTML served as JS.
                        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
                        if (/^\/fear(\/|\?|$)/.test(req.originalUrl)) return next();
                        if (assetPattern.test(req.path)) return next();

                        res.sendFile(indexPath, (err) => {
                            if (err && !res.headersSent) {
                                logger.error('Error serving index.html:', err);
                                res.status(500).send('Internal Server Error');
                            }
                        });
                    });
                });

            this._spaFallbacks = [];
        },

        /**
         * Add multiple React apps at different base paths
         * @param {Array} apps - Array of app configurations
         * Example: [{root: __dirname, app: '/build', build: 'build', basePath: '/admin'}]
         */
        setupMultipleReactApps(apps) {
            if (!Array.isArray(apps)) {
                throw new Error('setupMultipleReactApps expects an array of app configurations');
            }

            apps.forEach((appConfig, index) => {
                this.fear.getLogger().info(`Setting up React app ${index + 1}/${apps.length}`);
                this.setupStaticFiles(
                    appConfig.root,
                    appConfig.app,
                    appConfig.build,
                    appConfig.basePath
                );
            });
        },

        /**
         * Dev-mode CORS. In production this app sits behind nginx on the same
         * origin as everything it talks to, so this should stay off there —
         * FEAR.js's own ALLOWED_ORIGINS-driven CORS config is what governs the
         * real deployment.
         * @param {Object} options - CORS options
         */
        setupCORS(options = {}) {
            const defaultOptions = {
                origin: options.origin || '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                credentials: options.credentials || false
            };

            this.fear.getApp().use((req, res, next) => {
                // Browsers reject `*` together with credentials, so reflect the caller's origin instead
                let origin = defaultOptions.origin;
                if (defaultOptions.credentials && origin === '*' && req.headers.origin) {
                    origin = req.headers.origin;
                    res.header('Vary', 'Origin');
                }

                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', defaultOptions.methods.join(', '));
                res.header('Access-Control-Allow-Headers', defaultOptions.allowedHeaders.join(', '));

                if (defaultOptions.credentials) {
                    res.header('Access-Control-Allow-Credentials', 'true');
                }

                // Handle preflight
                if (req.method === 'OPTIONS') {
                    return res.sendStatus(200);
                }

                next();
            });

            this.fear.getLogger().info('CORS configured for React development');
        },

        /**
         * NOT IMPLEMENTED. Logs the intent and does nothing else — no routes are
         * actually prefixed. Kept as a documented no-op rather than removed
         * outright so existing `initialize()` calls that pass `apiPrefix` don't
         * throw; if you need this, prefix your route mounting in FEAR.js's
         * `setupRoutes()` instead, which is where routes are actually mounted.
         * @param {string} prefix - API prefix (e.g., '/api/v1')
         */
        setupAPIPrefix(prefix) {
            if (!prefix || typeof prefix !== 'string') {
                throw new Error('API prefix must be a string');
            }

            const normalizedPrefix = `/${prefix.replace(/^\/+|\/+$/g, '')}`;

            this.fear.getLogger().warn(
                `setupAPIPrefix('${normalizedPrefix}') was called but this method is not implemented — no routes were changed.`
            );
        },

        setupProcessHandlers() {
            // Prevent duplicate listeners if initialize() is somehow called twice
            if (this._handlersSetup) {
                return;
            }
            this._handlersSetup = true;

            process.on('uncaughtException', (err) => {
                this.fear.getLogger().error('Uncaught Exception:', err);
                this.gracefulShutdown('uncaughtException');
            });

            process.on('unhandledRejection', (reason) => {
                this.fear.getLogger().error('Unhandled Rejection:', reason);
                this.gracefulShutdown('unhandledRejection');
            });

            process.on('SIGTERM', () => {
                this.fear.getLogger().info('SIGTERM received, starting graceful shutdown');
                this.gracefulShutdown('SIGTERM');
            });

            process.on('SIGINT', () => {
                this.fear.getLogger().info('SIGINT received, starting graceful shutdown');
                this.gracefulShutdown('SIGINT');
            });
        },

        /**
         * Initialize database connection. Skips cleanly when no DB_LINK is configured.
         * Uses the promise db.connect() returns rather than its callback: the callback never
         * receives an error, and a failed connect used to surface as an unhandled rejection
         * that killed the process through the unhandledRejection handler.
         */
        initializeDatabase() {
            const logger = this.fear.getLogger();
            const env = this.fear.getEnvironment();

            if (!env || !env.DB_LINK) {
                logger.warn('No DB_LINK configured — skipping database connection');
                return Promise.resolve();
            }

            if (!env.DB_NAME) {
                logger.warn('DB_NAME is not set — mongoose will use the database named in DB_LINK');
            }

            return Promise.resolve()
                .then(() => this.fear.getDatabase().connect(env))
                .then(() => logger.info('Database initialized successfully'))
                .catch((error) => {
                    logger.error('Database initialization failed:', error);
                    throw error;
                });
        },

        /**
         * Start the plain HTTP server nginx proxies to. Bound to 127.0.0.1 by
         * default — set BIND_HOST in .env to change that (e.g. '0.0.0.0' if
         * you're running inside a container where nginx is a separate hop and
         * loopback wouldn't reach this process).
         */
        _startHttpServer(port, host) {
            return new Promise((resolve, reject) => {
                // Note: Express/Node's listen() callback takes no error argument —
                // failures surface only via the server's 'error' event. The
                // previous version checked `if (err)` inside this callback; that
                // branch could never run and masked the real failure path below.
                const server = this.fear.getApp().listen(port, host, () => resolve(server));

                server.on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        this.fear.getLogger().error(`Port ${port} is already in use`);
                    } else {
                        this.fear.getLogger().error('Server error:', err);
                    }
                    reject(err);
                });
            });
        },

        /**
         * Perform graceful shutdown
         */
        gracefulShutdown(signal) {
            if (this.isShuttingDown) {
                this.fear.getLogger().warn('Shutdown already in progress...');
                return Promise.resolve();
            }

            this.isShuttingDown = true;
            const logger = this.fear.getLogger();
            logger.info(`Graceful shutdown initiated by: ${signal}`);

            // A crash is not a clean exit — PM2/systemd should see a failure code
            const crashed = signal === 'uncaughtException' || signal === 'unhandledRejection';
            const exitCode = crashed ? 1 : 0;

            const forceShutdownTimeout = setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, SHUTDOWN_TIMEOUT);
            if (typeof forceShutdownTimeout.unref === 'function') forceShutdownTimeout.unref();

            // server.close() only resolves once every connection ends, and the vchat WebSockets
            // never will on their own. So: stop accepting, drop idle keep-alives, close the signal
            // server (which closes the sockets) and the database, then wait for the listener.
            let serverClosed = Promise.resolve();
            if (this.server) {
                serverClosed = new Promise((resolve) => this.server.close(() => resolve()));
                if (typeof this.server.closeIdleConnections === 'function') this.server.closeIdleConnections();
            }

            return Promise.resolve()
                .then(() => (this.fear && typeof this.fear.shutdown === 'function') ? this.fear.shutdown() : null)
                .then(() => serverClosed)
                .then(() => {
                    clearTimeout(forceShutdownTimeout);
                    logger.info('Graceful shutdown completed');
                    process.exit(exitCode);
                })
                .catch((error) => {
                    clearTimeout(forceShutdownTimeout);
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                });
        },

        /**
         * Initialize FEAR application
         * @param {Object} paths - Path configuration
         * @param {boolean} ADD_PAYMENTS - Whether to add payment routes
         * @param {Object} reactConfig - Additional React configuration
         * @param {string|Object} envConfig - Environment file configuration
         */
        initialize(paths = DEFAULT_PATHS, ADD_PAYMENTS = false, reactConfig = {}, envConfig = null) {
            try {
                this.rootDir = paths.root || path.resolve();

                if (envConfig) {
                    this.loadEnv(envConfig);
                } else if (!this.envLoaded) {
                    this.loadEnv();
                }

                // Import FEAR after dotenv is configured
                const FearFactory = require("./FEAR");
                this.fear = new FearFactory({ ADD_PAYMENTS });
                this.Router = this.fear.Router;

                // Dev-only CORS — see setupCORS()'s doc comment.
                if (reactConfig.enableCORS) {
                    this.setupCORS(reactConfig.corsOptions);
                }

                if (reactConfig.apiPrefix) {
                    this.setupAPIPrefix(reactConfig.apiPrefix);
                }

                // Setup React app(s)
                if (reactConfig.multipleApps && Array.isArray(reactConfig.apps)) {
                    this.setupMultipleReactApps(reactConfig.apps);
                } else {
                    this.setupStaticFiles(paths.root, paths.app, paths.build, paths.basePath);
                }

                this.setupProcessHandlers();

                return Promise.resolve(this.fear);
            } catch (error) {
                console.error('Failed to initialize FEAR application:', error);
                return Promise.reject(error);
            }
        },

        startServer() {
            const app = this.fear.getApp();
            const env = this.fear.getEnvironment() || {};
            const port = app.get("PORT") || DEFAULT_PORT;
            const host = env.BIND_HOST || DEFAULT_HOST;
            const logger = this.fear.getLogger();

            // nginx sits in front and terminates TLS; this tells Express to trust
            // its X-Forwarded-* headers (req.secure, req.ip, and — critically —
            // the session cookie's `secure` flag, which otherwise never gets set
            // and the cookie never gets sent).
            // Don't clobber a more specific TRUST_PROXY that FEAR.js already applied from .env.
            if (!env.TRUST_PROXY) {
                app.set('trust proxy', 1);
            }

            // Everything attached since initialize() (e.g. SSR) is now ahead of the SPA fallback.
            this._mountSpaFallbacks();

            if (this.fear.logo) {
                logger.warn(this.fear.logo);
            }

            logger.info('Starting FEAR Server...');
            logger.info('═══════════════════════════════════════');

            return this.initializeDatabase()
                .then(() => this._startHttpServer(port, host))
                .then((server) => {
                    this.server = server;

                    // Hands the raw http.Server to FearSignal so the WebSocket rides
                    // the same port nginx already proxies — see FEAR.js's
                    // attachSignal() and VCHAT_INTEGRATION.md §1c/§2.
                    if (typeof this.fear.attachSignal === 'function') {
                        this.fear.attachSignal(server);
                    }

                    logger.info('═══════════════════════════════════════');
                    logger.info(`FEAR API Server listening on ${host}:${port} (behind nginx)`);
                    logger.info('═══════════════════════════════════════');

                    if (this.reactApps.length > 0) {
                        logger.info('📱 React Apps:');
                        const publicOrigin = env.PUBLIC_ORIGIN || `http://${host}:${port}`;

                        this.reactApps.forEach(app => {
                            logger.info(`• ${publicOrigin}${app.basePath}`);
                        });
                        logger.info('═══════════════════════════════════════');
                    }

                    return server;
                })
                .catch((error) => {
                    logger.error('Failed to start server:', error);
                    throw error;
                });
        },

        /**
         * Get logger instance
         */
        getLogger() {
            return this.fear ? this.fear.getLogger() : null;
        },

        /**
         * Get FEAR instance
         */
        getFear() {
            return this.fear;
        },

        /**
         * Get HTTP server instance
         */
        getServer() {
            return this.server;
        },

        /**
         * Get Router instance
         */
        getRouter() {
            return this.Router;
        },

        /**
         * Check if server is shutting down
         */
        getIsShuttingDown() {
            return this.isShuttingDown;
        },

        /**
         * Get root directory path
         */
        getRootDir() {
            return this.rootDir;
        },

        /**
         * Get registered React apps
         */
        getReactApps() {
            return this.reactApps;
        },

        /**
         * Check if environment variables are loaded
         */
        isEnvLoaded() {
            return this.envLoaded;
        }
    };

    return FearServer;

})();

module.exports = FearServer;