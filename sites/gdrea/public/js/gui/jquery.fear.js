

const utils = {
    /* jQuery $.extend pointer */
    merge: $.extend,

    each: Object.prototype.forEach,

    has: Object.prototype.hasOwnProperty,

    slice: Array.prototype.slice,

    isObj: (obj) => $.isPlainObject(obj),

    isArr: (arr) => $.isArray(arr),

    isFunc: (obj) => !!(obj && obj.constructor && obj.call && obj.apply),

    isStr: (str) => typeof str === 'string',

    isType: (type, val, name) => {
        if (typeof val !== type) {
            return `Error :: ${name} must be of type ${type}`;
        }
    },

    hasArgs: (fn, idx = 1) => {
        const match = fn.toString().match(/\(([^)]*)\)/);
        const args = match ? match[1].match(/[^\s,]+/g) || [] : [];
        return args.length >= idx;
    },

    /**
     * Attach child object prototype to parent object prototype 
     *
     * @param child {object} - object to merge prototype 
     * @param parent {object} - parent object prototype 
     * @return child {object} - combined child & parent prototypes 
    **/
    inject: (child, parent) => {
        var key;

        for (key in parent) {

            if (utils.hasProp.call(parent, key)) {
                child[key] = parent[key];
            }
        }

        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;

        child.prototype = new ctor();
        child.__super__ = parent.prototype;

        return child;
    },
    /**
    * Check for retina display on device 
    *
    * @return boolean
    **/
    isRetina: () => {
        return (window.retina || window.devicePixelRatio > 1);
    },

    /**
    * Check if user agent is mobile device 
    *
    * @param agent {string} - user agent
    * @return {boolean} 
    **/
    isMobile: (agent) => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    },

    /**
    * Return number of keys in first level of object
    *
    * @param object - object to size
    * @return int
    **/
    getObjectSize: (obj) => {
        var total = 0, key;

        for (key in obj) {

            if (obj.hasOwnProperty(key)) {
                total += 1;
            }
        }

        return total;
    },

    /**
    * Convert passed unit to its equiv value in pixles 
    *
    * @param width {number} - size of the element to convert 
    * @param unit {string} - the unit to convert to pixels
    * @return {number} 
    **/
    getPxValue: (width, unit) => {
        var value;

        switch (unit) {
            case "em":
                value = this.convertToEm(width);
                break;

            case "pt":
                value = this.convertToPt(width);
                break;

            default:
                value = width;
        }

        return value;
    },

    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    *
    * @param min - int min number of range
    * @param max - int max number of range
    * @return int
    **/
    rand: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
    * Returns list of argument names from   
    *
    * @param fn { } - the   to get arguments from 
    * @return {array}  
    **/
    args: (fn) => {
        var ref;

        return ((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null ? ref[1] : void 0 : void 0) || '').match(utils.argRgx) || [];
    },

    /**
    * Use to resize elemen to match window size 
    *
    * @param $el {object} - jQuery wrapped element to resize 
    * @return void
    **/
    resize: ($el) => {
        if (!$el.height) {
            $el = $($el);
        }
        $(() => {

            $(window).resize(() => {

                $el.height($(window).height());

            });

            $(window).resize();
        });
    },

    /**
    * Called in controllers to add to turn strings into slugs for image upload
    *
    * @param event title - of title to turn to string for insertion into URI
    * @return void
    **/
    slugify: (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },

    /**
    * Copy an Array or Object and return new instance 
    *
    * @param data {various} - the array / object to clone (copy) 
    * @return copy {various} - the new array / object 
    **/
    clone: (data) => {
        var copy, k, v;

        if (data instanceof Array) {

            copy = (() => {
                var i, len, results;

                results = [];
                for (i = 0, len = data.length; i < len; i++) {

                    v = data[i];
                    results.push(v);
                }

                return results;

            })();

        } else {
            copy = {};

            for (k in data) {
                v = data[k];
                copy[k] = v;
            }
        }

        return copy;
    },

    /**
    * Compute passed value to em 
    *
    * @return {number} - computed em value 
    **/
    convertToEm: (value) => {
        return value * this.getFontsize();
    },

    /**
    * Compute passed value to point 
    *
    * @return {number} - computed point value 
    **/
    convertToPt: (value) => {

    },

    /**
    * Get computed fontsize from created element in pixels
    *
    * @return base {number} - computed fontsize
    **/
    convertBase: () => {
        var elem = document.createElement(),
            style = elem.getAttribute('style');

        elem.setAttribute('style', style + ';font-size:1em !important');
        elem.setAttribute('style', style);

        base = this.getFontsize();

        return base;
    },

    /**
    * Mix properties of two objects, optional to override property names 
    *
    * @param giv {object} - object to give properties
    * @param rec {object} - object to recieve givers properties
    * @param override {boolean} - optional arg to replace existing property keys
    * @return results {array} - new array of mixed object properties and values 
    **/
    mix: (giv, rec, override) => {
        var k, results, v;

        if (override === true) {
            results = [];

            for (k in giv) {
                v = giv[k];
                results.push(rec[k] = v);
            }

            return results;

        } else {

            for (k in giv) {
                v = giv[k];

                if (!rec.hasOwnProperty(k)) {
                    results.push(rec[k] = v);
                }
            }

            return results;
        }
    },

    /**
    * Mix various object /   combinations 
    *
    * @param input {various} - input class to give properties 
    * @param output {various} - receiving class to retain mixed properties 
    * @param override {boolean} - override property names with new values
    * @return { } - mix 
    **/
    mixin: function (input, output, override) {
        if (!override || override === null) {
            override = false;
        }

        switch ((typeof output) + "-" + (typeof input)) {
            case " - ":
                return this.mix(output.prototype, input.prototype, override);

            case " -object":
                return this.mix(output.prototype, input, override);

            case "object-object":
                return this.mix(output, input, override);

            case "object- ":
                return this.mix(output, input.prototype, override);
        }
    },

    /**
    * Generate random unique identifier string
    *
    * @param length {number} - how long the random string should be
    * @return id {string} - unique identifier 
    **/
    unique: (length) => {
        var id = '';
        if (!length || length === null) length = 8;
        while (id.length < length) {
            id += Math.random().toString(36).substr(2);
        }
        return id.substr(0, length);
    },

    /**
     * Task Runner Object 
     * @return Promise
     */
    run: {
        series: (tasks = []) => {
            if (!tasks.length) return Promise.resolve([]);

            return tasks.reduce((p, task, idx) =>
                p.then(results =>
                    Promise.resolve(task())
                        .then(r => [...results, r])
                        .catch(err => {
                            const error = new Error(`Task ${idx} failed`);
                            error.originalError = err;
                            throw error;
                        })
                ),
                Promise.resolve([])
            );
        },

        parallel: (tasks = []) => {
            if (!tasks.length) return Promise.resolve([]);
            return Promise.all(tasks.map(t => Promise.resolve(t())));
        },

        first: (tasks = []) => {
            if (!tasks.length) return Promise.resolve(null);
            return tasks[0]().catch(() => {
                if (tasks.length > 1) {
                    return utils.run.first(tasks.slice(1));
                }
                throw new Error('All tasks failed');
            });
        }
    }
};

