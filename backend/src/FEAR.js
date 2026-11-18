const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require('express-session');
const compression = require("compression");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const MongoStore = require('connect-mongo');
const passport = require('passport');

const FEAR = (() => {
    // Private constants
    const DEFAULT_PORT = 4000;
    const DEFAULT_JSON_LIMIT = '10mb';
    const DEFAULT_ROUTE_PATH = '/fear/api';
    // String.raw keeps the backslashes in the ASCII art intact
    const FEAR_LOGO = String.raw`
_________________________
|  ___| ____|  / \  |  _ \
| |_  |  _|   / _ \ | |_) |
|  _| | |___ / ___ \|  _ <
|_|   |_____/_/   \_\_| \_\
----The Quieter we become----
-- the more we are able to hear.--
`;

    // Constructor function
    const FEAR = function (config) {
        this.app = express();
        this.Router = express.Router;
        this.server = null;
        this.registeredRouters = [];
        this.excludedRoutes = []; // names actually skipped, filled in by setupRoutes()
        this.env = null;
        this.logger = null;
        this.morgan = null;
        this.cloud = null;
        this.db = null;
        this.handler = null;
        this.validator = null;
        this.logo = null;
        this.origins = [];
        this.corsConfig = null;
        this.stripe = null;
        this.paypal = null;
        this.passport = null;
        this.mailer = null;
        this.ssr = null;
        this.signal = null;
        this.vchatAuth = null;
        this.sessionParser = null;

        this.setupEnvironment();
        this.setupDependencies();
        this.setupSSR();

        if ((config && config.ADD_PAYMENTS) || this.env.ADD_PAYMENTS === 'true') this.setupProcessors();

        this.setupMailer();
        this.setupMiddleware();
        this.setupVchatAuth(); // must precede setupSignal: the socket authenticates through it
        this.setupSignal();
        this.setupRoutes();
        this.setupErrorHandling(); // must come after routes so it can catch their errors
    };

    FEAR.prototype = {
        constructor: FEAR,
        getStripe() {
            return this.stripe;
        },
        getPassport() {
            return this.passport;
        },
        clearGlobal() {
            delete global.FearRouter;
            return this;
        },
        getApp() {
            return this.app;
        },
        getLogger() {
            return this.logger;
        },
        getDatabase() {
            return this.db;
        },
        getEnvironment() {
            return this.env;
        },
        getCloud() {
            return this.cloud;
        },
        getRouter() {
            return this.Router;
        },
        getValidator() {
            return this.validator;
        },
        getHandler() {
            return this.handler;
        },
        getPaypal() {
            return this.paypal;
        },
        getSignal() {
            return this.signal;
        },
        getVchatAuth() {
            return this.vchatAuth;
        },
        getMailer() {
            return this.mailer;
        },
        getCorsConfigValue() {
            return this.corsConfig;
        },
        getExcludedRoutes() {
            return [...this.excludedRoutes];
        },

        setupEnvironment() {
            const envResult = require("dotenv").config({ path: ".env" });
            const parsed = (envResult && !envResult.error && envResult.parsed) || {};

            // FEARServer may already have loaded a .env from another location into process.env,
            // so a missing ./.env in the cwd is not fatal as long as the environment is populated.
            if (envResult && envResult.error && !process.env.SESSION_SECRET) {
                throw new Error(`Environment configuration error: ${envResult.error.message}`);
            }

            // Real environment variables win over the .env file (PM2 sets NODE_PORT per instance)
            this.env = { ...parsed };
            Object.keys(this.env).forEach((key) => {
                if (process.env[key] !== undefined) this.env[key] = process.env[key];
            });
            // Keys that only exist in process.env (e.g. loaded by FEARServer) still need to be visible
            ['EXCLUDE_ROUTES', 'NODE_ENV', 'NODE_PORT', 'SESSION_SECRET', 'DB_LINK', 'DB_NAME', 'ADD_PAYMENTS',
                'TRUST_PROXY', 'ALLOWED_ORIGINS'].forEach((key) => {
                    if (this.env[key] === undefined && process.env[key] !== undefined) this.env[key] = process.env[key];
                });
        },

        setupDependencies() {
            this.logo = FEAR_LOGO;
            this.logger = require("./libs/logger");
            this.passport = require('./libs/passport');
            this.morgan = require("./libs/logger/morgan");
            this.cloud = require("./libs/cloud");
            this.db = require("./libs/db");
            this.handler = require("./libs/handler");
            this.validator = require("./libs/validator");
            this.origins = this.getAllowedOrigins();
            this.corsConfig = this.getCorsConfig();
        },

        setupProcessors() {
            const StripeHandler = require("./libs/stripe");
            const PayPal = require('./libs/paypal');
            try { this.stripe = new StripeHandler(this); } catch (e) { this.logger.error(e.message); }
            try { this.paypal = new PayPal(this); } catch (e) { this.logger.error(e.message); }
        },

        setupSSR() {
            const FearSSR = require('./libs/ssr');
            this.ssr = new FearSSR(this);
        },

        setupVchatAuth() {
            // JWT-cookie identity shared by REST routes and the signaling socket.
            // The module is a factory (mod(fear)); an older copy exported the helpers directly.
            const mod = require('./controllers/auth/vchat');
            const auth = typeof mod === 'function' ? mod(this) : mod;

            if (!auth || typeof auth.authenticateSocket !== 'function') {
                // An empty object here usually means a circular require while the module loaded.
                throw new Error(
                    `controllers/auth/vchat must export the vchat auth layer ` +
                    `(got ${typeof mod} with keys: ${Object.keys(mod || {}).join(', ') || 'none'})`
                );
            }

            this.vchatAuth = auth;
        },

        setupSignal() {
            const FearSignal = require('./libs/signal');

            this.signal = new FearSignal(this, {
                path: this.env.VCHAT_WS_PATH,
                authenticate: this.vchatAuth.authenticateSocket,
                requireAuth: this.env.VCHAT_REQUIRE_AUTH !== 'false'
            });
        },

        attachSignal(server) {
            if (!this.signal || !server) return this;
            this.signal.attach(server);
            return this;
        },

        /**
         * Session store: Mongo-backed when DB_LINK is set (survives restarts and is shared
         * across PM2 instances), otherwise express-session's in-memory store (dev only).
         */
        createSessionStore() {
            if (!this.env.DB_LINK) {
                this.logger.warn('No DB_LINK — using in-memory session store (not for production)');
                return undefined;
            }

            try {
                return MongoStore.create({
                    mongoUrl: this.env.DB_LINK,
                    dbName: this.env.DB_NAME,
                    ttl: 60 * 60 * 24 * 7 // matches cookie maxAge, in seconds
                });
            } catch (err) {
                this.logger.error(`Mongo session store failed, falling back to memory :: ${err.message}`);
                return undefined;
            }
        },

        setupMiddleware() {
            this.app.set("PORT", this.env.NODE_PORT || DEFAULT_PORT);
            // Behind nginx: TRUST_PROXY=1 makes req.ip the real client (login limiter, lastLoginIP)
            if (this.env.TRUST_PROXY) {
                this.app.set('trust proxy', /^\d+$/.test(this.env.TRUST_PROXY) ? Number(this.env.TRUST_PROXY) : this.env.TRUST_PROXY);
            }
            this.app.set('fear', this); // controllers reach signal/env/vchatAuth via req.app.get('fear')
            this.app.use(express.json({ limit: DEFAULT_JSON_LIMIT }));
            this.app.use(express.urlencoded({ extended: true }));

            if (!this.env.SESSION_SECRET) {
                throw new Error('SESSION_SECRET is required (sessions and vchat handoff tokens depend on it)');
            }

            this.sessionParser = session({
                secret: this.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: this.createSessionStore(),
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                    httpOnly: true,
                    secure: this.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                }
            });

            this.app.use(this.sessionParser);
            this.app.use(this.morgan);
            this.app.use(compression());
            this.app.use(fileUpload());
            this.app.use(cookieParser());
            this.app.use(passport.initialize());
            this.app.use(passport.session());

            this.app.use((req, res, next) => {
                this.logger.info(`FEAR API Query :: ${req.url}`);
                res.locals.user = req.user || null;
                next();
            });
        },

        setupMailer() {
            const mailinfo = require('./libs/emailer/info');
            const smtp = require('./libs/emailer/smtp');

            // emailer/smtp.js reads `service`; `mailService` is kept for anything else that looks there
            mailinfo.service = 'google';
            mailinfo.mailService = 'google';
            this.mailinfo = mailinfo;

            if (!this.mailer) {
                this.mailer = new smtp(this);
            }
            this.logger.warn('-== Mail transport setup initialized. ==-');
        },

        getAllowedOrigins() {
            if (!this.env.ALLOWED_ORIGINS) return [];

            return this.env.ALLOWED_ORIGINS
                .split(',')
                .map(origin => origin.trim())
                .filter(origin => origin.length > 0);
        },

        getCorsConfig() {
            return {
                credentials: true,
                origin: (origin, callback) => {
                    if (!origin) return callback(null, true);

                    if (this.origins.includes(origin)) {
                        callback(null, true);
                    } else {
                        this.logger.error(`Origin :: ${origin} :: Not allowed by CORS`);
                        callback(new Error("Not allowed by CORS"));
                    }
                }
            };
        },

        /**
         * EXCLUDE_ROUTES=agent,ebay,analytics   skip those route files
         * EXCLUDE_ROUTES=*                      skip every route file
         * EXCLUDE_ROUTES=*,!auth,!vchat         skip everything except auth and vchat
         *
         * Names are route file names without .js, case-insensitive. `!name` always wins over
         * `*` or an explicit exclude. Excluded files are never require()d, so their
         * controllers and libs don't load either.
         */
        parseExcludedRoutes() {
            const rules = { all: false, exclude: new Set(), keep: new Set() };

            (this.env.EXCLUDE_ROUTES || '')
                .split(',')
                .map((token) => token.trim().toLowerCase().replace(/\.js$/, ''))
                .filter(Boolean)
                .forEach((token) => {
                    if (token === '*') rules.all = true;
                    else if (token.startsWith('!')) rules.keep.add(token.slice(1));
                    else rules.exclude.add(token);
                });

            return rules;
        },

        isRouteExcluded(name, rules) {
            const key = name.toLowerCase();
            if (rules.keep.has(key)) return false;
            return rules.all || rules.exclude.has(key);
        },

        setupRoutes() {
            const routesDir = path.join(__dirname, "routes");

            if (!fs.existsSync(routesDir)) {
                this.logger.warn(`Routes directory does not exist: ${routesDir}`);
                return;
            }

            const rules = this.parseExcludedRoutes();
            this.excludedRoutes = [];

            try {
                const routeFiles = fs.readdirSync(routesDir)
                    .filter(file => file.endsWith('.js'));

                const available = new Set(routeFiles.map(file => file.replace(/\.js$/, '').toLowerCase()));

                // Catch typos in .env early
                [...rules.exclude, ...rules.keep].forEach((name) => {
                    if (!available.has(name)) this.logger.warn(`EXCLUDE_ROUTES :: no route file named "${name}"`);
                });

                if (rules.all) {
                    this.logger.warn('EXCLUDE_ROUTES=* :: all routes excluded' +
                        (rules.keep.size ? ` except: ${[...rules.keep].join(', ')}` : ''));
                }

                routeFiles.forEach(file => {
                    const routeName = file.replace(/\.js$/, '');

                    if (this.isRouteExcluded(routeName, rules)) {
                        this.excludedRoutes.push(routeName);
                        if (!rules.all) {
                            this.logger.warn(`Route excluded via EXCLUDE_ROUTES :: ${DEFAULT_ROUTE_PATH}/${routeName}`);
                        }
                        return;
                    }

                    try {
                        const routeModule = require(`./routes/${file}`);
                        const routePath = `${DEFAULT_ROUTE_PATH}/${routeName}`;

                        this.useRouter(routeModule(this), routePath);

                    } catch (error) {
                        this.logger.error(`Failed to load route ${file}:`, error);
                    }
                });
            } catch (error) {
                this.logger.error(`Failed to read routes directory:`, error);
            }
        },

        // Errors thrown/forwarded by route handlers (handler.async, tryCatch) end up here.
        // No 404 handler on purpose: FEARServer mounts the SPA fallback after this.
        setupErrorHandling() {
            if (this.handler && typeof this.handler.global === 'function') {
                this.app.use(this.handler.global);
            }
        },

        useRouter(router, routePath = DEFAULT_ROUTE_PATH, corsOptions = null) {
            if (!router || typeof router !== 'function') {
                throw new Error('Router must be a valid Express router instance');
            }

            const corsConfig = corsOptions || this.corsConfig;

            const routerInfo = {
                router,
                path: routePath,
                corsConfig
            };

            this.registeredRouters.push(routerInfo);
            this.app.use(routePath, cors(corsConfig), router);
            this.logger.info(`Single router registered :: ${routePath}`);

            return this;
        },

        useRouters(routers) {
            if (!Array.isArray(routers)) {
                throw new Error('Routers must be an array');
            }

            routers.forEach(config => {
                if (typeof config === 'function') {
                    this.useRouter(config, DEFAULT_ROUTE_PATH, this.corsConfig);
                } else if (config && config.router) {
                    this.useRouter(config.router, config.path, config.cors);
                } else {
                    throw new Error('Invalid router configuration');
                }
            });

            return this;
        },

        createRouter() {
            const router = express.Router();

            router.getSignal = () => this.signal;
            router.getVchatAuth = () => this.vchatAuth;
            router.getLogger = () => this.logger;
            router.getDatabase = () => this.db;
            router.getCloud = () => this.cloud;
            router.getEnvironment = () => this.env;
            router.getHandler = () => this.handler;
            router.getValidator = () => this.validator;
            router.getAiAgent = () => this.agentService;
            router.getStripe = () => this.stripe;
            router.getPaypal = () => this.paypal;

            return router;
        },

        getRegisteredRouters() {
            return this.registeredRouters.map(info => ({
                path: info.path,
                corsEnabled: !!info.corsConfig
            }));
        },

        shutdown() {
            this.logger.info('Initiating graceful shutdown...');

            return Promise.resolve()
                .then(() => (this.signal ? this.signal.close() : null))
                .then(() => this.closeDatabase())
                .catch((err) => this.logger.error('Shutdown error:', err));
        },

        closeDatabase() {
            return new Promise((resolve, reject) => {
                if (this.db && typeof this.db.disconnect === 'function') {
                    this.db.disconnect((err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        },

        setAsGlobal() {
            global.FearRouter = {
                createRouter: () => this.createRouter(),
                getLogger: () => this.logger,
                getDatabase: () => this.db,
                getEnvironment: () => this.env,
                getCloud: () => this.cloud,
                getStripe: () => this.stripe,
                getSignal: () => this.signal,
                getVchatAuth: () => this.vchatAuth,
                initProcessors: () => this.setupProcessors() // arrow keeps `this`
            };
            return this;
        }
    };

    return FEAR;
})();

FEAR.FearFactory = (config) => new FEAR(config);

module.exports = FEAR;