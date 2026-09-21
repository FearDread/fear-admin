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

module.exports = FEAR = (() => {
    // Private constants
    const DEFAULT_PORT = 4000;
    const DEFAULT_JSON_LIMIT = '10mb';
    const DEFAULT_ROUTE_PATH = '/fear/api';
    const AGENT_ROUTE_PATH = '/fear/api/agent';
    const FEAR_LOGO = `
_________________________
|  ___| ____|  / \  |  _ \ 
| |_  |  _|   / _ \ | |_) |
|  _| | |___ / ___ \|  _ < 
|_|   |_____/_/   \_\_| \_\
----The Quieter we become----
-- the more we are able to hear.--
`

    // Constructor function
    const FEAR = function (config) {
        this.app = express();
        this.Router = express.Router;
        this.server = null;
        this.registeredRouters = [];
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
        this.sessionParser = null;

        this.setupEnvironment();
        this.setupDependencies();
        this.setupSSR();

        if (this.env.ADD_PAYMENTS) this.setupProcessors();

        this.setupMailer();
        this.setupMiddleware();
        this.setupSignal();
        this.setupRoutes();

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
        getMailer() {
            return this.mailer;
        },
        getCorsConfigValue() {
            return this.corsConfig;
        },
        setupEnvironment() {
            const envResult = require("dotenv").config({ path: ".env" });

            if (!envResult || envResult.error) {
                throw new Error(`Environment configuration error: ${envResult?.error?.message || 'Unknown error'}`);
            }

            this.env = envResult.parsed;
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

            if (!this.env.PAYPAL_CLIENT_ID || !this.env.STRIPE_API_KEY) {
                this.logger.warn('Missing environment values in .env file')
            }

            this.stripe = new StripeHandler(this);
            this.paypal = new PayPal(this);
        },

        setupSSR() {
            const FearSSR = require('./libs/ssr');
            this.ssr = new FearSSR(this);
        },

        setupSignal() {
            const FearSignal = require('./libs/signal');

            this.signal = new FearSignal(this, {
                path: this.env.VCHAT_WS_PATH,
                requireAuth: this.env.VCHAT_REQUIRE_AUTH !== 'false'
            });

            // Static client: public/vchat/{index.html,vchat-client.js}
            this.app.use('/vchat', express.static(path.join(__dirname, 'public', 'vchat')));
        },

        attachSignal(server) {
            if (!this.signal || !server) return this;
            this.signal.attach(server);
            return this;
        },

        setupMiddleware() {
            this.app.set("PORT", this.env.NODE_PORT || DEFAULT_PORT);
            this.app.use(express.json({ limit: DEFAULT_JSON_LIMIT }));
            this.app.use(express.urlencoded({ extended: true }));

            this.sessionParser = session({
                secret: this.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                    httpOnly: true,
                    secure: this.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                }

            })
            this.app.use(this.sessionParser);
            this.app.use(this.morgan);
            this.app.use(compression());
            this.app.use(fileUpload());
            this.app.use(cookieParser());
            this.app.use(passport.initialize());
            this.app.use(passport.session());

            require('./libs/passport');
            this.app.use((req, res, next) => {
                this.logger.info(`FEAR API Query :: ${req.url}`);
                res.locals.user = req.user || null;
                next();
            });
        },

        setupMailer() {
            const mailService = (this.env.NODE_ENV === 'production') ? 'mailgun' : 'google';
            const mailinfo = require('./libs/emailer/info');
            const smtp = require('./libs/emailer/smtp')

            mailinfo.service = mailService;
            this.mailinfo = mailinfo;
            if (!this.mailer) {
                this.mailer = new smtp(this);
            }
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

        setupRoutes() {
            const routesDir = path.join(__dirname, "routes");

            if (!fs.existsSync(routesDir)) {
                this.logger.warn(`Routes directory does not exist: ${routesDir}`);
                return;
            }

            try {
                const routeFiles = fs.readdirSync(routesDir)
                    .filter(file => file.endsWith('.js'));

                routeFiles.forEach(file => {
                    try {
                        const routeName = file.replace(/\.js$/, '');
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
            router.getLogger = () => this.logger;
            router.getDatabase = () => this.db;
            router.getCloud = () => this.cloud;
            router.getEnvironment = () => this.env;
            router.getHandler = () => this.handler;
            router.getValidator = () => this.validator;
            router.getAiAgent = () => this.agentService;
            router.getStripe = () => this.stripe;
            router.getPaypal = () => this.paypal;
            //router.getAgentWebInterface = () => this.agentWebInterface;

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
                initProcessors: this.setupProcessors
            };
            return this;
        }
    };

    return FEAR;
})();

exports.FearFactory = () => {
    return new FEAR();
};