// src/broker.js - Event Broker Module

/**
 * Create a new EventBroker instance
 * @param {Object} options - Configuration options
 * @param {boolean} options.cascade - Enable cascading events to parent this.channels
 * @param {boolean} options.fireOrigin - Use original origin in cascaded events
 * @param {boolean} options.debug - Enable debug logging
 * @returns {Object} Broker this
 */
const Broker = function(options = {}) {
  const broker = this;
  this.channels = {};
  this.cascade = options.cascade || false;
  this.fireOrigin = options.fireOrigin || false;
  this.debug = options.debug || false;

  // ==================== Private Methods ====================
  this._delete = (channel, callback, context) => {
    if (!this.channels[channel]) return [];

    const originalLength = this.channels[channel].length;

    this.channels[channel] = this.channels[channel].filter(sub => {
      if (callback && sub.callback === callback) return false;
      if (context && sub.context === context) return false;
      if (!callback && !context && sub.context === this) return false;
      return true;
    });

    const removed = originalLength - this.channels[channel].length;
    if (removed > 0) {
      utils.log(`Removed ${removed} subscription(s) from '${channel}'`);
    }

    return this.channels[channel];
  };

  this._setupTasks = (data, channel, origin) => {
    const subscribers = this.channels[channel] || [];

    return subscribers.map(sub => () => {
      return new Promise((resolve, reject) => {
        try {
          // Check if callback expects a callback parameter (async style)
          if (utils.hasArgs(sub.callback, 3)) {
            sub.callback.call(sub.context, data, origin, (err, result) => {
              err ? reject(err) : resolve(result);
            });
          } else {
            const result = sub.callback.call(sub.context, data, origin);

            // Handle promise-returning callbacks
            if (result && typeof result.then === 'function') {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  this._formatErrors = (errors) => {
    if (utils.isArr(errors)) {
      const messages = errors
        .filter(x => x != null)
        .map(x => x.message || String(x));

      const error = new Error(messages.join('; '));
      error.originalErrors = errors;
      return error;
    }
    return errors;
  };

  // ==================== Public this ====================

  return {
    create: () => new Broker(),
    /**
     * Subscribe to a channel
     */
    add: (channel, callback, context) => {
      if (typeof channel !== 'string') {
        throw new Error('Channel must be a string');
      }

      if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
      }

      if (!this.channels[channel]) {
        this.channels[channel] = [];
      }

      const subscription = {
        event: channel,
        context: context || this,
        callback: callback
      };

      this.channels[channel].push(subscription);

      return this;
    },

    /**
     * Unsubscribe from this.channels
     */
    remove: (channel, callback, context) => {
      const type = typeof channel;

      switch (type) {

        case 'string':
          if (typeof callback === 'function') {
            this._delete(channel, callback, context);
          } else if (callback === undefined) {
            this._delete(channel);
          }

        case 'function':
          Object.keys(this.channels).forEach(id => {
            _this._delete(id, channel);
          });

        case 'undefined':
          this.clear();

        case channel !== null:
          Object.keys(this.channels).forEach(id => {
            this._delete(id, null, channel);
          });
      } 

      return this;
    },

    /**
     * Subscribe to a channel for one-time execution
     */
    once(channel, callback, context) {
      if (typeof channel !== 'string') {
        throw new Error('Channel must be a string');
      }

      if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
      }

      let fired = false;

      const onceWrapper = (...args) => {
        if (!fired) {
          fired = true;
          this.remove(channel, onceWrapper);
          return callback.apply(context || this, args);
        }
      };

      return this.add(channel, onceWrapper, context);
    },

    /**
     * Remove all subscriptions
     */
    clear() {
      Object.keys(this.channels).forEach(k => delete this.channels[k]);
      log('All this.channels cleared');
      return this;
    },

    /**
     * Fire event on channel (first successful handler wins)
     */
    fire(channel, data) {
      if (typeof channel !== 'string') {
        return Promise.reject(new Error('Channel must be a string'));
      }

      if (typeof data === 'function') {
        data = undefined;
      }

      const tasks = broker._setupTasks(data, channel, channel);

      if (tasks.length === 0) {
        return Promise.resolve(null);
      }

      return utils.run.first(tasks)
        .catch(errors => {
          throw broker._formatErrors(errors);
        });
    },

    /**
     * Emit event on channel (all handlers execute in series)
     */
    emit(channel, data, origin) {
      if (typeof channel !== 'string') {
        return Promise.reject(new Error('Channel must be a string'));
      }

      if (data && utils.isFunc(data)) {
        data = undefined;
      }

      origin = origin || channel;
      const tasks = broker._setupTasks(data, channel, origin);

      return utils.run.series(tasks)
        .then(result => {
          // Handle cascading to parent this.channels
          if (broker.cascade) {
            
            const segments = channel.split('/');
            
            if (segments.length > 1) {
              const parentChannel = segments.slice(0, -1).join('/');
              const cascadeOrigin = fireOrigin ? origin : parentChannel;
              
              return this
                .emit(parentChannel, data, cascadeOrigin)
                .then(() => result);
            }
          }
          return result;
        })
        .catch(errors => {
          throw broker._formatErrors(errors);
        });
    },

    /**
     * Wait for an event to be fired
     */
    waitFor(channel, timeout) {
      return new Promise((resolve, reject) => {
        let timeoutId;

        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId);
        };

        if (timeout && timeout > 0) {
          timeoutId = setTimeout(() => {
            this.remove(channel, handler);
            reject(new Error(`Timeout waiting for event '${channel}' after ${timeout}ms`));
          }, timeout);
        }

        const handler = (data, origin) => {
          cleanup();
          this.remove(channel, handler);
          resolve({ data, origin, channel });
        };

        this.add(channel, handler);
      });
    },

    /**
     * Pipe events from one channel to another
     */
    pipe(source, target, broker) {
      // Handle parameter variations
      if (target && (target.fire || target.emit)) {
        broker = target;
        target = source;
      }

      if (!broker) {
        broker = this;
      }

      // Prevent circular pipes
      if (broker === this && source === target) {
        return this;
      }

      this.add(source, (...args) => broker.fire(target, ...args));

      return this;
    },

    /**
     * Create a namespaced broker interface
     */
    namespace(namespace) {
      const separator = '/';
      const prefix = namespace + separator;

      return {
        add: (channel, fn, context) =>
          this.add(prefix + channel, fn, context),
        remove: (channel, cb, context) =>
          this.remove(prefix + channel, cb, context),
        fire: (channel, data) =>
          this.fire(prefix + channel, data),
        emit: (channel, data, origin) =>
          this.emit(prefix + channel, data, origin),
        once: (channel, fn, context) =>
          this.once(prefix + channel, fn, context),
        waitFor: (channel, timeout) =>
          this.waitFor(prefix + channel, timeout),
        pipe: (src, target, broker) =>
          this.pipe(prefix + src, prefix + target, broker),
        getSubscriberCount: (channel) =>
          this.getSubscriberCount(prefix + channel),
        clear: () => {
          const channelKeys = Object.keys(this.channels);
          channelKeys.forEach(ch => {
            if (ch.startsWith(prefix)) {
              delete this.channels[ch];
            }
          });
          return this;
        }
      };
    },

    /**
     * Install broker methods on target object
     */
    install: (target, forced = false) => {
      if (!utils.isObj(target)) {
        return this;
      }

      Object.keys(this).forEach(key => {
        const value = this[key];
        if (typeof value === 'function' && (forced || !target[key])) {
          target[key] = value.bind(this);
        }
      });

      return this;
    },

    /**
     * Get all active this.channels
     */
    getchannels: () => {
      return Object.keys(this.channels).filter(channel =>
        this.channels[channel] && this.channels[channel].length > 0
      );
    },

    /**
     * Get subscriber count for a channel
     */
    getSubscriberCount: (channel) => {
      return (this.channels[channel] && this.channels[channel].length) || 0;
    }
  };
};

const createBroker = new Broker().create();

/**
 * Create a module registry with event support
 * @param {Object} options - Global configuration options
 * @returns {Object} Registry API
 */

const Registry = function (options = {}) {
    const modules = new Map();
    const broker = new Broker();

    let globalOptions = options;

    const register = (name, instance) => {
      if (!name || typeof name !== 'string') {
        throw new Error('Module name must be a non-empty string');
      }

      modules.set(name, instance);
      broker.add(`module:${name}`, () => ({ name, instance }));

      broker.emit('module:registered', { name, instance })
        .then(() => {
          console.log(`Module registered: ${name}`);
        })
        .catch(err => {
          console.error('Error registering module:', err);
        });

      return instance;
    };

    const unregister = (name) => {
      if (!modules.has(name)) {
        return false;
      }

      const module = modules.get(name);

      // Call destroy if available
      if (module && typeof module.destroy === 'function') {
        try {
          module.destroy();
        } catch (err) {
          console.error(`Error destroying module ${name}:`, err);
        }
      }

      modules.delete(name);
      broker.remove(`module:${name}`);

      broker.emit('module:unregistered', { name })
        .catch(err => {
          console.error('Error emitting unregister event:', err);
        });

      console.log(`Module unregistered: ${name}`);
      return true;
    };

    const get = (name) => modules.get(name);

    const has = (name) => modules.has(name);

    const list = () => Array.from(modules.keys());

    const clear = () => {
      const names = list();
      names.forEach(name => unregister(name));
      modules.clear();
    };

    const setGlobal = (opts) => {
      globalOptions = utils.isObj(opts)
        ? utils.merge({}, globalOptions, opts)
        : globalOptions;
      return globalOptions;
    };

    const getGlobal = () => globalOptions;

    const on = (event, callback, context) =>
      broker.add(event, callback, context);

    const off = (event, callback, context) =>
      broker.remove(event, callback, context);

    const emit = (event, data) =>
      broker.emit(event, data);

    const fire = (event, data) =>
      broker.fire(event, data);

    const api = {
      create: () => api,
      register,
      unregister,
      get,
      has,
      list,
      clear,
      setGlobal,
      getGlobal,
      on,
      off,
      emit,
      fire,
      broker
    };

    return api;
};

const createRegistry = () => new Registry().create();

const SandBox = function () {
    const DELIM = '__';

    return {
        /**
         * Factory method to create a new sandbox instance
         * 
         * @param $gui {object} - GUI instance
         * @param instance {string} - Unique instance identifier
         * @param options {object} - Configuration options
         * @param module {string} - Module name
         * @return {object} - Configured sandbox instance
         */
        create: ($gui, instance, options = {}, module) => {
            const sandbox = {
                id: instance,
                module: module,
                options: options,
                utils
            };
            console.log('gui in sandbox = ', $gui);
            // Attach Broker methods to sandbox API
            $gui.broker.install(sandbox);
            sandbox.broker = $gui.broker;

            sandbox.add = $gui.broker.add.bind($gui.broker);
            sandbox.remove = $gui.broker.remove.bind($gui.broker);
            sandbox.emit = $gui.broker.emit.bind($gui.broker);
            sandbox.fire = $gui.broker.fire.bind($gui.broker);

            // jQuery utilities
            sandbox.data = $.data;
            sandbox.deferred = () => $.Deferred();
            sandbox.animation = $.Animation;

            /**
             * Promise-based fetch wrapper for jQuery.ajax
             */

            // jQuery fetch wrapper
            sandbox.fetch = (url, settings = {}) => {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: typeof url === 'string' ? url : url.url,
                        ...settings,
                        success: (data, textStatus, jqXHR) => resolve({ data, textStatus, jqXHR }),
                        error: (jqXHR, textStatus) => reject(new Error(textStatus || 'Ajax failed'))
                    });
                });
            };

            /**
             * Enhanced DOM query with native and jQuery helper methods
             */
            sandbox.query = (selector, context) => {
                const $el = context && context.find ? context.find(selector) : $(selector);

                $el.query = (sel) => sandbox.query(sel, $el);
                $el.create = (el) => document.createElement(el);
                $el.size = () => parseFloat(window.getComputedStyle($el[0] || $el).fontSize);

                $el.animateAsync = (properties, duration, easing) => {
                    return new Promise((resolve, reject) => {
                        try {
                            $el.animate(properties, {
                                duration: duration,
                                easing: easing,
                                complete: () => resolve($el),
                                fail: (error) => reject(error)
                            });
                        } catch (error) {
                            reject(error);
                        }
                    });
                };

                $el.onAsync = (event, selector) => {
                    return new Promise((resolve) => {
                        const handler = (e) => {
                            $el.off(event, selector, handler);
                            resolve(e);
                        };
                        if (selector) {
                            $el.on(event, selector, handler);
                        } else {
                            $el.on(event, handler);
                        }
                    });
                };

                return $el;
            };

            // Shorthand for query
            sandbox.$ = sandbox.query;

            /**
             * Promise-based timeout
             */
            sandbox.timeout = (ms, fn) => new Promise((resolve) => {
                setTimeout(() => resolve(fn && typeof fn === 'function' ? fn() : undefined), ms);
            });

            /**
             * Promise-based interval with cancellation support
             */
            sandbox.interval = (fn, ms, maxRuns) => {
                let intervalId;
                let runCount = 0;
                let stopped = false;

                const promise = new Promise((resolve, reject) => {
                    intervalId = setInterval(() => {
                        if (stopped) {
                            clearInterval(intervalId);
                            resolve(runCount);
                            return;
                        }

                        try {
                            fn();
                            runCount++;

                            if (maxRuns && runCount >= maxRuns) {
                                clearInterval(intervalId);
                                resolve(runCount);
                            }
                        } catch (error) {
                            clearInterval(intervalId);
                            reject(error);
                        }
                    }, ms);
                });

                return {
                    stop: () => {
                        stopped = true;
                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                    },
                    promise: promise
                };
            };

            /**
             * Function context binding with partial application
             */
            sandbox.hitch = (fn, ...initialArgs) => {
                return function (...args) {
                    const allArgs = initialArgs.concat(args);
                    return fn.apply(this, allArgs);
                };
            };

            /**
             * Memoization with Promise support
             */
            sandbox.memoize = (source, cache, refetch) => {
                cache = cache || {};

                return (...args) => {
                    const key = args.length > 1 ? args.join(DELIM) : String(args[0] || '');

                    if (!(key in cache) || (refetch && cache[key] === refetch)) {
                        const result = source.apply(source, args);

                        if (result && typeof result.then === 'function') {
                            cache[key] = result.catch(error => {
                                delete cache[key];
                                throw error;
                            });
                        } else {
                            cache[key] = result;
                        }
                    }

                    return cache[key];
                };
            };

            /**
             * Load multiple resources (CSS, JS, JSON)
             */
            sandbox.loadResources = (resources, options = {}) => {
                const resourceArray = Array.isArray(resources) ? resources : [resources];

                const loadPromises = resourceArray.map(resource => {
                    if (typeof resource === 'string') {
                        const url = resource;
                        const extension = url.split('.').pop().toLowerCase();

                        switch (extension) {
                            case 'css':
                                return sandbox.loadCSS(url);
                            case 'js':
                                return sandbox.loadScript(url);
                            case 'json':
                                return sandbox.fetch(url).then(response => response.data);
                            default:
                                return sandbox.fetch(url);
                        }
                    } else if (resource && resource.type && resource.url) {
                        switch (resource.type) {
                            case 'css':
                                return sandbox.loadCSS(resource.url);
                            case 'script':
                                return sandbox.loadScript(resource.url);
                            case 'json':
                                return sandbox.fetch(resource.url).then(response => response.data);
                            default:
                                return sandbox.fetch(resource.url);
                        }
                    }

                    return Promise.reject(new Error('Invalid resource format'));
                });

                return Promise.all(loadPromises);
            };

            /**
             * Load CSS file dynamically
             */
            sandbox.loadCSS = (url) => {
                return new Promise((resolve, reject) => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = url;

                    link.onload = () => resolve(link);
                    link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));

                    document.head.appendChild(link);
                });
            };

            /**
             * Load JavaScript file dynamically
             */
            sandbox.loadScript = (url) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;

                    script.onload = () => resolve(script);
                    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

                    document.head.appendChild(script);
                });
            };

            sandbox.getLocation = () => $gui.config.win && win.location;
            sandbox.log = (...args) => $gui.debug.log(...args);
            sandbox.warn = (...args) => $gui.debug.warn(...args);

            // Document/Window ready promises
            sandbox.ready = () => new Promise((resolve) => $(document).ready(resolve));
            sandbox.loaded = () => new Promise((resolve) => $(window).on('load', resolve));

            return sandbox;
        }
    };
};

