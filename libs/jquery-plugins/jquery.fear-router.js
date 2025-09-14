
; (function ($, window, document, undefined) {
    'use strict';

    const defaults = {
        hashChange: true,
        pushState: false,
        fallbackRoute: 'home',
        beforeRouteChange: null,
        afterRouteChange: null,
        routes: {
            home: { name: 'home', html: null, callback: null, title: 'Home' },
            about: { name: 'about', html: null, callback: null, title: 'About' },
            works: { name: 'works', html: null, callback: null, title: 'Works' },
            github: { name: 'github', html: null, callback: null, title: 'GitHub' },
            contact: { name: 'contact', html: null, callback: null, title: 'Contact' }
        },
        callbacks: {
            onHashChange: null,
            onInitialized: null,
            onRouteChange: null,
        },
        fragmentPath: 'js/fragments/',
        contactAPI: 'http://fear.master.com/fear/api/mail/contact',
        debug: true,
    }


    function FearRouter(routes, options) {
        this.cache = new Map();
        this.settings = $.extend(true, {}, defaults, options);
        this.routes = $.extend(true, this.settings.routes, this.settings.routes);
    }

    FearRouter.prototype = {
        // Enhanced router implementation
        init: () => {
            var self = this;

            this.log('Router initialized');

            // Listen for hash changes and popstate
            $(window).on('hashchange.fear', function () {
                self.handleRoute();
            });

            if (this.settings.router.pushState) {
                $(window).on('popstate.fear', function (e) {
                    if (e.originalEvent.state && e.originalEvent.state.route) {
                        self.handleRoute(e.originalEvent.state.route);
                    } else {
                        self.handleRoute();
                    }
                });
            }

            // Initial route
            this.handleRoute();
        },

        handleRoute: (routeName) => { 
            var hash = routeName || window.location.hash.replace('#', '') || this.settings.router.fallbackRoute;
            var route = this.settings.routes[hash];

            if (!route) {
                this.log('Route not found: ' + hash + ', falling back to: ' + this.settings.router.fallbackRoute);
                route = this.settings.routes[this.settings.router.fallbackRoute];
                if (!route) {
                    this.handleError('Fallback route not found');
                    return;
                }
            }

            // Execute beforeRouteChange callback
            if (this.settings.router.beforeRouteChange) {
                var shouldContinue = this.settings.router.beforeRouteChange.call(this, hash, this.currentRoute);
                if (shouldContinue === false) {
                    return;
                }
            }

            var startTime = performance.now();
            this.currentRoute = hash;

            if (route.html) {
                this.render(route, startTime);
            } else {
                this.fetch(route, startTime);
            }
        },

        fetch: (route, startTime) => {
            var self = this;

            // Check cache first
            if (this.settings.enableCache && this.cache.has(route.name)) {
                route.html = this.cache.get(route.name);
                this.render(route, startTime);
                return;
            }

            // Check if already loading
            if (this.loadingPromises.has(route.name)) {
                this.loadingPromises.get(route.name).then(function (data) {
                    route.html = data;
                    self.render(route, startTime);
                });
                return;
            }

            // Create loading promise
            var loadingPromise = $.ajax({
                url: this.settings.fragmentPath + route.name + '.html',
                cache: this.settings.enableCache,
                timeout: 10000
            });

            this.loadingPromises.set(route.name, loadingPromise);

            loadingPromise
                .done(function (data) {
                    route.html = data;
                    if (self.settings.enableCache) {
                        self.cache.set(route.name, data);
                    }
                    self.render(route, startTime);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    self.handleError('Error loading route: ' + textStatus + ' - ' + errorThrown, {
                        route: route.name,
                        status: textStatus,
                        error: errorThrown
                    });
                })
                .always(function () {
                    self.loadingPromises.delete(route.name);
                });
        },

        render: (route, startTime) => {
            var self = this;
            var $container = this.$element.find('.fear_container');
            var fadeSpeed = this.settings.animations.enabled && !utils.prefersReducedMotion() ?
                this.settings.fadeSpeed : 0;

            $container.fadeOut(fadeSpeed, function () {
                $container.empty().html(route.html);

                // Update page title
                if (route.title) {
                    document.title = route.title + ' - FEAR';
                }

                $container.fadeIn(fadeSpeed, function () {
                    // Execute route callback
                    if (route.callback && typeof route.callback === 'function') {
                        try {
                            route.callback.call(self);
                        } catch (e) {
                            self.handleError('Route callback error: ' + e.message, { route: route.name, error: e });
                        }
                    }

                    // Reinitialize components
                    self.initComponents();

                    // Announce route change for accessibility
                    if (self.settings.accessibility.announceRouteChanges && self.$announcer) {
                        self.$announcer.text('Navigated to ' + (route.title || route.name));
                    }

                    // Track performance
                    var loadTime = performance.now() - startTime;
                    self.performanceMetrics.routeLoadTimes.set(route.name, loadTime);
                    self.log('Route "' + route.name + '" loaded in ' + loadTime.toFixed(2) + 'ms');

                    self.trigger('fear:route:loaded', { route: route.name, loadTime: loadTime });

                    // Execute afterRouteChange callback
                    if (self.settings.router.afterRouteChange) {
                        self.settings.router.afterRouteChange.call(self, route.name);
                    }

                    if (self.settings.callbacks.onRouteChange) {
                        self.settings.callbacks.onRouteChange.call(self, route.name);
                    }
                });
            });
        },
    }

       // Plugin wrapper
    $.fn[PLUGIN_NAME] = (options) => {
        const args = arguments;
        
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'fear_data')) {
                    $.data(this, 'fear_data', new FearRouter(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            let returns;
            
            this.each(function() {
                const instance = $.data(this, 'plugin_' + PLUGIN_NAME);
                
                if (instance instanceof FearRouter && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + PLUGIN_NAME, null);
                }
            });
            
            return returns !== undefined ? returns : this;
        }
    };
    

})(jQuery, window, document);
