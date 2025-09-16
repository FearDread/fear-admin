/*!
 * Fear Dynamic Router jQuery Plugin
 * Version: 2.0.0
 * Author: FearDread
 * Description: A comprehensive client-side routing solution with dynamic content loading
 * Build Date: September 2025
 */
; (function ($, window, document, undefined) {
  'use strict';

  // Plugin constants
  const PLUGIN_NAME = 'FearRouter';
  const VERSION = '1.0.0';
  const DATA_KEY = `fear_${PLUGIN_NAME}`;

  // Default configuration
  const DEFAULTS = {
    // Core router settings
    hashChange: true,
    pushState: false,
    fallbackRoute: 'home',
    fragmentPath: 'js/fragments/',
    container: '.fear_container',

    // Cache settings
    enableCache: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 50,

    // Animation settings
    animations: {
      enabled: true,
      fadeSpeed: 300,
      slideSpeed: 400,
      easing: 'swing'
    },

    // Loading settings
    loading: {
      enabled: true,
      template: '<div class="fear-loading"><div class="spinner"></div><span>Loading...</span></div>',
      minDisplayTime: 200,
      timeout: 10000
    },

    // Error handling
    errorHandling: {
      enabled: true,
      template: '<div class="fear-error"><h3>Error</h3><p>{message}</p><button class="retry-btn">Retry</button></div>',
      showConsoleErrors: true,
      retryAttempts: 2
    },

    // Accessibility
    accessibility: {
      announceRouteChanges: true,
      focusOnRouteChange: true,
      skipLinkSelector: '.skip-link'
    },

    // SEO & Meta
    seo: {
      updateTitle: true,
      updateMeta: true,
      titleSuffix: ' - FEAR',
      defaultTitle: 'FEAR Portfolio'
    },

    // Performance
    performance: {
      trackMetrics: true,
      preloadRoutes: [],
      lazyLoad: true
    },

    // Security
    security: {
      sanitizeHTML: true,
      allowedDomains: [],
      validateRoutes: true
    },

    // Default routes configuration
    routes: {
      home: {
        name: 'home',
        path: 'home.html',
        html: null,
        callback: null,
        title: 'Home',
        meta: { description: 'Welcome to FEAR Portfolio' },
        preload: true
      },
      about: {
        name: 'about',
        path: 'about.html',
        html: null,
        callback: null,
        title: 'About',
        meta: { description: 'Learn more about our work' }
      },
      works: {
        name: 'works',
        path: 'works.html',
        html: null,
        callback: null,
        title: 'Works',
        meta: { description: 'View our portfolio and projects' }
      },
      contact: {
        name: 'contact',
        path: 'contact.html',
        html: null,
        callback: null,
        title: 'Contact',
        meta: { description: 'Get in touch with us' }
      }
    },

    // Event callbacks
    callbacks: {
      onInit: null,
      onDestroy: null,
      onRouteChange: null,
      onRouteLoaded: null,
      onError: null,
      beforeRouteChange: null,
      afterRouteChange: null
    },

    // Debug mode
    debug: false
  };

  // Cache Manager
  class CacheManager {
    constructor(options) {
      this.cache = new Map();
      this.timestamps = new Map();
      this.maxSize = options.maxCacheSize;
      this.timeout = options.cacheTimeout;
      this.enabled = options.enableCache;
    }

    set(key, value) {
      if (!this.enabled) return;

      // Remove oldest entries if at max capacity
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
        this.timestamps.delete(oldestKey);
      }

      this.cache.set(key, value);
      this.timestamps.set(key, Date.now());
    }

    get(key) {
      if (!this.enabled || !this.cache.has(key)) return null;

      const timestamp = this.timestamps.get(key);
      if (Date.now() - timestamp > this.timeout) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        return null;
      }

      return this.cache.get(key);
    }

    has(key) {
      return this.enabled && this.cache.has(key);
    }

    clear() {
      this.cache.clear();
      this.timestamps.clear();
    }

    size() {
      return this.cache.size;
    }
  }

  // Performance Monitor
  class PerformanceMonitor {
    constructor(enabled) {
      this.enabled = enabled;
      this.metrics = {
        routeLoadTimes: new Map(),
        totalRoutes: 0,
        cacheHits: 0,
        cacheMisses: 0
      };
    }

    startTiming(key) {
      if (!this.enabled) return null;
      return performance.now();
    }

    endTiming(key, startTime) {
      if (!this.enabled || !startTime) return 0;
      const duration = performance.now() - startTime;
      this.metrics.routeLoadTimes.set(key, duration);
      return duration;
    }

    recordCacheHit() {
      if (this.enabled) this.metrics.cacheHits++;
    }

    recordCacheMiss() {
      if (this.enabled) this.metrics.cacheMisses++;
    }

    getMetrics() {
      return { ...this.metrics };
    }
  }

  // Main FearRouter Class
  function FearRouter(element, options) {

    this.element = element;
    this.$element = $(element);
    this.options = $.extend(true, {}, DEFAULTS, options);

    // Initialize components
    this.cache = new CacheManager(this.options);
    this.performance = new PerformanceMonitor(this.options.performance.trackMetrics);
    this.loadingPromises = new Map();
    this.retryAttempts = new Map();

    this.utils = {
      log: function (message, level = 'info', context = '') {
        if (this.debug && console && console[level]) {
          const prefix = context ? `[${PLUGIN_NAME}:${context}] ` : `[${PLUGIN_NAME}] `;
          console[level](prefix + message);
        }
      },

      sanitize: function (html) {
        // Basic HTML sanitization - in production, use a proper sanitizer like DOMPurify
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
      },

      debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      throttle: function (func, limit) {
        let inThrottle;
        return function (...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      },

      reduced: function () {
        return window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      },

      isValidURL: function (string) {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
      },

      generateId: function () {
        return Math.random().toString(36).substr(2, 9);
      }
    };

    this.network = {
      createPromises: (url, routeName) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Timeout loading route: ${routeName}`));
          }, this.options.loading.timeout);

          $.ajax({
            url,
            method: 'GET',
            cache: this.options.enableCache,
            timeout: this.options.loading.timeout
          })
            .done((data) => {
              clearTimeout(timeout);

              // Sanitize HTML if enabled
              if (this.options.security.sanitizeHTML && typeof data === 'string') {
                data = Utils.sanitizeHTML(data);
              }

              resolve(data);
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              clearTimeout(timeout);
              const error = new Error(`${textStatus}: ${errorThrown}`);
              error.status = jqXHR.status;
              error.statusText = jqXHR.statusText;
              reject(error);
            });
        });
      }

    };

    this.handler = {
      hashChange: () => {
        if (!FearRouter.isNavigating) {
          this.handler.route();
        }
      },
      popState: (e) => {
        const state = e.originalEvent.state;
        if (state && state.route) {
          this.handler.route(state.route);
        } else {
          this.handler.route();
        }
      },
      route: (routeName) => {
        if (this.isNavigating) {
          this.log('Navigation already in progress', 'warn');
          return;
        }

        this.isNavigating = true;
        const startTime = this.performance.startTiming(route.name);

        try {
          // Execute beforeRouteChange callback
          if (this.options.callbacks.beforeRouteChange) {
            const shouldContinue = await this.options.callbacks.beforeRouteChange.call(
              this, route.name, this.currentRoute
            );
            if (shouldContinue === false) {
              this.isNavigating = false;
              return;
            }
          }

          this.previousRoute = this.currentRoute;
          this.currentRoute = route.name;

          // Show loading if needed
          if (this.options.loading.enabled && !route.html) {
            this.showLoading();
          }

          // Load route content
          if (route.html) {
            await this.handler.render(route);
          } else {
            await this.handler.fetch(route);
          }

          // Record performance metrics
          const loadTime = this.performance.endTiming(route.name, startTime);
          this.performance.metrics.totalRoutes++;

          this.log(`Route "${route.name}" loaded in ${loadTime.toFixed(2)}ms`);
          this.trigger('fear:router:loaded', { route: route.name, loadTime });

        } catch (error) {
          this.handleError(`Failed to load route "${route.name}": ${error.message}`, error);
        } finally {
          this.isNavigating = false;
          this.hideLoading();
        }
      },
      load: async (route) => {
        if (this.isNavigating) {
          this.log('Navigation already in progress', 'warn');
          return;
        }

        this.isNavigating = true;
        const startTime = this.performance.startTiming(route.name);

        try {
          // Execute beforeRouteChange callback
          if (this.options.callbacks.beforeRouteChange) {
            const shouldContinue = await this.options.callbacks.beforeRouteChange.call(
              this, route.name, this.currentRoute
            );
            if (shouldContinue === false) {
              this.isNavigating = false;
              return;
            }
          }

          this.previousRoute = this.currentRoute;
          this.currentRoute = route.name;

          // Show loading if needed
          if (this.options.loading.enabled && !route.html) {
            this.showLoading();
          }

          // Load route content
          if (route.html) {
            await this.renderRoute(route);
          } else {
            await this.fetchRoute(route);
          }

          // Record performance metrics
          const loadTime = this.performance.endTiming(route.name, startTime);
          this.performance.metrics.totalRoutes++;

          this.log(`Route "${route.name}" loaded in ${loadTime.toFixed(2)}ms`);
          this.trigger('fear:router:loaded', { route: route.name, loadTime });

        } catch (error) {
          this.handleError(`Failed to load route "${route.name}": ${error.message}`, error);
        } finally {
          this.isNavigating = false;
          this.hideLoading();
        }
      },
      fetch: async (route) => {
        const cached = this.cache.get(route.name);
        if (cached) {
          this.performance.recordCacheHit();
          route.html = cached;
          await this.handler.render(route);
          return;
        }

        this.performance.recordCacheMiss();

        // Check if already loading
        if (this.loadingPromises.has(route.name)) {
          const html = await this.loadingPromises.get(route.name);

          route.html = html;
          await this.handler.render(route);
          return;
        }

        // Create loading promise
        const url = this.options.fragmentPath + (route.path || route.name + '.html');
        const loadingPromise = this.createLoadingPromise(url, route.name);

        this.loadingPromises.set(route.name, loadingPromise);

        try {
          const html = await loadingPromise;
          route.html = html;
          this.cache.set(route.name, html);
          await this.renderRoute(route);
        } finally {
          this.loadingPromises.delete(route.name);
        }
      },
      render: async (route) => {
        const fadeSpeed = this.options.animations.enabled && !Utils.prefersReducedMotion()
          ? this.options.animations.fadeSpeed : 0;

        return new Promise((resolve) => {
          this.$container.fadeOut(fadeSpeed, async () => {
            // Update content
            this.$container.empty().html(route.html);

            // Update document metadata
            this.updateMetadata(route);

            // Fade in content
            this.$container.fadeIn(fadeSpeed, async () => {
              try {
                // Execute route callback
                if (route.callback && typeof route.callback === 'function') {
                  await route.callback.call(this, route);
                }

                // Reinitialize components
                this.initComponents();

                // Handle accessibility
                this.handleAccessibility(route);

                // Execute afterRouteChange callback
                if (this.options.callbacks.afterRouteChange) {
                  await this.options.callbacks.afterRouteChange.call(this, route.name, this.previousRoute);
                }

                if (this.options.callbacks.onRouteChange) {
                  await this.options.callbacks.onRouteChange.call(this, route.name);
                }

                this.trigger('fear:router:rendered', { route: route.name });
                resolve();

              } catch (error) {
                this.handleError(`Route callback error: ${error.message}`, error);
                resolve();
              }
            });
          });
        });
      }
    };

    // State management
    this.currentRoute = null;
    this.previousRoute = null;
    this.isNavigating = false;
    this.initialized = false;

    // Bind context
    this.log = Utils.log.bind(this.options);
    this.handleHashChange = this.handler.hashChange.bind(this);
    this.handlePopState = this.handler.popState.bind(this);
    // Initialize
    this.init();

    // Public API //
    return {
      navigate: (routeName, pushState = true) => {
        if (this.isNavigating) {
          this.log('Navigation already in progress', 'warn');
          return this;
        }

        const route = this.options.routes[routeName];
        if (!route) {
          this.log(`Route "${routeName}" not found`, 'error');
          return this;
        }

        if (pushState && this.options.pushState) {
          const state = { route: routeName };
          history.pushState(state, route.title || '', `#${routeName}`);
        } else {
          window.location.hash = routeName;
        }

        return this;
      }

  addRoute(name, config) {
        this.options.routes[name] = {
          name,
          path: name + '.html',
          html: null,
          callback: null,
          title: name.charAt(0).toUpperCase() + name.slice(1),
          ...config
        };

        this.log(`Route "${name}" added`);
        this.trigger('fear:router:route-added', { name, config });
        return this;
      }

  removeRoute(name) {
        if (this.options.routes[name]) {
          delete this.options.routes[name];
          this.cache.cache.delete(name);
          this.log(`Route "${name}" removed`);
          this.trigger('fear:router:route-removed', { name });
        }
        return this;
      }

  reload: () => {
        if (this.currentRoute) {
          const route = this.options.routes[this.currentRoute];
          if (route) {
            // Clear cache for this route
            this.cache.cache.delete(this.currentRoute);
            route.html = null;
            this.loadRoute(route);
          }
        }
        return this;
      }

  clearCache: () => {
        this.cache.clear();
        this.log('Cache cleared');
        return this;
      },

      getMetrics: () => {
        return this.performance.getMetrics();
      }

  getCurrentRoute() {
        return this.currentRoute;
      }

  getPreviousRoute() {
        return this.previousRoute;
      }

  isReady() {
        return this.initialized && !this.isNavigating;
      }

  // Event system
  trigger(eventName, data = {}) {
        this.$element.trigger(eventName, [data, this]);
      }

  on(eventName, handler) {
        this.$element.on(eventName, handler);
        return this;
      }

  off(eventName, handler) {
        this.$element.off(eventName, handler);
        return this;
      }

  // Cleanup
  destroy: () => {
        this.log('Destroying router instance');

        // Remove event listeners
        $(window).off(`.${PLUGIN_NAME}`);
        this.$element.off(`.${PLUGIN_NAME}`);

        // Clear caches and promises
        this.cache.clear();
        this.loadingPromises.clear();
        this.retryAttempts.clear();

        // Remove accessibility elements
        if (this.$announcer) {
          this.$announcer.remove();
        }

        // Trigger destroy callback
        if (this.options.callbacks.onDestroy) {
          this.options.callbacks.onDestroy.call(this);
        }

        this.trigger('fear:router:destroy');

        // Clean up
        this.$element.removeData(DATA_KEY);
        this.initialized = false;

        return this;
      }
    }
  };

  $.extend(true, FearRouter.prototype, {
    init: () => {
      this.log('Initializing Fear Router v' + VERSION);

      try {
        this.setupContainer();
        this.setupAccessibility();
        this.setupEventListeners();
        this.preloadRoutes();

        // Handle initial route
        this.handleRoute();

        this.initialized = true;
        this.trigger('fear:router:init');

        if (this.options.callbacks.onInit) {
          this.options.callbacks.onInit.call(this);
        }

        this.log('Router initialized successfully');
      } catch (error) {
        this.handleError('Initialization failed: ' + error.message, error);
      }
    },

    setupContainer: () => {
      this.$container = this.$element.find(this.options.container);
      if (!this.$container.length) {
        this.$container = $('<div>').addClass('fear_container').appendTo(this.$element);
      }

      // Add ARIA attributes
      this.$container.attr({
        'role': 'main',
        'aria-live': 'polite',
        'aria-atomic': 'true'
      });
    },

    setupAccessibility: () => {
      if (this.options.accessibility.announceRouteChanges) {
        this.$announcer = $('<div>')
          .addClass('sr-only')
          .attr({
            'aria-live': 'assertive',
            'aria-atomic': 'true'
          })
          .appendTo(this.$element);
      }
    },

    setupEventListeners: () => {
      const routerNS = `.${PLUGIN_NAME}`;

      if (this.options.hashChange) {
        $(window).on(`hashchange${routerNS}`, this.handleHashChange);
      }

      if (this.options.pushState) {
        $(window).on(`popstate${routerNS}`, this.handlePopState);
      }

      // Handle navigation links
      this.$element.on(`click${routerNS}`, 'a[href^="#"]', (e) => {
        const hash = e.currentTarget.hash.substring(1);
        if (this.options.routes[hash]) {
          e.preventDefault();
          this.navigateTo(hash);
        }
      });

      // Handle retry buttons in error templates
      this.$element.on(`click${routerNS}`, '.retry-btn', (e) => {
        e.preventDefault();
        if (this.currentRoute) {
          this.reload();
        }
      });
    },

    updateMetadata: (route) => {
      if (this.options.seo.updateTitle && route.title) {
        document.title = route.title + this.options.seo.titleSuffix;
      }

      if (this.options.seo.updateMeta && route.meta) {
        // Update meta description
        if (route.meta.description) {
          let metaDesc = $('meta[name="description"]');
          if (!metaDesc.length) {
            metaDesc = $('<meta name="description">').appendTo('head');
          }
          metaDesc.attr('content', route.meta.description);
        }

        // Update other meta tags
        Object.entries(route.meta).forEach(([name, content]) => {
          if (name !== 'description') {
            let metaTag = $(`meta[name="${name}"]`);
            if (!metaTag.length) {
              metaTag = $(`<meta name="${name}">`).appendTo('head');
            }
            metaTag.attr('content', content);
          }
        });
      }
    },

    handleAccessibility: (route) => {
      if (this.options.accessibility.announceRouteChanges && this.$announcer) {
        this.$announcer.text(`Navigated to ${route.title || route.name}`);
      }

      if (this.options.accessibility.focusOnRouteChange) {
        // Focus on skip link or main content
        const $focusTarget = this.$element.find(this.options.accessibility.skipLinkSelector);
        if ($focusTarget.length) {
          $focusTarget.focus();
        } else {
          this.$container.attr('tabindex', '-1').focus();
        }
      }
    },

    initComponents: () => {
      // Trigger component initialization event
      this.trigger('fear:router:init-components');

      // Re-initialize any jQuery plugins or components in the new content
      if ($.fn.fearPortfolio) {
        this.$container.find('[data-fear-portfolio]').fearPortfolio();
      }
    },

    showLoading: () => {
      if (!this.options.loading.enabled) return;

      this.$loading = $(this.options.loading.template)
        .addClass('fear-loading-active')
        .appendTo(this.$container);

      this.loadingStartTime = Date.now();
    },

    hideLoading: () => {
      if (!this.$loading) return;

      const elapsed = Date.now() - this.loadingStartTime;
      const minTime = this.options.loading.minDisplayTime;

      if (elapsed < minTime) {
        setTimeout(() => {
          this.$loading.remove();
          this.$loading = null;
        }, minTime - elapsed);
      } else {
        this.$loading.remove();
        this.$loading = null;
      }
    },

    handleError: (message, error = null) => {
      this.log(message, 'error');

      if (this.options.errorHandling.showConsoleErrors && error) {
        console.error(error);
      }

      if (this.options.errorHandling.enabled) {
        const errorHtml = this.options.errorHandling.template.replace('{message}', message);
        this.$container.html(errorHtml);
      }

      this.trigger('fear:router:error', { message, error });

      if (this.options.callbacks.onError) {
        this.options.callbacks.onError.call(this, message, error);
      }
    },

    preloadRoutes: () => {
      if (!this.options.performance.preloadRoutes.length) return;

      this.options.performance.preloadRoutes.forEach((routeName) => {
        const route = this.options.routes[routeName];
        if (route && !route.html) {
          this.fetchRoute(route).catch(() => {
            // Silently handle preload errors
          });
        }
      });
    },
  });