// gui.js - Main entry point with functional design

const GUI = function () {
  const gui = this;
  
  this.config = { logLevel: 0, name: 'FEAR_GUI', version: '2.0.0' };
  
  this.debug = {
    history: [],
    level: this.config.logLevel,
    timeout: 5000,
    warn(...args) {
      if (gui.debug.level < 2) {
        console.warn('WARN:', ...args);
        gui.debug.history.push({ type: 'warn', args });
      }
    },
    log(...args) {
      if (gui.debug.level < 1) {
        console.log('Debug:', ...args);
        gui.debug.history.push({ type: 'log', args });
      }
    }
  };

  // GUI state
  this.state = {
    modules: {},
    plugins: [],
    instances: {},
    sandboxes: {},
    running: {},
    imports: []
  };

  // Create broker and event system
  this.broker = new Broker().create();
  this.registry = new Registry().create(this.config);
  this.utils = utils;

  // Private helpers
  const _runInstPlugins = (handler, $gui) => {
    const tasks = gui.state.plugins
      .filter(p => typeof p.plugin?.[handler] === 'function')
      .map(p => () => Promise.resolve(p.plugin[handler]($gui, p.options)));

    return utils.run.series(tasks);
  };

  const _createInst = (moduleId, opts) => {
    const id = opts.instanceId || moduleId;
    if (gui.state.instances[id]) {
      return Promise.resolve({ instance: gui.state.instances[id], options: opts.options });
    }

    const module = gui.state.modules[moduleId];
    const iOpts = { ...module.options, ...opts.options };

    const sb = SandBox().create(gui, id, iOpts, moduleId);

    return _runInstPlugins('load', sb)
      .then(() => {

        const instance = module.creator(sb);

        if (typeof instance.load !== 'function') {
          if (instance.fn && typeof instance.fn === 'function') {
            gui.plugin(instance, id);
            return { instance, options: iOpts };
          }
          throw new Error("module has no 'load' or 'fn' method");
        }

        gui.state.instances[id] = instance;
        gui.state.sandboxes[id] = sb;

        // Register instance in registry
        gui.registry.register(id, instance);
        return { instance, options: iOpts };
      });
  };

  const _startInst = (mods) => {
    if (!mods) mods = Object.keys(gui.state.modules);

    const tasks = mods.map(mid => () => gui.start(mid, gui.state.modules[mid].options));

    return utils.run.parallel(tasks);
  };

  // Public API
  this.configure = (options) => {
    if (options && utils.isObj(options)) {
      gui.config = utils.merge(gui.config, options);
      gui.registry.setGlobal(gui.config);
      gui.debug.level = gui.config.logLevel || 0;
    }

    return gui;
  };

  this.create = (id, creator, options = {}) => {
    const error = utils.isType('string', id, 'module ID') ||
      utils.isType('function', creator, 'creator') ||
      utils.isType('object', options, 'option parameter');

    if (error) {
      gui.debug.warn(`could not register module '${id}': ${error}`);
      return gui;
    }

    gui.state.modules[id] = { id, creator, options };
    return gui;
  };

  this.start = (moduleId, opt = {}) => {
    const id = opt.instanceId || moduleId;
    const error = utils.isType('string', moduleId, 'module ID') ||
      utils.isType('object', opt, 'second parameter') ||
      (!gui.state.modules[moduleId] ? "module doesn't exist" : undefined);

    if (!moduleId) return _startInst();

    if (utils.isArr(moduleId)) return _startInst(moduleId);

    if (utils.isFunc(moduleId)) return _startInst();

    if (error) return Promise.reject(new Error(error));

    if (gui.state.running[id] === true) {
      return Promise.reject(new Error('module was already started'));
    }

    return gui.boot()
      .then(() => _createInst(moduleId, opt))
      .then(({ instance, options }) => {
        if (instance.load && typeof instance.load === 'function') {
          const loadResult = instance.load(options);

          if (loadResult && typeof loadResult.then === 'function') {
            return loadResult.then(() => {
              gui.state.running[id] = true;
            });
          } else {
            gui.state.running[id] = true;
            return Promise.resolve();
          }
        } else {
          gui.state.running[id] = true;
          return Promise.resolve();
        }
      })
      .catch(err => {
        gui.debug.warn(err);
        throw new Error('could not start module: ' + err.message);
      });
  };

  this.stop = (id) => {
    if (arguments.length === 0 || typeof id === 'function') {
      const moduleIds = Object.keys(gui.state.instances);
      return utils.run.parallel(moduleIds.map(mid => () => gui.stop(mid)));
    }

    const instance = gui.state.instances[id];
    if (!instance) return Promise.resolve();

    delete gui.state.instances[id];
    gui.broker.remove(instance);
    gui.registry.unregister(id);

    return gui._runInstPlugins('unload', gui.state.sandboxes[id])
      .then(() => {
        if (instance.unload && typeof instance.unload === 'function') {
          const unloadResult = instance.unload();
          if (unloadResult && typeof unloadResult.then === 'function') {
            return unloadResult;
          }
        }
        return Promise.resolve();
      })
      .then(() => { delete gui.state.running[id]; });
  };

  this.use = (plugin, opt) => {
    if (utils.isArr(plugin)) {
      plugin.forEach(p => {
        if (utils.isFunc(p)) {
          gui.use(p);
        } else if (utils.isObj(p)) {
          gui.use(p.plugin, p.options);
        }
      });
    } else {
      if (!utils.isFunc(plugin)) {
        return gui;
      }

      gui.state.plugins.push({
        creator: plugin,
        options: opt
      });
    }

    return gui;
  };

  this.plugin = (plugin, module) => {
    if (plugin.fn && utils.isFunc(plugin.fn)) {
      $$1.fn[module.toLowerCase()] = function (options) {
        return new plugin.fn(this, options);
      };
    } else {
      gui.debug.log('Error :: Missing ' + plugin + ' fn() method.');
    }

    return gui;
  };

  this.boot = () => {
    const tasks = gui.state.plugins
      .filter(plugin => plugin.booted !== true)
      .map(plugin => () => {
        return new Promise((resolve, reject) => {
          try {
            if (utils.hasArgs(plugin.creator, 3)) {
              plugin.creator(gui, plugin.options, (err) => {
                if (err) {
                  reject(err);
                } else {
                  plugin.booted = true;
                  resolve();
                }
              });
            } else {
              plugin.plugin = plugin.creator(gui, plugin.options);
              plugin.booted = true;
              resolve();
            }
          } catch (err) {
            reject(err);
          }
        });
      });

    return utils.run.series(tasks);
  };

  this.attach = async (imports) => {
    gui.debug.log('Dynamic async module loading.');
    gui.debug.log('Imports:', imports);
  };

  return this;
};

