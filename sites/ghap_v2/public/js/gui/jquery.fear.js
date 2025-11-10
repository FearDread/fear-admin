
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
 * @param {boolean} options.cascade - Enable cascading events to parent channels
 * @param {boolean} options.fireOrigin - Use original origin in cascaded events
 * @param {boolean} options.debug - Enable debug logging
 * @returns {Object} Broker instance
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
        // Check if callback expects a callback parameter (async style)
        if (utils.hasArgs(sub.callback, 3)) {
          sub.callback.call(sub.context, data, origin, (err, result) => {
            err ? reject(err) : resolve(result);
          });
        } else {
          const result = sub.callback.call(sub.context, data, origin);

          // Handle promise-returning callbacks
          if (result && typeof result.then === 'function') {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        }
      }).catch(error => Promise.reject(error));
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

  // ==================== Public API ====================

  this.create = () => new Broker();

  /**
   * Subscribe to a channel
   */
  this.add = function(channel, callback, context) {
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
  };

  /**
   * Unsubscribe from channels
   */
  this.remove = function(channel, callback, context) {
    const type = typeof channel;

    switch (type) {
      case 'string':
        if (typeof callback === 'function') {
          this._delete(channel, callback, context);
        } else if (callback === undefined) {
          this._delete(channel);
        }
        break;

      case 'function':
        Object.keys(this.channels).forEach(id => {
          this._delete(id, channel);
        });
        break;

      case 'undefined':
        this.clear();
        break;

      case 'object':
        if (channel !== null) {
          Object.keys(this.channels).forEach(id => {
            this._delete(id, null, channel);
          });
        }
        break;
    }

    return this;
  };

  /**
   * Subscribe to a channel for one-time execution
   */
  this.once = function(channel, callback, context) {
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
  };

  /**
   * Remove all subscriptions
   */
  this.clear = function() {
    Object.keys(this.channels).forEach(k => delete this.channels[k]);
    utils.log('All channels cleared');
    return this;
  };

  /**
   * Fire event on channel (first successful handler wins)
   */
  this.fire = function(channel, data) {
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
  };

  /**
   * Emit event on channel (all handlers execute in series)
   */
  this.emit = function(channel, data, origin) {
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
        // Handle cascading to parent channels
        if (broker.cascade) {
          const segments = channel.split('/');

          if (segments.length > 1) {
            const parentChannel = segments.slice(0, -1).join('/');
            const cascadeOrigin = broker.fireOrigin ? origin : parentChannel;

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
  };

  /**
   * Wait for an event to be fired
   */
  this.waitFor = function(channel, timeout) {
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
  };

  /**
   * Pipe events from one channel to another
   */
  this.pipe = function(source, target, broker) {
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
  };

  /**
   * Create a namespaced broker interface
   */
  this.namespace = function(namespace) {
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
  };

  /**
   * Install broker methods on target object
   */
  this.install = function(target, forced = false) {
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
  };

  /**
   * Get all active channels
   */
  this.getChannels = function() {
    return Object.keys(this.channels).filter(channel =>
      this.channels[channel] && this.channels[channel].length > 0
    );
  };

  /**
   * Get subscriber count for a channel
   */
  this.getSubscriberCount = function(channel) {
    return (this.channels[channel] && this.channels[channel].length) || 0;
  };

  return this;
};

new Broker().create();

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

const SandBox = function() {
  const DELIM = '__';

  this.create = function($gui, instance, options = {}, module) {
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
    sandbox.query = function(selector, context) {
      const $el = context && context.find ? context.find(selector) : $(selector);

      $el.query = (sel) => sandbox.query(sel, $el);
      $el.create = (el) => document.createElement(el);
      $el.size = () => parseFloat(window.getComputedStyle($el[0] || $el).fontSize);

      $el.animateAsync = (properties, duration, easing) => {
        return new Promise((resolve, reject) => {
          $el.animate(properties, {
            duration: duration,
            easing: easing,
            complete: () => resolve($el),
            fail: (error) => reject(error)
          });
        }).catch(error => Promise.reject(error));
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

          Promise.resolve()
            .then(() => fn())
            .then(() => {
              runCount++;

              if (maxRuns && runCount >= maxRuns) {
                clearInterval(intervalId);
                resolve(runCount);
              }
            })
            .catch(error => {
              clearInterval(intervalId);
              reject(error);
            });
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
    sandbox.hitch = function(fn, ...initialArgs) {
      return function(...args) {
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
              return Promise.reject(error);
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

    sandbox.getLocation = () => $gui.config.win && $gui.config.win.location;
    sandbox.log = (...args) => $gui.debug.log(...args);
    sandbox.warn = (...args) => $gui.debug.warn(...args);

    // Document/Window ready promises
    sandbox.ready = () => new Promise((resolve) => $(document).ready(resolve));
    sandbox.loaded = () => new Promise((resolve) => $(window).on('load', resolve));

    return sandbox;
  };

  return this;
};

// gui.js - Main entry point with functional design

const GUI = function() {
  const gui = this;

  this.config = { logLevel: 0, name: 'FEAR$1_GUI', version: '2.0.0' };

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

    const sb = new SandBox().create(gui, id, iOpts, moduleId);

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
  this.configure = function(options) {
    if (options && utils.isObj(options)) {
      gui.config = utils.merge(gui.config, options);
      gui.registry.setGlobal(gui.config);
      gui.debug.level = gui.config.logLevel || 0;
    }

    return gui;
  };

  this.create = function(id, creator, options = {}) {
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

  this.start = function(moduleId, opt = {}) {
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

  this.stop = function(id) {
    if (arguments.length === 0 || typeof id === 'function') {
      const moduleIds = Object.keys(gui.state.instances);
      return utils.run.parallel(moduleIds.map(mid => () => gui.stop(mid)));
    }

    const instance = gui.state.instances[id];
    if (!instance) return Promise.resolve();

    delete gui.state.instances[id];
    gui.broker.remove(instance);
    gui.registry.unregister(id);

    return _runInstPlugins('unload', gui.state.sandboxes[id])
      .then(() => {
        if (instance.unload && typeof instance.unload === 'function') {
          const unloadResult = instance.unload();
          if (unloadResult && typeof unloadResult.then === 'function') {
            return unloadResult;
          }
        }
        return Promise.resolve();
      })
      .then(() => {
        delete gui.state.running[id];
      });
  };

  this.use = function(plugin, opt) {
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

  this.plugin = function(plugin, module) {
    if (plugin.fn && utils.isFunc(plugin.fn)) {
      $$1.fn[module.toLowerCase()] = function(options) {
        return new plugin.fn(this, options);
      };
    } else {
      gui.debug.log('Error :: Missing ' + plugin + ' fn() method.');
    }

    return gui;
  };

  this.boot = function() {
    const tasks = gui.state.plugins
      .filter(plugin => plugin.booted !== true)
      .map(plugin => () => {
        return new Promise((resolve, reject) => {
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
            Promise.resolve()
              .then(() => {
                plugin.plugin = plugin.creator(gui, plugin.options);
                plugin.booted = true;
                resolve();
              })
              .catch(err => reject(err));
          }
        });
      });

    return utils.run.series(tasks);
  };

  this.attach = function(imports) {
    return Promise.resolve()
      .then(() => {
        gui.debug.log('Dynamic async module loading.');
        gui.debug.log('Imports:', imports);
      });
  };

  return this;
};

const createGUI = () => new GUI();
const FEAR$1 = new GUI();
var FEAR$2 = { FEAR: FEAR$1, createGUI };

/**
 * Router Plugin
 * Handles client-side routing with hash navigation, route loading, and transitions
 */
const Router = function(options = {}) {
  const router = this;

  // Default configuration
  const DEFAULTS = {
    container: '#router-container',
    fragmentPath: '/fragments/',
    defaultRoute: 'home',
    pushState: true,
    hashNavigation: true,
    smoothScroll: true,
    scrollOffset: 0,
    activeClass: 'active',
    loading: {
      enabled: true,
      template: '<div class="router-loading">Loading...</div>',
      minDisplay: 300
    },
    animations: {
      enabled: true,
      fadeSpeed: 300
    },
    cache: {
      enabled: true,
      maxSize: 50,
      ttl: 3600000
    },
    performance: {
      trackMetrics: true
    },
    accessibility: {
      announceRoutes: true,
      focusContent: true
    },
    retry: {
      enabled: true,
      maxAttempts: 3,
      delay: 1000
    },
    callbacks: {
      beforeRouteChange: null,
      afterRouteChange: null,
      onRouteChange: null,
      onError: null,
      onDestroy: null
    },
    routes: {}
  };

  // Merge options with defaults
  this.options = FEAR$1.utils.merge({}, DEFAULTS, options);

  // Private state
  this.routes = this.options.routes;
  this.currentRoute = null;
  this.previousRoute = null;
  this.isNavigating = false;
  this.initialized = false;
  this.loadingPromises = new Map();
  this.retryAttempts = new Map();
  this.$container = null;
  this.$announcer = null;
  this.cache = new Map();
  this.cacheTimestamps = new Map();

  // Private methods
  this._handleHashChange = () => {
    if (!this.isNavigating) {
      const hash = window.location.hash.slice(1);
      const routeName = hash || this.options.defaultRoute;
      this._loadRoute(routeName);
    }
  };

  this._handlePopState = (e) => {
    const state = e.originalEvent?.state;
    if (state && state.route) {
      this._loadRoute(state.route);
    } else {
      this._handleHashChange();
    }
  };

  this._handleLinkClick = (e) => {
    const $link = $(e.currentTarget);
    const href = $link.attr('href');

    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = href.slice(1);

      if (router.options.smoothScroll) {
        router._scrollToSection(target);
      }

      router.navigate(target, true);
    }
  };

  this._loadRoute = function(routeName) {
    if (this.isNavigating) {
      console.warn('Navigation already in progress');
      return Promise.resolve();
    }

    const route = this.routes[routeName];
    if (!route) {
      console.warn(`Route "${routeName}" not found`);
      return Promise.reject(new Error(`Route not found: ${routeName}`));
    }

    this.isNavigating = true;

    return FEAR$1.broker.emit('route:start', { path: routeName })
      .then(() => {
        if (this.options.callbacks.beforeRouteChange) {
          return Promise.resolve(
            this.options.callbacks.beforeRouteChange.call(this, routeName, this.currentRoute)
          );
        }
      })
      .then(shouldContinue => {
        if (shouldContinue === false) {
          this.isNavigating = false;
          return Promise.reject(new Error('Route change cancelled'));
        }

        this.previousRoute = this.currentRoute;
        this.currentRoute = routeName;

        // Show loading if needed
        if (this.options.loading.enabled && !route.html) {
          this._showLoading();
        }

        // Load route content
        if (route.html) {
          return this._renderRoute(route);
        } else {
          return this._fetchRoute(route);
        }
      })
      .then(() => {
        console.log(`Route "${routeName}" loaded successfully`);
        return FEAR$1.broker.emit('route:complete', { path: routeName });
      })
      .catch(error => {
        this._handleError(`Failed to load route "${routeName}": ${error.message}`, error);
        return Promise.reject(error);
      })
      .then(() => {
        this.isNavigating = false;
        this._hideLoading();
      });
  };

  this._fetchRoute = function(route) {
    const cached = this._getCachedRoute(route.name);
    if (cached) {
      FEAR$1.broker.emit('cache:hit');
      route.html = cached;
      return this._renderRoute(route);
    }

    FEAR$1.broker.emit('cache:miss');

    // Check if already loading
    if (this.loadingPromises.has(route.name)) {
      return this.loadingPromises.get(route.name)
        .then(html => {
          route.html = html;
          return this._renderRoute(route);
        });
    }

    // Create loading promise
    const url = this.options.fragmentPath + (route.path || route.name + '.html');
    const loadingPromise = this._createLoadingPromise(url, route.name);

    this.loadingPromises.set(route.name, loadingPromise);

    return loadingPromise
      .then(html => {
        route.html = html;
        this._setCachedRoute(route.name, html);
        return this._renderRoute(route);
      })
      .then(() => {
        this.loadingPromises.delete(route.name);
      })
      .catch(error => {
        this.loadingPromises.delete(route.name);
        return Promise.reject(error);
      });
  };

  this._renderRoute = function(route) {
    const fadeSpeed = this.options.animations.enabled && !this._prefersReducedMotion()
      ? this.options.animations.fadeSpeed
      : 0;

    return new Promise((resolve, reject) => {
      this.$container.fadeOut(fadeSpeed, () => {
        Promise.resolve()
          .then(() => {
            // Update content
            this.$container.empty().html(route.html);

            // Update document metadata
            this._updateMetadata(route);

            return new Promise((res) => {
              // Fade in content
              this.$container.fadeIn(fadeSpeed, () => res());
            });
          })
          .then(() => {
            // Execute route callback
            if (route.callback && typeof route.callback === 'function') {
              return Promise.resolve(route.callback.call(this, route));
            }
          })
          .then(() => {
            this._initComponents();
            this._handleAccessibility(route);

            if (this.options.callbacks.afterRouteChange) {
              return Promise.resolve(
                this.options.callbacks.afterRouteChange.call(this, route.name, this.previousRoute)
              );
            }
          })
          .then(() => {
            if (this.options.callbacks.onRouteChange) {
              return Promise.resolve(
                this.options.callbacks.onRouteChange.call(this, route.name)
              );
            }
          })
          .then(() => {
            return FEAR$1.broker.emit('router:rendered', { route: route.name });
          })
          .then(() => resolve())
          .catch(error => {
            this._handleError(`Route callback error: ${error.message}`, error);
            resolve();
          });
      });
    });
  };

  this._createLoadingPromise = function(url, routeName) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        dataType: 'html',
        success: (data) => resolve(data),
        error: (jqXHR, textStatus, errorThrown) => {
          reject(new Error(textStatus || 'Failed to load route'));
        }
      });
    }).catch(error => {
      const attempts = this.retryAttempts.get(routeName) || 0;

      if (this.options.retry.enabled && attempts < this.options.retry.maxAttempts) {
        this.retryAttempts.set(routeName, attempts + 1);
        console.log(`Retrying route load (${attempts + 1}/${this.options.retry.maxAttempts})`);

        return new Promise((resolve) => {
          setTimeout(() => resolve(), this.options.retry.delay);
        }).then(() => this._createLoadingPromise(url, routeName));
      }

      this.retryAttempts.delete(routeName);
      return Promise.reject(error);
    });
  };

  this._getCachedRoute = function(routeName) {
    if (!this.options.cache.enabled) return null;

    const timestamp = this.cacheTimestamps.get(routeName);
    if (!timestamp) return null;

    const now = Date.now();
    if (now - timestamp > this.options.cache.ttl) {
      this.cache.delete(routeName);
      this.cacheTimestamps.delete(routeName);
      return null;
    }

    return this.cache.get(routeName);
  };

  this._setCachedRoute = function(routeName, html) {
    if (!this.options.cache.enabled) return;

    // Implement LRU cache
    if (this.cache.size >= this.options.cache.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.cacheTimestamps.delete(firstKey);
    }

    this.cache.set(routeName, html);
    this.cacheTimestamps.set(routeName, Date.now());
  };

  this._showLoading = function() {
    if (this.$container && this.options.loading.template) {
      this.$container.html(this.options.loading.template);
    }
  };

  this._hideLoading = function() {
    // Loading is automatically hidden during render
  };

  this._updateMetadata = function(route) {
    if (route.title) {
      document.title = route.title;
    }

    if (route.meta) {
      Object.keys(route.meta).forEach(name => {
        let $meta = $(`meta[name="${name}"]`);
        if ($meta.length === 0) {
          $meta = $('<meta>').attr('name', name);
          $('head').append($meta);
        }
        $meta.attr('content', route.meta[name]);
      });
    }
  };

  this._initComponents = function() {
    // Re-initialize components in the new content
    FEAR$1.broker.emit('components:init', { container: this.$container });
  };

  this._handleAccessibility = function(route) {
    if (!this.options.accessibility.announceRoutes) return;

    if (this.$announcer) {
      this.$announcer.text(`Navigated to ${route.title || route.name}`);
    }

    if (this.options.accessibility.focusContent) {
      this.$container.attr('tabindex', '-1').focus();
    }
  };

  this._scrollToSection = function(target) {
    const $target = $(`#${target}, [name="${target}"]`).first();

    if ($target.length) {
      const targetTop = $target.offset().top - this.options.scrollOffset;

      $('html, body').animate({
        scrollTop: targetTop
      }, 800);
    }
  };

  this._prefersReducedMotion = function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  this._handleError = function(message, error) {
    console.error(message, error);
    FEAR$1.broker.emit('error', { message, error });

    if (this.options.callbacks.onError) {
      this.options.callbacks.onError.call(this, error);
    }
  };

  this._updateActiveStates = function(routeName) {
    $(`a[href="#${routeName}"]`)
      .addClass(this.options.activeClass)
      .parent()
      .siblings()
      .find('a')
      .removeClass(this.options.activeClass);
  };

  // Public API
  this.init = function() {
    if (this.initialized) {
      console.warn('Router already initialized');
      return this;
    }

    this.$container = $(this.options.container);

    if (this.$container.length === 0) {
      console.error(`Container "${this.options.container}" not found`);
      return this;
    }

    // Create accessibility announcer
    if (this.options.accessibility.announceRoutes) {
      this.$announcer = $('<div>')
        .attr({
          'role': 'status',
          'aria-live': 'polite',
          'aria-atomic': 'true'
        })
        .addClass('sr-only')
        .appendTo('body');
    }

    // Bind event listeners
    if (this.options.hashNavigation) {
      $(window).on('hashchange.FEAR$1-router', this._handleHashChange);
    }

    if (this.options.pushState) {
      $(window).on('popstate.FEAR$1-router', this._handlePopState);
    }

    $(document).on('click.FEAR$1-router', 'a[href^="#"]', this._handleLinkClick);

    this.initialized = true;

    // Handle initial route
    const hash = window.location.hash.slice(1);
    const initialRoute = hash || this.options.defaultRoute;
    
    if (initialRoute) {
      this._loadRoute(initialRoute);
    }

    console.log('Router initialized');
    FEAR$1.broker.emit('router:ready');

    return this;
  };

  this.navigate = function(routeName, pushState = true) {
    if (this.isNavigating) {
      console.warn('Navigation already in progress');
      return this;
    }

    const route = this.routes[routeName];
    if (!route) {
      console.error(`Route "${routeName}" not found`);
      return this;
    }

    if (pushState && this.options.pushState) {
      const state = { route: routeName };
      history.pushState(state, route.title || '', `#${routeName}`);
    } else {
      window.location.hash = routeName;
    }

    this._updateActiveStates(routeName);

    return this;
  };

  this.addRoute = function(name, config) {
    this.routes[name] = {
      name,
      path: name + '.html',
      html: null,
      callback: null,
      title: name.charAt(0).toUpperCase() + name.slice(1),
      ...config
    };

    console.log(`Route "${name}" added`);
    FEAR$1.broker.emit('router:route-added', { name, config });
    return this;
  };

  this.removeRoute = function(name) {
    if (this.routes[name]) {
      delete this.routes[name];
      this.cache.delete(name);
      this.cacheTimestamps.delete(name);
      console.log(`Route "${name}" removed`);
      FEAR$1.broker.emit('router:route-removed', { name });
    }
    return this;
  };

  this.reload = function() {
    if (this.currentRoute) {
      const route = this.routes[this.currentRoute];
      if (route) {
        // Clear cache for this route
        this.cache.delete(this.currentRoute);
        this.cacheTimestamps.delete(this.currentRoute);
        route.html = null;
        this._loadRoute(this.currentRoute);
      }
    }
    return this;
  };

  this.clearCache = function() {
    this.cache.clear();
    this.cacheTimestamps.clear();
    console.log('Cache cleared');
    return this;
  };

  this.getCurrentRoute = function() {
    return this.currentRoute;
  };

  this.getPreviousRoute = function() {
    return this.previousRoute;
  };

  this.isReady = function() {
    return this.initialized && !this.isNavigating;
  };

  this.destroy = function() {
    console.log('Destroying router instance');

    // Remove event listeners
    $(window).off('.FEAR$1-router');
    $(document).off('.FEAR$1-router');

    // Clear caches and promises
    this.cache.clear();
    this.cacheTimestamps.clear();
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

    FEAR$1.broker.emit('router:destroy');

    this.initialized = false;

    return this;
  };

  // jQuery plugin interface
  this.fn = function($element, options) {
    return $element.each(function() {
      const $this = $(this);
      let instance = $this.data('FEAR$1-router');

      if (!instance) {
        instance = new Router({ ...options, container: this });
        $this.data('FEAR$1-router', instance);
        instance.init();
      }

      return instance;
    });
  };

  return this;
};

// mvc.js - Model-View-Controller framework
/**
 * Model factory - Observable state management
 */
const Model = function(data = {}) {
  const model = this;
  
  this._data = { ...data };
  this._listeners = new Map();
  this._computed = new Map();
  this._validators = new Map();

  /**
   * Get a property value
   */
  this.get = function(key) {
    if (model._computed.has(key)) {
      return model._computed.get(key).call(model);
    }
    return model._data[key];
  };

  /**
   * Set a property value with validation and change notification
   */
  this.set = function(key, value) {
    // Validate if validator exists
    if (model._validators.has(key)) {
      const validator = model._validators.get(key);
      const result = validator(value, model._data[key]);
      if (result !== true) {
        return Promise.reject(new Error(`Validation failed for ${key}: ${result}`));
      }
    }

    const oldValue = model._data[key];
    if (oldValue === value) return Promise.resolve(model);

    model._data[key] = value;
    model._notify(key, value, oldValue);
    model._notify('*', { key, value, oldValue });
    
    return Promise.resolve(model);
  };

  /**
   * Batch update multiple properties
   */
  this.update = function(data) {
    const keys = Object.keys(data);
    const tasks = keys.map(key => () => model.set(key, data[key]));
    return utils.run.series(tasks).then(() => model);
  };

  /**
   * Get all model data
   */
  this.toJSON = function() {
    return { ...model._data };
  };

  /**
   * Subscribe to property changes
   */
  this.on = function(key, callback) {
    if (!model._listeners.has(key)) {
      model._listeners.set(key, []);
    }
    model._listeners.get(key).push(callback);
    return () => model.off(key, callback);
  };

  /**
   * Unsubscribe from property changes
   */
  this.off = function(key, callback) {
    if (!model._listeners.has(key)) return;
    const listeners = model._listeners.get(key);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  /**
   * Define a computed property
   */
  this.computed = function(key, fn) {
    model._computed.set(key, fn);
    return model;
  };

  /**
   * Add a validator for a property
   */
  this.validate = function(key, validator) {
    model._validators.set(key, validator);
    return model;
  };

  /**
   * Notify listeners of changes
   */
  this._notify = function(key, value, oldValue) {
    if (!model._listeners.has(key)) return;
    model._listeners.get(key).forEach(callback => {
      callback(value, oldValue);
    });
  };

  /**
   * Reset model to initial state
   */
  this.reset = function(data = {}) {
    model._data = { ...data };
    model._notify('*', { reset: true });
    return model;
  };

  /**
   * Fetch data from remote source
   */
  this.fetch = function(url, options = {}) {
    if (!model.gui) {
      return Promise.reject(new Error('gui not available for fetch'));
    }

    return model.gui.fetch(url, options)
      .then(response => {
        if (options.parse && typeof model.parse === 'function') {
          return model.parse(response.data);
        }
        return response.data;
      })
      .then(data => {
        return model.update(data);
      });
  };

  /**
   * Save model data to remote source
   */
  this.save = function(url, options = {}) {
    if (!model.gui) {
      return Promise.reject(new Error('gui not available for save'));
    }

    const data = model.toJSON();
    const settings = {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      ...options
    };

    return model.gui.fetch(url, settings)
      .then(response => response.data);
  };

  return this;
};

/**
 * View factory - Template rendering and DOM manipulation
 */
const View = function(gui, options = {}) {
  const view = this;
  
  this.gui = gui;
  this.options = options;
  this.el = options.el ? gui.$(options.el) : null;
  this.template = options.template || null;
  this.events = options.events || {};
  this._boundEvents = [];

  /**
   * Render the view
   */
  this.render = function(data = {}) {
    if (!view.el) {
      return Promise.reject(new Error('View element not defined'));
    }

    return Promise.resolve()
      .then(() => {
        if (typeof view.template === 'function') {
          return view.template(data);
        } else if (typeof view.template === 'string') {
          return view._interpolate(view.template, data);
        }
        return '';
      })
      .then(html => {
        view.el.html(html);
        view.delegateEvents();
        return view.afterRender(data);
      })
      .then(() => view);
  };

  /**
   * Hook called after rendering
   */
  this.afterRender = function(data) {
    return Promise.resolve();
  };

  /**
   * Simple template interpolation
   */
  this._interpolate = function(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : '';
    });
  };

  /**
   * Delegate DOM events
   */
  this.delegateEvents = function() {
    view.undelegateEvents();

    Object.keys(view.events).forEach(key => {
      const [event, selector] = key.split(/\s+/);
      const handler = view.events[key];
      const method = typeof handler === 'string' ? view[handler] : handler;

      if (!method) {
        view.gui.warn(`Event handler ${handler} not found`);
        return;
      }

      const boundHandler = method.bind(view);
      view._boundEvents.push({ event, selector, handler: boundHandler });

      if (selector) {
        view.el.on(event, selector, boundHandler);
      } else {
        view.el.on(event, boundHandler);
      }
    });

    return view;
  };

  /**
   * Remove delegated events
   */
  this.undelegateEvents = function() {
    view._boundEvents.forEach(({ event, selector, handler }) => {
      if (selector) {
        view.el.off(event, selector, handler);
      } else {
        view.el.off(event, handler);
      }
    });
    view._boundEvents = [];
    return view;
  };

  /**
   * Update a specific part of the view
   */
  this.update = function(selector, content) {
    if (!view.el) {
      return Promise.reject(new Error('View element not defined'));
    }

    const target = selector ? view.el.find(selector) : view.el;
    target.html(content);
    
    return Promise.resolve(view);
  };

  /**
   * Show the view
   */
  this.show = function(animate = false) {
    if (!view.el) return Promise.resolve(view);

    if (animate) {
      return view.el.animateAsync({ opacity: 1 }, 300)
        .then(() => {
          view.el.show();
          return view;
        });
    }

    view.el.show();
    return Promise.resolve(view);
  };

  /**
   * Hide the view
   */
  this.hide = function(animate = false) {
    if (!view.el) return Promise.resolve(view);

    if (animate) {
      return view.el.animateAsync({ opacity: 0 }, 300)
        .then(() => {
          view.el.hide();
          return view;
        });
    }

    view.el.hide();
    return Promise.resolve(view);
  };

  /**
   * Destroy the view
   */
  this.destroy = function() {
    view.undelegateEvents();
    if (view.el) {
      view.el.empty();
    }
    return Promise.resolve();
  };

  // Auto-delegate events if element exists
  if (this.el && Object.keys(this.events).length > 0) {
    this.delegateEvents();
  }

  return this;
};