// jQuery plugin wrapper
$.fn[PLUGIN_NAME] = function (options, ...args) {
  return this.each(function () {
    const $element = $(this);
    let instance = $element.data(DATA_KEY);

    // Initialize if not exists
    if (!instance) {
      if (typeof options === 'string') {
        throw new Error(`Cannot call method '${options}' before initialization`);
      }

      instance = new FearRouter(this, options);
      $element.data(DATA_KEY, instance);
      return;
    }

    // Handle method calls
    if (typeof options === 'string') {
      const method = options;

      if (method.charAt(0) === '_') {
        throw new Error(`Method '${method}' is private`);
      }

      if (typeof instance[method] !== 'function') {
        throw new Error(`Method '${method}' does not exist`);
      }

      const result = instance[method].apply(instance, args);
      return result !== undefined ? result : this;
    }

    // Update options
    if (typeof options === 'object') {
      instance.options = $.extend(true, instance.options, options);
    }
  });
};

// Plugin properties
$.fn[PLUGIN_NAME].Constructor = FearRouter;
$.fn[PLUGIN_NAME].version = VERSION;
$.fn[PLUGIN_NAME].defaults = DEFAULTS;

// Auto-initialize with data attributes
$(document).ready(() => {
  $('[data-fear-router]').each(function () {
    const $element = $(this);
    const options = $element.data('fear-router-options') || {};
    $element[PLUGIN_NAME](options);
  });
});

}) (jQuery, window, document);