const createGUI = () => new GUI();
new GUI();

const FEAR = createGUI();
/**
 * Performance Metrics Module
 * Monitors route loading times, cache performance, and module lifecycle events
 */
const Metrics = FEAR.create('Metrics', ($GUI) => {
  // Private state
  let monitor = null;
  let metricsInterval = null;
  let $metricsDisplay = null;

  // Performance Monitor Factory Function
  const createPerformanceMonitor = (enabled = true) => {
    const state = {
      enabled,
      metrics: {
        routeLoadTimes: new Map(),
        moduleLoadTimes: new Map(),
        totalRoutes: 0,
        totalModules: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
        startTime: Date.now()
      },
      timings: new Map()
    };

    const startTiming = (key) => {
      if (!state.enabled) return null;
      const startTime = performance.now();
      state.timings.set(key, startTime);
      return startTime;
    };

    const endTiming = (key) => {
      if (!state.enabled || !state.timings.has(key)) return 0;
      
      const startTime = state.timings.get(key);
      const duration = performance.now() - startTime;
      
      // Store the timing based on key type
      if (key.startsWith('route:')) {
        state.metrics.routeLoadTimes.set(key, duration);
        state.metrics.totalRoutes++;
      } else if (key.startsWith('module:')) {
        state.metrics.moduleLoadTimes.set(key, duration);
        state.metrics.totalModules++;
      }
      
      state.timings.delete(key);
      return duration;
    };

    const recordCacheHit = () => {
      if (state.enabled) {
        state.metrics.cacheHits++;
      }
    };

    const recordCacheMiss = () => {
      if (state.enabled) {
        state.metrics.cacheMisses++;
      }
    };

    const recordError = (error) => {
      if (state.enabled) {
        state.metrics.errors++;
        $GUI.log('Error recorded:', error);
      }
    };

    const getCacheHitRate = () => {
      const total = state.metrics.cacheHits + state.metrics.cacheMisses;
      return total > 0 ? (state.metrics.cacheHits / total * 100).toFixed(2) : 0;
    };

    const getAverageLoadTime = (type) => {
      const times = type === 'route' 
        ? state.metrics.routeLoadTimes 
        : state.metrics.moduleLoadTimes;
      
      if (times.size === 0) return 0;
      
      const sum = Array.from(times.values()).reduce((a, b) => a + b, 0);
      return (sum / times.size).toFixed(2);
    };

    const getMetrics = () => {
      return {
        ...state.metrics,
        routeLoadTimes: Array.from(state.metrics.routeLoadTimes.entries()),
        moduleLoadTimes: Array.from(state.metrics.moduleLoadTimes.entries()),
        uptime: Date.now() - state.metrics.startTime,
        cacheHitRate: getCacheHitRate(),
        averageRouteLoadTime: getAverageLoadTime('route'),
        averageModuleLoadTime: getAverageLoadTime('module')
      };
    };

    const reset = () => {
      state.metrics = {
        routeLoadTimes: new Map(),
        moduleLoadTimes: new Map(),
        totalRoutes: 0,
        totalModules: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
        startTime: Date.now()
      };
      state.timings.clear();
    };

    return {
      startTiming,
      endTiming,
      recordCacheHit,
      recordCacheMiss,
      recordError,
      getMetrics,
      getCacheHitRate,
      getAverageLoadTime,
      reset
    };
  };

  // Private helper functions
  const updateMetricsDisplay = () => {
    if (!$metricsDisplay || !monitor) return;

    const metrics = monitor.getMetrics();
    
    const html = `
      <div class="metrics-panel">
        <h3>Performance Metrics</h3>
        <div class="metric-item">
          <span class="label">Uptime:</span>
          <span class="value">${formatUptime(metrics.uptime)}</span>
        </div>
        <div class="metric-item">
          <span class="label">Total Routes:</span>
          <span class="value">${metrics.totalRoutes}</span>
        </div>
        <div class="metric-item">
          <span class="label">Total Modules:</span>
          <span class="value">${metrics.totalModules}</span>
        </div>
        <div class="metric-item">
          <span class="label">Avg Route Load:</span>
          <span class="value">${metrics.averageRouteLoadTime}ms</span>
        </div>
        <div class="metric-item">
          <span class="label">Avg Module Load:</span>
          <span class="value">${metrics.averageModuleLoadTime}ms</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Hit Rate:</span>
          <span class="value">${metrics.cacheHitRate}%</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Hits:</span>
          <span class="value">${metrics.cacheHits}</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Misses:</span>
          <span class="value">${metrics.cacheMisses}</span>
        </div>
        <div class="metric-item">
          <span class="label">Errors:</span>
          <span class="value">${metrics.errors}</span>
        </div>
      </div>
    `;
    
    $metricsDisplay.html(html);
  };

  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Module public interface
  return {
    /**
     * Initialize the metrics module
     */
    load: (options = {}) => {
      $GUI.log('Metrics module loading with options:', options);

      // Create performance monitor
      monitor = createPerformanceMonitor(options.enabled !== false);

      // Set up event listeners for performance tracking
      $GUI.add('route:start', (data) => {
        const routeKey = `route:${data.path || 'unknown'}`;
        monitor.startTiming(routeKey);
        $GUI.log('Route started:', routeKey);
      });

      $GUI.add('route:complete', (data) => {
        const routeKey = `route:${data.path || 'unknown'}`;
        const duration = monitor.endTiming(routeKey);
        $GUI.log(`Route completed: ${routeKey} in ${duration}ms`);
        
        // Emit metrics update
        $GUI.emit('metrics:updated', monitor.getMetrics());
      });

      $GUI.add('module:start', (data) => {
        const moduleKey = `module:${data.name || 'unknown'}`;
        monitor.startTiming(moduleKey);
        $GUI.log('Module started:', moduleKey);
      });

      $GUI.add('module:complete', (data) => {
        const moduleKey = `module:${data.name || 'unknown'}`;
        const duration = monitor.endTiming(moduleKey);
        $GUI.log(`Module loaded: ${moduleKey} in ${duration}ms`);
        
        // Emit metrics update
        $GUI.emit('metrics:updated', monitor.getMetrics());
      });

      $GUI.add('cache:hit', () => {
        monitor.recordCacheHit();
      });

      $GUI.add('cache:miss', () => {
        monitor.recordCacheMiss();
      });

      $GUI.add('error', (error) => {
        monitor.recordError(error);
      });

      // Optional UI display
      if (options.displayMetrics) {
        $metricsDisplay = $GUI.$('#metrics-display');
        
        if ($metricsDisplay.length === 0) {
          // Create metrics display if it doesn't exist
          $metricsDisplay = $GUI.$('<div id="metrics-display"></div>');
          $GUI.$('body').append($metricsDisplay);
        }

        // Update display periodically
        const updateInterval = options.updateInterval || 5000;
        metricsInterval = setInterval(() => {
          updateMetricsDisplay();
        }, updateInterval);
      }

      // Expose public API on $GUI
      $GUI.metrics = {
        start: (key) => monitor.startTiming(key),
        end: (key) => monitor.endTiming(key),
        cacheHit: () => monitor.recordCacheHit(),
        cacheMiss: () => monitor.recordCacheMiss(),
        recordError: (error) => monitor.recordError(error),
        get: () => monitor.getMetrics(),
        reset: () => monitor.reset()
      };

      $GUI.log('Metrics module loaded successfully');
      return Promise.resolve();
    },

    /**
     * Unload the metrics module
     */
    unload: () => {
      $GUI.log('Metrics module unloading');

      // Clear interval
      if (metricsInterval) {
        clearInterval(metricsInterval);
        metricsInterval = null;
      }

      // Remove UI display
      if ($metricsDisplay) {
        $metricsDisplay.remove();
        $metricsDisplay = null;
      }

      // Clean up $GUI API
      delete $GUI.metrics;

      return Promise.resolve();
    },

    /**
     * Destroy the metrics module
     */
    destroy: () => {
      $GUI.log('Metrics module destroying');
      
      if (monitor) {
        monitor.reset();
        monitor = null;
      }
    },

    /**
     * Get current metrics snapshot
     */
    getSnapshot: () => {
      return monitor ? monitor.getMetrics() : null;
    },

    /**
     * Reset all metrics
     */
    reset: () => {
      if (monitor) {
        monitor.reset();
        $GUI.emit('metrics:reset');
        $GUI.log('Metrics reset');
      }
    }
  };
}, {
  // Default module options
  enabled: true,
  displayMetrics: false,
  updateInterval: 5000
});