/**
 * Controller factory - Coordinates Model and View
 */
const Controller = function(gui, options = {}) {
  const controller = this;
  
  this.gui = gui;
  this.options = options;
  this.model = options.model || null;
  this.view = options.view || null;
  this.routes = options.routes || {};
  this._bindings = [];

  /**
   * Initialize the controller
   */
  this.initialize = function() {
    return Promise.resolve()
      .then(() => {
        if (controller.model && controller.view) {
          return controller.bindModelToView();
        }
      })
      .then(() => {
        if (typeof controller.onInit === 'function') {
          return controller.onInit();
        }
      })
      .then(() => controller);
  };

  /**
   * Bind model changes to view updates
   */
  this.bindModelToView = function() {
    if (!controller.model || !controller.view) {
      return Promise.reject(new Error('Model and View required for binding'));
    }

    // Listen to all model changes
    const unsubscribe = controller.model.on('*', (change) => {
      if (change.reset) {
        return controller.view.render(controller.model.toJSON());
      }
      
      if (typeof controller.onModelChange === 'function') {
        controller.onModelChange(change);
      } else {
        // Default: re-render view
        controller.view.render(controller.model.toJSON());
      }
    });

    controller._bindings.push(unsubscribe);
    return Promise.resolve(controller);
  };

  /**
   * Handle route navigation
   */
  this.route = function(path, ...args) {
    const handler = controller.routes[path];
    
    if (!handler) {
      return Promise.reject(new Error(`No route handler for: ${path}`));
    }

    const method = typeof handler === 'string' ? controller[handler] : handler;
    
    if (!method) {
      return Promise.reject(new Error(`Route handler ${handler} not found`));
    }

    return Promise.resolve(method.call(controller, ...args));
  };

  /**
   * Update model with form data
   */
  this.updateFromForm = function(formSelector) {
    if (!controller.model) {
      return Promise.reject(new Error('Model not available'));
    }

    const form = controller.gui.$(formSelector);
    if (!form.length) {
      return Promise.reject(new Error(`Form not found: ${formSelector}`));
    }

    const formData = {};
    form.serializeArray().forEach(({ name, value }) => {
      formData[name] = value;
    });

    return controller.model.update(formData);
  };

  /**
   * Render view with current model data
   */
  this.render = function() {
    if (!controller.view) {
      return Promise.reject(new Error('View not available'));
    }

    const data = controller.model ? controller.model.toJSON() : {};
    return controller.view.render(data);
  };

  /**
   * Clean up controller
   */
  this.destroy = function() {
    // Unsubscribe from all bindings
    controller._bindings.forEach(unsubscribe => unsubscribe());
    controller._bindings = [];

    // Destroy view
    if (controller.view && typeof controller.view.destroy === 'function') {
      return controller.view.destroy().then(() => controller);
    }

    return Promise.resolve(controller);
  };

  return this;
};