// example-usage.js - How to use the refactored FEAR GUI framework


  // $.GUI - Constructor function (creates new instances)
  $.FEAR = function(options) {
    const instance = createGUI();
    if (options) instance.configure(options);
    return instance;
  };

  // Expose utilities on constructor
  $.FEAR.utils = utils;
  $.FEAR.createBroker = createBroker;
  $.FEAR.createRegistry = createRegistry;
  $.FEAR.Metrics = Metrics;
  $.FEAR.version = '1.0.2';
  
  // $.gui - Singleton instance (auto-initialized)
  $.fear = createGUI();
  
  // Also expose as window.GUI for non-jQuery access
  window.FEAR = $.FEAR;
  window.fear = $.fear;

  /*
// ============================================
// 1. Initialize the GUI
// ============================================
const gui = createGUI(jQuery);

// Configure the GUI
gui.configure({
  logLevel: 1,
  name: 'MyApp',
  animations: true
});

// ============================================
// 2. Create a simple module
// ============================================
gui.create('myModule', (sandbox) => {
  return {
    load: (options) => {
      sandbox.log('Module loading with options:', options);
      
      // Use sandbox utilities
      const $button = sandbox.$('#myButton');
      
      // Add event listeners via broker
      sandbox.add('button:click', (data) => {
        sandbox.log('Button clicked with data:', data);
      });
      
      // Set up DOM interaction
      $button.on('click', () => {
        sandbox.emit('button:click', { timestamp: Date.now() });
      });
      
      return Promise.resolve();
    },
    
    unload: () => {
      sandbox.log('Module unloading');
      return Promise.resolve();
    }
  };
}, { defaultColor: 'blue' });

// ============================================
// 3. Create a module with async loading
// ============================================
gui.create('asyncModule', (sandbox) => {
  return {
    load: async (options) => {
      // Load external resources
      await sandbox.loadResources([
        'https://example.com/styles.css',
        { type: 'script', url: 'https://example.com/lib.js' }
      ]);
      
      // Fetch data
      const response = await sandbox.fetch('/api/data');
      sandbox.log('Data loaded:', response.data);
      
      // Use memoized function
      const expensiveOperation = sandbox.memoize((x) => {
        return x * x * x;
      });
      
      const result1 = expensiveOperation(5); // Calculated
      const result2 = expensiveOperation(5); // Cached
      
      return Promise.resolve();
    },
    
    unload: () => {
      sandbox.log('Async module unloading');
    }
  };
});

// ============================================
// 4. Create a plugin
// ============================================
const myPlugin = (gui, options) => {
  gui.debug.log('Plugin initialized with options:', options);
  
  return {
    load: (sandbox, pluginOptions) => {
      // Add custom methods to sandbox
      sandbox.customMethod = () => {
        sandbox.log('Custom plugin method called');
      };
    },
    
    unload: (sandbox) => {
      delete sandbox.customMethod;
    }
  };
};

gui.use(myPlugin, { setting: 'value' });

// ============================================
// 5. Use the event broker
// ============================================

// Subscribe to events
gui.broker.add('app:ready', (data) => {
  console.log('App is ready!', data);
});

// Create namespaced broker
const userEvents = gui.broker.namespace('user');

userEvents.add('login', (userData) => {
  console.log('User logged in:', userData);
});

userEvents.add('logout', () => {
  console.log('User logged out');
});

// Emit events
gui.broker.emit('app:ready', { version: '1.0.0' });
userEvents.emit('login', { id: 123, name: 'John' });

// Wait for an event with timeout
gui.broker.waitFor('data:loaded', 5000)
  .then(({ data, channel }) => {
    console.log('Data loaded:', data);
  })
  .catch((err) => {
    console.error('Timeout:', err.message);
  });

// ============================================
// 6. Use the registry for module management
// ============================================
const registry = createRegistry({ appName: 'MyApp' });

// Register modules
registry.register('userService', {
  getUser: (id) => fetch(`/api/users/${id}`),
  createUser: (data) => fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  destroy: () => console.log('User service destroyed')
});

// Listen to registry events
registry.on('module:registered', ({ name, instance }) => {
  console.log(`Module registered: ${name}`);
});

// Get a registered module
const userService = registry.get('userService');
await userService.getUser(123);

// List all modules
const allModules = registry.list();
console.log('Registered modules:', allModules);

// ============================================
// 7. Start modules
// ============================================

// Start a single module
await gui.start('myModule', { color: 'red' });

// Start multiple modules
await gui.start(['myModule', 'asyncModule']);

// Start all registered modules
await gui.start();

// ============================================
// 8. Stop modules
// ============================================

// Stop a specific module
await gui.stop('myModule');

// Stop all modules
await gui.stop();

// ============================================
// 9. Advanced: Piping events between brokers
// ============================================
const broker1 = gui.Broker();
const broker2 = gui.Broker();

// Pipe events from broker1 to broker2
broker1.pipe('source:event', 'target:event', broker2);

broker2.add('target:event', (data) => {
  console.log('Received piped event:', data);
});

broker1.emit('source:event', { message: 'Hello' });

// ============================================
// 10. Utility functions
// ============================================

// Use Utils for common operations
const uniqueId = Utils.unique(12);
const slug = Utils.slugify('Hello World 123');
const randomNum = Utils.rand(1, 100);
const clonedObj = Utils.clone({ a: 1, b: 2 });

// Run async tasks
const tasks = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
];

// Run in series
const seriesResults = await Utils.run.series(tasks);
console.log('Series:', seriesResults); // [1, 2, 3]

// Run in parallel
const parallelResults = await Utils.run.parallel(tasks);
console.log('Parallel:', parallelResults); // [1, 2, 3]

// Run first successful
const firstResult = await Utils.run.first(tasks);
console.log('First:', firstResult); // 1

// ============================================
// 11. Complete example with all features
// ============================================
gui.create('completeExample', (sandbox) => {
  let intervalController;
  
  return {
    load: async (options) => {
      // Wait for DOM ready
      await sandbox.ready();
      
      // Query DOM elements
      const $container = sandbox.$('#app-container');
      const $button = $container.query('.action-button');
      
      // Add event broker listeners
      sandbox.add('data:update', (newData) => {
        sandbox.log('Data updated:', newData);
        $container.html(`<p>Data: ${newData.value}</p>`);
      });
      
      // Set up interval with promise
      intervalController = sandbox.interval(() => {
        sandbox.emit('tick', { time: Date.now() });
      }, 1000, 10); // Run 10 times
      
      // Wait for animation complete
      await $button.animateAsync({ opacity: 1 }, 300);
      
      // Set up one-time event listener
      await $button.onAsync('click');
      sandbox.log('Button was clicked!');
      
      // Fetch data with timeout
      await sandbox.timeout(1000);
      const response = await sandbox.fetch('/api/init');
      
      return Promise.resolve();
    },
    
    unload: () => {
      // Clean up
      if (intervalController) {
        intervalController.stop();
      }
      return Promise.resolve();
    }
  };
});

// Start the complete example
await gui.start('completeExample');
*/