const createModel = (data) => new Model(data);
const createView = (gui, options) => new View(gui, options);
const createController = (gui, options) => new Controller(gui, options);

/**
 * MVC Plugin for GUI
 */
const MVCPlugin = function(FEAR$1, options) {
  const plugin = {};

  /**
   * Load hook - extend gui with MVC factories
   */
  plugin.load = function(gui) {
    // Add MVC factories to gui
    gui.Model = (data) => {
      const model = new Model(data);
      model.gui = gui;
      return model;
    };

    gui.View = (opts) => new View(gui, opts);

    gui.Controller = (opts) => new Controller(gui, opts);

    // Convenience method to create complete MVC setup
    gui.createMVC = (config = {}) => {
      const model = config.modelData ? gui.Model(config.modelData) : null;
      const view = config.viewOptions ? gui.View(config.viewOptions) : null;
      
      const controller = gui.Controller({
        model,
        view,
        routes: config.routes || {},
        ...config.controllerOptions
      });

      return controller.initialize().then(() => ({
        model,
        view,
        controller
      }));
    };

    return Promise.resolve();
  };

  return plugin;
};

FEAR$1.use(MVCPlugin);

var MVCPlugin$1 = { 
    Model, 
    View, 
    Controller, 
    createModel, 
    createView, 
    createController, 
    MVCPlugin 
};

/**
 * Performance Metrics Module
 * Monitors route loading times, cache performance, and module lifecycle events
 */
const Metrics = FEAR$1.create('Metrics', function(FEAR$1, options) {
  const metrics = this;
  
  // Private state
  this.monitor = null;
  this.metricsInterval = null;
  this.$metricsDisplay = null;

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

    return {
      startTiming: (key) => {
        if (!state.enabled) return null;
        const startTime = performance.now();
        state.timings.set(key, startTime);
        return startTime;
      },

      endTiming: (key) => {
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
      },

      recordCacheHit: () => {
        if (state.enabled) {
          state.metrics.cacheHits++;
        }
      },

      recordCacheMiss: () => {
        if (state.enabled) {
          state.metrics.cacheMisses++;
        }
      },

      recordError: (error) => {
        if (state.enabled) {
          state.metrics.errors++;
          gui.log('Error recorded:', error);
        }
      },

      getCacheHitRate: () => {
        const total = state.metrics.cacheHits + state.metrics.cacheMisses;
        return total > 0 ? (state.metrics.cacheHits / total * 100).toFixed(2) : 0;
      },

      getAverageLoadTime: (type) => {
        const times = type === 'route' 
          ? state.metrics.routeLoadTimes 
          : state.metrics.moduleLoadTimes;
        
        if (times.size === 0) return 0;
        
        const sum = Array.from(times.values()).reduce((a, b) => a + b, 0);
        return (sum / times.size).toFixed(2);
      },

      getMetrics: () => {
        return {
          ...state.metrics,
          routeLoadTimes: Array.from(state.metrics.routeLoadTimes.entries()),
          moduleLoadTimes: Array.from(state.metrics.moduleLoadTimes.entries()),
          uptime: Date.now() - state.metrics.startTime,
          cacheHitRate: state.metrics.cacheHits + state.metrics.cacheMisses > 0 
            ? (state.metrics.cacheHits / (state.metrics.cacheHits + state.metrics.cacheMisses) * 100).toFixed(2) 
            : 0,
          averageRouteLoadTime: state.metrics.routeLoadTimes.size === 0 
            ? 0 
            : (Array.from(state.metrics.routeLoadTimes.values()).reduce((a, b) => a + b, 0) / state.metrics.routeLoadTimes.size).toFixed(2),
          averageModuleLoadTime: state.metrics.moduleLoadTimes.size === 0 
            ? 0 
            : (Array.from(state.metrics.moduleLoadTimes.values()).reduce((a, b) => a + b, 0) / state.metrics.moduleLoadTimes.size).toFixed(2)
        };
      },

      reset: () => {
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
      }
    };
  };

  // Private helper methods
  this._updateMetricsDisplay = () => {
    if (!this.$metricsDisplay || !this.monitor) return;

    const metricsData = this.monitor.getMetrics();
    
    const html = `
      <div class="metrics-panel">
        <h3>Performance Metrics</h3>
        <div class="metric-item">
          <span class="label">Uptime:</span>
          <span class="value">${this._formatUptime(metricsData.uptime)}</span>
        </div>
        <div class="metric-item">
          <span class="label">Total Routes:</span>
          <span class="value">${metricsData.totalRoutes}</span>
        </div>
        <div class="metric-item">
          <span class="label">Total Modules:</span>
          <span class="value">${metricsData.totalModules}</span>
        </div>
        <div class="metric-item">
          <span class="label">Avg Route Load:</span>
          <span class="value">${metricsData.averageRouteLoadTime}ms</span>
        </div>
        <div class="metric-item">
          <span class="label">Avg Module Load:</span>
          <span class="value">${metricsData.averageModuleLoadTime}ms</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Hit Rate:</span>
          <span class="value">${metricsData.cacheHitRate}%</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Hits:</span>
          <span class="value">${metricsData.cacheHits}</span>
        </div>
        <div class="metric-item">
          <span class="label">Cache Misses:</span>
          <span class="value">${metricsData.cacheMisses}</span>
        </div>
        <div class="metric-item">
          <span class="label">Errors:</span>
          <span class="value">${metricsData.errors}</span>
        </div>
      </div>
    `;
    
    this.$metricsDisplay.html(html);
  };

  this._formatUptime = (ms) => {
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
    load: function(gui, options = {}) {
      return Promise.resolve()
        .then(() => {
          gui.log('Metrics module loading with options:', options);

          // Create performance monitor
          metrics.monitor = createPerformanceMonitor(options.enabled !== false);

          // Set up event listeners for performance tracking
          gui.add('route:start', (data) => {
            const routeKey = `route:${data.path || 'unknown'}`;
            metrics.monitor.startTiming(routeKey);
            gui.log('Route started:', routeKey);
          });

          gui.add('route:complete', (data) => {
            const routeKey = `route:${data.path || 'unknown'}`;
            const duration = metrics.monitor.endTiming(routeKey);
            gui.log(`Route completed: ${routeKey} in ${duration}ms`);
            
            // Emit metrics update
            return gui.emit('metrics:updated', metrics.monitor.getMetrics());
          });

          gui.add('module:start', (data) => {
            const moduleKey = `module:${data.name || 'unknown'}`;
            metrics.monitor.startTiming(moduleKey);
            gui.log('Module started:', moduleKey);
          });

          gui.add('module:complete', (data) => {
            const moduleKey = `module:${data.name || 'unknown'}`;
            const duration = metrics.monitor.endTiming(moduleKey);
            gui.log(`Module loaded: ${moduleKey} in ${duration}ms`);
            
            // Emit metrics update
            return gui.emit('metrics:updated', metrics.monitor.getMetrics());
          });

          gui.add('cache:hit', () => {
            metrics.monitor.recordCacheHit();
          });

          gui.add('cache:miss', () => {
            metrics.monitor.recordCacheMiss();
          });

          gui.add('error', (error) => {
            metrics.monitor.recordError(error);
          });

          // Optional UI display
          if (options.displayMetrics) {
            metrics.$metricsDisplay = gui.$('#metrics-display');
            
            if (metrics.$metricsDisplay.length === 0) {
              // Create metrics display if it doesn't exist
              metrics.$metricsDisplay = gui.$('<div id="metrics-display"></div>');
              gui.$('body').append(metrics.$metricsDisplay);
            }

            // Update display periodically
            const updateInterval = options.updateInterval || 5000;
            metrics.metricsInterval = setInterval(() => {
              metrics._updateMetricsDisplay();
            }, updateInterval);
          }

          // Expose public API on gui
          gui.metrics = {
            start: (key) => metrics.monitor.startTiming(key),
            end: (key) => metrics.monitor.endTiming(key),
            cacheHit: () => metrics.monitor.recordCacheHit(),
            cacheMiss: () => metrics.monitor.recordCacheMiss(),
            recordError: (error) => metrics.monitor.recordError(error),
            get: () => metrics.monitor.getMetrics(),
            reset: () => metrics.monitor.reset()
          };

          gui.log('Metrics module loaded successfully');
        });
    },

    /**
     * Unload the metrics module
     */
    unload: function() {
      return Promise.resolve()
        .then(() => {
          gui.log('Metrics module unloading');

          // Clear interval
          if (metrics.metricsInterval) {
            clearInterval(metrics.metricsInterval);
            metrics.metricsInterval = null;
          }

          // Remove UI display
          if (metrics.$metricsDisplay) {
            metrics.$metricsDisplay.remove();
            metrics.$metricsDisplay = null;
          }

          // Clean up gui API
          delete gui.metrics;
        });
    },

    /**
     * Destroy the metrics module
     */
    destroy: function() {
      return Promise.resolve()
        .then(() => {
          gui.log('Metrics module destroying');
          
          if (metrics.monitor) {
            metrics.monitor.reset();
            metrics.monitor = null;
          }
        });
    },

    /**
     * Get current metrics snapshot
     */
    getSnapshot: function() {
      return metrics.monitor ? metrics.monitor.getMetrics() : null;
    },

    /**
     * Reset all metrics
     */
    reset: function() {
      return Promise.resolve()
        .then(() => {
          if (metrics.monitor) {
            metrics.monitor.reset();
            return gui.emit('metrics:reset');
          }
        })
        .then(() => {
          gui.log('Metrics reset');
        });
    }
  };
}, {
  // Default module options
  enabled: true,
  displayMetrics: false,
  updateInterval: 5000
});

// example-usage.js - How to use the refactored FEAR$1 GUI framework

// Register as GUI plugin
FEAR$1.use(function (FEAR$1, options) {
  FEAR$1.Router = Router;

  // Add router helper to sandbox
  return {
    load: function (gui) {
      gui.router = function (config) {
        return new Router(config);
      };
    }
  };
});
FEAR$1.use(MVCPlugin$1);

$.FEAR$1 = function (options) {
  const instance = FEAR$1;
  if (options) instance.configure(options);
  instance.metrics = Metrics;
  return instance;
};

$.FEAR$1 = FEAR$1;
window.FEAR = FEAR$1;
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
