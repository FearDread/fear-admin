var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/gui/jquery.js
var jquery_default;
var init_jquery = __esm({
  "src/gui/jquery.js"() {
    jquery_default = window.jQuery;
  }
});

// src/gui/jquery_gui.js
var utils, Broker, Registry, SandBox, GUI, FEAR$1, Router, Model, View, Controller, createModel, createView, createController, MVCPlugin, MVCPlugin$1, Metrics;
var init_jquery_gui = __esm({
  "src/gui/jquery_gui.js"() {
    init_jquery();
    utils = {
      /* jQuery $.extend pointer */
      merge: $.extend,
      log: () => {
      },
      each: Object.prototype.forEach,
      has: Object.prototype.hasOwnProperty,
      slice: Array.prototype.slice,
      isObj: (obj) => $.isPlainObject(obj),
      isArr: (arr) => $.isArray(arr),
      isFunc: (obj) => !!(obj && obj.constructor && obj.call && obj.apply),
      isStr: (str) => typeof str === "string",
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
        return window.retina || window.devicePixelRatio > 1;
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
            value = (void 0).convertToEm(width);
            break;
          case "pt":
            value = (void 0).convertToPt(width);
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
        return ((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null ? ref[1] : void 0 : void 0) || "").match(utils.argRgx) || [];
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
        return text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
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
        return value * (void 0).getFontsize();
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
        var elem = document.createElement(), style = elem.getAttribute("style");
        elem.setAttribute("style", style + ";font-size:1em !important");
        elem.setAttribute("style", style);
        base = (void 0).getFontsize();
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
      mixin: function(input, output, override) {
        if (!override || override === null) {
          override = false;
        }
        switch (typeof output + "-" + typeof input) {
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
        var id = "";
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
          return tasks.reduce(
            (p, task, idx) => p.then(
              (results) => Promise.resolve(task()).then((r) => [...results, r]).catch((err) => {
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
          return Promise.all(tasks.map((t) => Promise.resolve(t())));
        },
        first: (tasks = []) => {
          if (!tasks.length) return Promise.resolve(null);
          return tasks[0]().catch(() => {
            if (tasks.length > 1) {
              return utils.run.first(tasks.slice(1));
            }
            throw new Error("All tasks failed");
          });
        }
      }
    };
    Broker = function(options = {}) {
      const broker = this;
      this.channels = {};
      this.cascade = options.cascade || false;
      this.fireOrigin = options.fireOrigin || false;
      this.debug = options.debug || false;
      this._delete = (channel, callback, context) => {
        if (!this.channels[channel]) return [];
        const originalLength = this.channels[channel].length;
        this.channels[channel] = this.channels[channel].filter((sub) => {
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
        return subscribers.map((sub) => () => {
          return new Promise((resolve, reject) => {
            if (utils.hasArgs(sub.callback, 3)) {
              sub.callback.call(sub.context, data, origin, (err, result) => {
                err ? reject(err) : resolve(result);
              });
            } else {
              const result = sub.callback.call(sub.context, data, origin);
              if (result && typeof result.then === "function") {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            }
          }).catch((error) => Promise.reject(error));
        });
      };
      this._formatErrors = (errors) => {
        if (utils.isArr(errors)) {
          const messages = errors.filter((x) => x != null).map((x) => x.message || String(x));
          const error = new Error(messages.join("; "));
          error.originalErrors = errors;
          return error;
        }
        return errors;
      };
      this.create = () => new Broker();
      this.add = function(channel, callback, context) {
        if (typeof channel !== "string") {
          throw new Error("Channel must be a string");
        }
        if (typeof callback !== "function") {
          throw new Error("Callback must be a function");
        }
        if (!this.channels[channel]) {
          this.channels[channel] = [];
        }
        const subscription = {
          event: channel,
          context: context || this,
          callback
        };
        this.channels[channel].push(subscription);
        return this;
      };
      this.remove = function(channel, callback, context) {
        const type = typeof channel;
        switch (type) {
          case "string":
            if (typeof callback === "function") {
              this._delete(channel, callback, context);
            } else if (callback === void 0) {
              this._delete(channel);
            }
            break;
          case "function":
            Object.keys(this.channels).forEach((id) => {
              this._delete(id, channel);
            });
            break;
          case "undefined":
            this.clear();
            break;
          case "object":
            if (channel !== null) {
              Object.keys(this.channels).forEach((id) => {
                this._delete(id, null, channel);
              });
            }
            break;
        }
        return this;
      };
      this.once = function(channel, callback, context) {
        if (typeof channel !== "string") {
          throw new Error("Channel must be a string");
        }
        if (typeof callback !== "function") {
          throw new Error("Callback must be a function");
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
      this.clear = function() {
        Object.keys(this.channels).forEach((k) => delete this.channels[k]);
        utils.log("All channels cleared");
        return this;
      };
      this.fire = function(channel, data) {
        if (typeof channel !== "string") {
          return Promise.reject(new Error("Channel must be a string"));
        }
        if (typeof data === "function") {
          data = void 0;
        }
        const tasks = broker._setupTasks(data, channel, channel);
        if (tasks.length === 0) {
          return Promise.resolve(null);
        }
        return utils.run.first(tasks).catch((errors) => {
          throw broker._formatErrors(errors);
        });
      };
      this.emit = function(channel, data, origin) {
        if (typeof channel !== "string") {
          return Promise.reject(new Error("Channel must be a string"));
        }
        if (data && utils.isFunc(data)) {
          data = void 0;
        }
        origin = origin || channel;
        const tasks = broker._setupTasks(data, channel, origin);
        return utils.run.series(tasks).then((result) => {
          if (broker.cascade) {
            const segments = channel.split("/");
            if (segments.length > 1) {
              const parentChannel = segments.slice(0, -1).join("/");
              const cascadeOrigin = broker.fireOrigin ? origin : parentChannel;
              return this.emit(parentChannel, data, cascadeOrigin).then(() => result);
            }
          }
          return result;
        }).catch((errors) => {
          throw broker._formatErrors(errors);
        });
      };
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
      this.pipe = function(source, target, broker2) {
        if (target && (target.fire || target.emit)) {
          broker2 = target;
          target = source;
        }
        if (!broker2) {
          broker2 = this;
        }
        if (broker2 === this && source === target) {
          return this;
        }
        this.add(source, (...args) => broker2.fire(target, ...args));
        return this;
      };
      this.namespace = function(namespace) {
        const separator = "/";
        const prefix = namespace + separator;
        return {
          add: (channel, fn, context) => this.add(prefix + channel, fn, context),
          remove: (channel, cb, context) => this.remove(prefix + channel, cb, context),
          fire: (channel, data) => this.fire(prefix + channel, data),
          emit: (channel, data, origin) => this.emit(prefix + channel, data, origin),
          once: (channel, fn, context) => this.once(prefix + channel, fn, context),
          waitFor: (channel, timeout) => this.waitFor(prefix + channel, timeout),
          pipe: (src, target, broker2) => this.pipe(prefix + src, prefix + target, broker2),
          getSubscriberCount: (channel) => this.getSubscriberCount(prefix + channel),
          clear: () => {
            const channelKeys = Object.keys(this.channels);
            channelKeys.forEach((ch) => {
              if (ch.startsWith(prefix)) {
                delete this.channels[ch];
              }
            });
            return this;
          }
        };
      };
      this.install = function(target, forced = false) {
        if (!utils.isObj(target)) {
          return this;
        }
        Object.keys(this).forEach((key) => {
          const value = this[key];
          if (typeof value === "function" && (forced || !target[key])) {
            target[key] = value.bind(this);
          }
        });
        return this;
      };
      this.getChannels = function() {
        return Object.keys(this.channels).filter(
          (channel) => this.channels[channel] && this.channels[channel].length > 0
        );
      };
      this.getSubscriberCount = function(channel) {
        return this.channels[channel] && this.channels[channel].length || 0;
      };
      return this;
    };
    new Broker().create();
    Registry = function(options = {}) {
      const modules = /* @__PURE__ */ new Map();
      const broker = new Broker();
      let globalOptions = options;
      const register8 = (name, instance) => {
        if (!name || typeof name !== "string") {
          throw new Error("Module name must be a non-empty string");
        }
        modules.set(name, instance);
        broker.add(`module:${name}`, () => ({ name, instance }));
        broker.emit("module:registered", { name, instance }).then(() => {
          console.log(`Module registered: ${name}`);
        }).catch((err) => {
          console.error("Error registering module:", err);
        });
        return instance;
      };
      const unregister = (name) => {
        if (!modules.has(name)) {
          return false;
        }
        const module = modules.get(name);
        if (module && typeof module.destroy === "function") {
          try {
            module.destroy();
          } catch (err) {
            console.error(`Error destroying module ${name}:`, err);
          }
        }
        modules.delete(name);
        broker.remove(`module:${name}`);
        broker.emit("module:unregistered", { name }).catch((err) => {
          console.error("Error emitting unregister event:", err);
        });
        console.log(`Module unregistered: ${name}`);
        return true;
      };
      const get = (name) => modules.get(name);
      const has = (name) => modules.has(name);
      const list = () => Array.from(modules.keys());
      const clear = () => {
        const names = list();
        names.forEach((name) => unregister(name));
        modules.clear();
      };
      const setGlobal = (opts) => {
        globalOptions = utils.isObj(opts) ? utils.merge({}, globalOptions, opts) : globalOptions;
        return globalOptions;
      };
      const getGlobal = () => globalOptions;
      const on = (event, callback, context) => broker.add(event, callback, context);
      const off = (event, callback, context) => broker.remove(event, callback, context);
      const emit = (event, data) => broker.emit(event, data);
      const fire = (event, data) => broker.fire(event, data);
      const api = {
        create: () => api,
        register: register8,
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
    SandBox = function() {
      const DELIM = "__";
      this.create = function($gui, instance, options = {}, module) {
        const sandbox = {
          id: instance,
          module,
          options,
          utils
        };
        $gui.broker.install(sandbox);
        sandbox.broker = $gui.broker;
        sandbox.add = $gui.broker.add.bind($gui.broker);
        sandbox.remove = $gui.broker.remove.bind($gui.broker);
        sandbox.emit = $gui.broker.emit.bind($gui.broker);
        sandbox.fire = $gui.broker.fire.bind($gui.broker);
        sandbox.data = $.data;
        sandbox.deferred = () => $.Deferred();
        sandbox.animation = $.Animation;
        sandbox.fetch = (url, settings = {}) => {
          return new Promise((resolve, reject) => {
            $.ajax({
              url: typeof url === "string" ? url : url.url,
              ...settings,
              success: (data, textStatus, jqXHR) => resolve({ data, textStatus, jqXHR }),
              error: (jqXHR, textStatus) => reject(new Error(textStatus || "Ajax failed"))
            });
          });
        };
        sandbox.query = function(selector, context) {
          const $el = context && context.find ? context.find(selector) : $(selector);
          $el.query = (sel) => sandbox.query(sel, $el);
          $el.create = (el) => document.createElement(el);
          $el.size = () => parseFloat(window.getComputedStyle($el[0] || $el).fontSize);
          $el.animateAsync = (properties, duration, easing) => {
            return new Promise((resolve, reject) => {
              $el.animate(properties, {
                duration,
                easing,
                complete: () => resolve($el),
                fail: (error) => reject(error)
              });
            }).catch((error) => Promise.reject(error));
          };
          $el.onAsync = (event, selector2) => {
            return new Promise((resolve) => {
              const handler = (e) => {
                $el.off(event, selector2, handler);
                resolve(e);
              };
              if (selector2) {
                $el.on(event, selector2, handler);
              } else {
                $el.on(event, handler);
              }
            });
          };
          return $el;
        };
        sandbox.$ = sandbox.query;
        sandbox.timeout = (ms, fn) => new Promise((resolve) => {
          setTimeout(() => resolve(fn && typeof fn === "function" ? fn() : void 0), ms);
        });
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
              Promise.resolve().then(() => fn()).then(() => {
                runCount++;
                if (maxRuns && runCount >= maxRuns) {
                  clearInterval(intervalId);
                  resolve(runCount);
                }
              }).catch((error) => {
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
            promise
          };
        };
        sandbox.hitch = function(fn, ...initialArgs) {
          return function(...args) {
            const allArgs = initialArgs.concat(args);
            return fn.apply(this, allArgs);
          };
        };
        sandbox.memoize = (source, cache, refetch) => {
          cache = cache || {};
          return (...args) => {
            const key = args.length > 1 ? args.join(DELIM) : String(args[0] || "");
            if (!(key in cache) || refetch && cache[key] === refetch) {
              const result = source.apply(source, args);
              if (result && typeof result.then === "function") {
                cache[key] = result.catch((error) => {
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
        sandbox.loadResources = (resources, options2 = {}) => {
          const resourceArray = Array.isArray(resources) ? resources : [resources];
          const loadPromises = resourceArray.map((resource) => {
            if (typeof resource === "string") {
              const url = resource;
              const extension = url.split(".").pop().toLowerCase();
              switch (extension) {
                case "css":
                  return sandbox.loadCSS(url);
                case "js":
                  return sandbox.loadScript(url);
                case "json":
                  return sandbox.fetch(url).then((response) => response.data);
                default:
                  return sandbox.fetch(url);
              }
            } else if (resource && resource.type && resource.url) {
              switch (resource.type) {
                case "css":
                  return sandbox.loadCSS(resource.url);
                case "script":
                  return sandbox.loadScript(resource.url);
                case "json":
                  return sandbox.fetch(resource.url).then((response) => response.data);
                default:
                  return sandbox.fetch(resource.url);
              }
            }
            return Promise.reject(new Error("Invalid resource format"));
          });
          return Promise.all(loadPromises);
        };
        sandbox.loadCSS = (url) => {
          return new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
            document.head.appendChild(link);
          });
        };
        sandbox.loadScript = (url) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
          });
        };
        sandbox.getLocation = () => $gui.config.win && $gui.config.win.location;
        sandbox.log = (...args) => $gui.debug.log(...args);
        sandbox.warn = (...args) => $gui.debug.warn(...args);
        sandbox.ready = () => new Promise((resolve) => $(document).ready(resolve));
        sandbox.loaded = () => new Promise((resolve) => $(window).on("load", resolve));
        return sandbox;
      };
      return this;
    };
    GUI = function() {
      const gui2 = this;
      this.config = { logLevel: 0, name: "FEAR$1_GUI", version: "2.0.0" };
      this.debug = {
        history: [],
        level: this.config.logLevel,
        timeout: 5e3,
        warn(...args) {
          if (gui2.debug.level < 2) {
            console.warn("WARN:", ...args);
            gui2.debug.history.push({ type: "warn", args });
          }
        },
        log(...args) {
          if (gui2.debug.level < 1) {
            console.log("Debug:", ...args);
            gui2.debug.history.push({ type: "log", args });
          }
        }
      };
      this.state = {
        modules: {},
        plugins: [],
        instances: {},
        sandboxes: {},
        running: {},
        imports: []
      };
      this.broker = new Broker().create();
      this.registry = new Registry().create(this.config);
      this.utils = utils;
      const _runInstPlugins = (handler, $gui) => {
        const tasks = gui2.state.plugins.filter((p) => typeof p.plugin?.[handler] === "function").map((p) => () => Promise.resolve(p.plugin[handler]($gui, p.options)));
        return utils.run.series(tasks);
      };
      const _createInst = (moduleId, opts) => {
        const id = opts.instanceId || moduleId;
        if (gui2.state.instances[id]) {
          return Promise.resolve({ instance: gui2.state.instances[id], options: opts.options });
        }
        const module = gui2.state.modules[moduleId];
        const iOpts = { ...module.options, ...opts.options };
        const sb = new SandBox().create(gui2, id, iOpts, moduleId);
        return _runInstPlugins("load", sb).then(() => {
          const instance = module.creator(sb);
          if (typeof instance.load !== "function") {
            if (instance.fn && typeof instance.fn === "function") {
              gui2.plugin(instance, id);
              return { instance, options: iOpts };
            }
            throw new Error("module has no 'load' or 'fn' method");
          }
          gui2.state.instances[id] = instance;
          gui2.state.sandboxes[id] = sb;
          gui2.registry.register(id, instance);
          return { instance, options: iOpts };
        });
      };
      const _startInst = (mods) => {
        if (!mods) mods = Object.keys(gui2.state.modules);
        const tasks = mods.map((mid) => () => gui2.start(mid, gui2.state.modules[mid].options));
        return utils.run.parallel(tasks);
      };
      this.configure = function(options) {
        if (options && utils.isObj(options)) {
          gui2.config = utils.merge(gui2.config, options);
          gui2.registry.setGlobal(gui2.config);
          gui2.debug.level = gui2.config.logLevel || 0;
        }
        return gui2;
      };
      this.create = function(id, creator, options = {}) {
        const error = utils.isType("string", id, "module ID") || utils.isType("function", creator, "creator") || utils.isType("object", options, "option parameter");
        if (error) {
          gui2.debug.warn(`could not register module '${id}': ${error}`);
          return gui2;
        }
        gui2.state.modules[id] = { id, creator, options };
        return gui2;
      };
      this.start = function(moduleId, opt = {}) {
        const id = opt.instanceId || moduleId;
        const error = utils.isType("string", moduleId, "module ID") || utils.isType("object", opt, "second parameter") || (!gui2.state.modules[moduleId] ? "module doesn't exist" : void 0);
        if (!moduleId) return _startInst();
        if (utils.isArr(moduleId)) return _startInst(moduleId);
        if (utils.isFunc(moduleId)) return _startInst();
        if (error) return Promise.reject(new Error(error));
        if (gui2.state.running[id] === true) {
          return Promise.reject(new Error("module was already started"));
        }
        return gui2.boot().then(() => _createInst(moduleId, opt)).then(({ instance, options }) => {
          if (instance.load && typeof instance.load === "function") {
            const loadResult = instance.load(options);
            if (loadResult && typeof loadResult.then === "function") {
              return loadResult.then(() => {
                gui2.state.running[id] = true;
              });
            } else {
              gui2.state.running[id] = true;
              return Promise.resolve();
            }
          } else {
            gui2.state.running[id] = true;
            return Promise.resolve();
          }
        }).catch((err) => {
          gui2.debug.warn(err);
          throw new Error("could not start module: " + err.message);
        });
      };
      this.stop = function(id) {
        if (arguments.length === 0 || typeof id === "function") {
          const moduleIds = Object.keys(gui2.state.instances);
          return utils.run.parallel(moduleIds.map((mid) => () => gui2.stop(mid)));
        }
        const instance = gui2.state.instances[id];
        if (!instance) return Promise.resolve();
        delete gui2.state.instances[id];
        gui2.broker.remove(instance);
        gui2.registry.unregister(id);
        return _runInstPlugins("unload", gui2.state.sandboxes[id]).then(() => {
          if (instance.unload && typeof instance.unload === "function") {
            const unloadResult = instance.unload();
            if (unloadResult && typeof unloadResult.then === "function") {
              return unloadResult;
            }
          }
          return Promise.resolve();
        }).then(() => {
          delete gui2.state.running[id];
        });
      };
      this.use = function(plugin, opt) {
        if (utils.isArr(plugin)) {
          plugin.forEach((p) => {
            if (utils.isFunc(p)) {
              gui2.use(p);
            } else if (utils.isObj(p)) {
              gui2.use(p.plugin, p.options);
            }
          });
        } else {
          if (!utils.isFunc(plugin)) {
            return gui2;
          }
          gui2.state.plugins.push({
            creator: plugin,
            options: opt
          });
        }
        return gui2;
      };
      this.plugin = function(plugin, module) {
        if (plugin.fn && utils.isFunc(plugin.fn)) {
          $.fn[module.toLowerCase()] = function(options) {
            return new plugin.fn(this, options);
          };
        } else {
          gui2.debug.log("Error :: Missing " + plugin + " fn() method.");
        }
        return gui2;
      };
      this.boot = function() {
        const tasks = gui2.state.plugins.filter((plugin) => plugin.booted !== true).map((plugin) => () => {
          return new Promise((resolve, reject) => {
            if (utils.hasArgs(plugin.creator, 3)) {
              plugin.creator(gui2, plugin.options, (err) => {
                if (err) {
                  reject(err);
                } else {
                  plugin.booted = true;
                  resolve();
                }
              });
            } else {
              Promise.resolve().then(() => {
                plugin.plugin = plugin.creator(gui2, plugin.options);
                plugin.booted = true;
                resolve();
              }).catch((err) => reject(err));
            }
          });
        });
        return utils.run.series(tasks);
      };
      this.attach = function(imports) {
        return Promise.resolve().then(() => {
          gui2.debug.log("Dynamic async module loading.");
          gui2.debug.log("Imports:", imports);
        });
      };
      return this;
    };
    FEAR$1 = new GUI();
    Router = function(options = {}) {
      const router = this;
      const DEFAULTS = {
        container: "#router-container",
        fragmentPath: "/fragments/",
        defaultRoute: "home",
        pushState: true,
        hashNavigation: true,
        smoothScroll: true,
        scrollOffset: 0,
        activeClass: "active",
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
          ttl: 36e5
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
          delay: 1e3
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
      this.options = FEAR$1.utils.merge({}, DEFAULTS, options);
      this.routes = this.options.routes;
      this.currentRoute = null;
      this.previousRoute = null;
      this.isNavigating = false;
      this.initialized = false;
      this.loadingPromises = /* @__PURE__ */ new Map();
      this.retryAttempts = /* @__PURE__ */ new Map();
      this.$container = null;
      this.$announcer = null;
      this.cache = /* @__PURE__ */ new Map();
      this.cacheTimestamps = /* @__PURE__ */ new Map();
      this._handleHashChange = () => {
        if (!this.isNavigating) {
          const hash = window.location.hash.slice(1);
          const routeName = hash || this.options.defaultRoute;
          this._loadRoute(routeName).catch(() => {
          });
        }
      };
      this._handlePopState = (e) => {
        const state = e.originalEvent?.state;
        if (state && state.route) {
          this._loadRoute(state.route).catch(() => {
          });
        } else {
          this._handleHashChange();
        }
      };
      this._handleLinkClick = (e) => {
        const $link = $(e.currentTarget);
        const href = $link.attr("href");
        if (href && href.startsWith("#") && href.length > 1) {
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
          console.warn("Navigation already in progress");
          return Promise.resolve();
        }
        const route = this.routes[routeName];
        if (!route) {
          console.warn(`Route "${routeName}" not found`);
          return Promise.reject(new Error(`Route not found: ${routeName}`));
        }
        this.isNavigating = true;
        return FEAR$1.broker.emit("route:start", { path: routeName }).then(() => {
          if (this.options.callbacks.beforeRouteChange) {
            return Promise.resolve(
              this.options.callbacks.beforeRouteChange.call(this, routeName, this.currentRoute)
            );
          }
        }).then((shouldContinue) => {
          if (shouldContinue === false) {
            this.isNavigating = false;
            return Promise.reject(new Error("Route change cancelled"));
          }
          this.previousRoute = this.currentRoute;
          this.currentRoute = routeName;
          if (this.options.loading.enabled && !route.html) {
            this._showLoading();
          }
          if (route.html) {
            return this._renderRoute(route);
          } else {
            return this._fetchRoute(route);
          }
        }).then(() => {
          console.log(`Route "${routeName}" loaded successfully`);
          return FEAR$1.broker.emit("route:complete", { path: routeName });
        }).catch((error) => {
          this._handleError(`Failed to load route "${routeName}": ${error.message}`, error);
          return Promise.reject(error);
        }).then(() => {
          this.isNavigating = false;
          this._hideLoading();
        });
      };
      this._fetchRoute = function(route) {
        const cached = this._getCachedRoute(route.name);
        if (cached) {
          FEAR$1.broker.emit("cache:hit");
          route.html = cached;
          return this._renderRoute(route);
        }
        FEAR$1.broker.emit("cache:miss");
        if (this.loadingPromises.has(route.name)) {
          return this.loadingPromises.get(route.name).then((html) => {
            route.html = html;
            return this._renderRoute(route);
          });
        }
        const url = this.options.fragmentPath + (route.path || route.name + ".html");
        const loadingPromise = this._createLoadingPromise(url, route.name);
        this.loadingPromises.set(route.name, loadingPromise);
        return loadingPromise.then((html) => {
          route.html = html;
          this._setCachedRoute(route.name, html);
          return this._renderRoute(route);
        }).then(() => {
          this.loadingPromises.delete(route.name);
        }).catch((error) => {
          this.loadingPromises.delete(route.name);
          return Promise.reject(error);
        });
      };
      this._renderRoute = function(route) {
        const fadeSpeed = this.options.animations.enabled && !this._prefersReducedMotion() ? this.options.animations.fadeSpeed : 0;
        return new Promise((resolve, reject) => {
          this.$container.fadeOut(fadeSpeed, () => {
            Promise.resolve().then(() => {
              this.$container.empty().html(route.html);
              this._updateMetadata(route);
              return new Promise((res) => {
                this.$container.fadeIn(fadeSpeed, () => res());
              });
            }).then(() => {
              if (route.callback && typeof route.callback === "function") {
                return Promise.resolve(route.callback.call(this, route));
              }
            }).then(() => {
              this._initComponents();
              this._handleAccessibility(route);
              if (this.options.callbacks.afterRouteChange) {
                return Promise.resolve(
                  this.options.callbacks.afterRouteChange.call(this, route.name, this.previousRoute)
                );
              }
            }).then(() => {
              if (this.options.callbacks.onRouteChange) {
                return Promise.resolve(
                  this.options.callbacks.onRouteChange.call(this, route.name)
                );
              }
            }).then(() => {
              return FEAR$1.broker.emit("router:rendered", { route: route.name });
            }).then(() => resolve()).catch((error) => {
              this._handleError(`Route callback error: ${error.message}`, error);
              resolve();
            });
          });
        });
      };
      this._createLoadingPromise = function(url, routeName) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url,
            dataType: "html",
            success: (data) => resolve(data),
            error: (jqXHR, textStatus, errorThrown) => {
              reject(new Error(textStatus || "Failed to load route"));
            }
          });
        }).catch((error) => {
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
      };
      this._updateMetadata = function(route) {
        if (route.title) {
          document.title = route.title;
        }
        if (route.meta) {
          Object.keys(route.meta).forEach((name) => {
            let $meta = $(`meta[name="${name}"]`);
            if ($meta.length === 0) {
              $meta = $("<meta>").attr("name", name);
              $("head").append($meta);
            }
            $meta.attr("content", route.meta[name]);
          });
        }
      };
      this._initComponents = function() {
        FEAR$1.broker.emit("components:init", { container: this.$container });
      };
      this._handleAccessibility = function(route) {
        if (!this.options.accessibility.announceRoutes) return;
        if (this.$announcer) {
          this.$announcer.text(`Navigated to ${route.title || route.name}`);
        }
        if (this.options.accessibility.focusContent) {
          this.$container.attr("tabindex", "-1").focus();
        }
      };
      this._scrollToSection = function(target) {
        const $target = $(`#${target}, [name="${target}"]`).first();
        if ($target.length) {
          const targetTop = $target.offset().top - this.options.scrollOffset;
          $("html, body").animate({
            scrollTop: targetTop
          }, 800);
        }
      };
      this._prefersReducedMotion = function() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      };
      this._handleError = function(message, error) {
        console.error(message, error);
        FEAR$1.broker.emit("error", { message, error });
        if (this.options.callbacks.onError) {
          this.options.callbacks.onError.call(this, error);
        }
      };
      this._updateActiveStates = function(routeName) {
        $(`a[href="#${routeName}"]`).addClass(this.options.activeClass).parent().siblings().find("a").removeClass(this.options.activeClass);
      };
      this.init = function() {
        if (this.initialized) {
          console.warn("Router already initialized");
          return this;
        }
        this.$container = $(this.options.container);
        if (this.$container.length === 0) {
          console.error(`Container "${this.options.container}" not found`);
          return this;
        }
        if (this.options.accessibility.announceRoutes) {
          this.$announcer = $("<div>").attr({
            "role": "status",
            "aria-live": "polite",
            "aria-atomic": "true"
          }).addClass("sr-only").appendTo("body");
        }
        if (this.options.hashNavigation) {
          $(window).on("hashchange.FEAR$1-router", this._handleHashChange);
        }
        if (this.options.pushState) {
          $(window).on("popstate.FEAR$1-router", this._handlePopState);
        }
        $(document).on("click.FEAR$1-router", 'a[href^="#"]', this._handleLinkClick);
        this.initialized = true;
        const hash = window.location.hash.slice(1);
        const initialRoute = hash || this.options.defaultRoute;
        if (initialRoute) {
          this._loadRoute(initialRoute).catch(() => {
          });
        }
        console.log("Router initialized");
        FEAR$1.broker.emit("router:ready");
        return this;
      };
      this.navigate = function(routeName, pushState = true) {
        if (this.isNavigating) {
          console.warn("Navigation already in progress");
          return this;
        }
        const route = this.routes[routeName];
        if (!route) {
          console.error(`Route "${routeName}" not found`);
          return this;
        }
        if (pushState && this.options.pushState) {
          const state = { route: routeName };
          history.pushState(state, route.title || "", `#${routeName}`);
        } else {
          window.location.hash = routeName;
        }
        this._updateActiveStates(routeName);
        return this;
      };
      this.addRoute = function(name, config) {
        this.routes[name] = {
          name,
          path: name + ".html",
          html: null,
          callback: null,
          title: name.charAt(0).toUpperCase() + name.slice(1),
          ...config
        };
        console.log(`Route "${name}" added`);
        FEAR$1.broker.emit("router:route-added", { name, config });
        return this;
      };
      this.removeRoute = function(name) {
        if (this.routes[name]) {
          delete this.routes[name];
          this.cache.delete(name);
          this.cacheTimestamps.delete(name);
          console.log(`Route "${name}" removed`);
          FEAR$1.broker.emit("router:route-removed", { name });
        }
        return this;
      };
      this.reload = function() {
        if (this.currentRoute) {
          const route = this.routes[this.currentRoute];
          if (route) {
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
        console.log("Cache cleared");
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
        console.log("Destroying router instance");
        $(window).off(".FEAR$1-router");
        $(document).off(".FEAR$1-router");
        this.cache.clear();
        this.cacheTimestamps.clear();
        this.loadingPromises.clear();
        this.retryAttempts.clear();
        if (this.$announcer) {
          this.$announcer.remove();
        }
        if (this.options.callbacks.onDestroy) {
          this.options.callbacks.onDestroy.call(this);
        }
        FEAR$1.broker.emit("router:destroy");
        this.initialized = false;
        return this;
      };
      this.fn = function($element, options2) {
        return $element.each(function() {
          const $this = $(this);
          let instance = $this.data("FEAR$1-router");
          if (!instance) {
            instance = new Router({ ...options2, container: this });
            $this.data("FEAR$1-router", instance);
            instance.init();
          }
          return instance;
        });
      };
      return this;
    };
    Model = function(data = {}) {
      const model = this;
      this._data = { ...data };
      this._listeners = /* @__PURE__ */ new Map();
      this._computed = /* @__PURE__ */ new Map();
      this._validators = /* @__PURE__ */ new Map();
      this.get = function(key) {
        if (model._computed.has(key)) {
          return model._computed.get(key).call(model);
        }
        return model._data[key];
      };
      this.set = function(key, value) {
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
        model._notify("*", { key, value, oldValue });
        return Promise.resolve(model);
      };
      this.update = function(data2) {
        const keys = Object.keys(data2);
        const tasks = keys.map((key) => () => model.set(key, data2[key]));
        return utils.run.series(tasks).then(() => model);
      };
      this.toJSON = function() {
        return { ...model._data };
      };
      this.on = function(key, callback) {
        if (!model._listeners.has(key)) {
          model._listeners.set(key, []);
        }
        model._listeners.get(key).push(callback);
        return () => model.off(key, callback);
      };
      this.off = function(key, callback) {
        if (!model._listeners.has(key)) return;
        const listeners = model._listeners.get(key);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
      this.computed = function(key, fn) {
        model._computed.set(key, fn);
        return model;
      };
      this.validate = function(key, validator) {
        model._validators.set(key, validator);
        return model;
      };
      this._notify = function(key, value, oldValue) {
        if (!model._listeners.has(key)) return;
        model._listeners.get(key).forEach((callback) => {
          callback(value, oldValue);
        });
      };
      this.reset = function(data2 = {}) {
        model._data = { ...data2 };
        model._notify("*", { reset: true });
        return model;
      };
      this.fetch = function(url, options = {}) {
        if (!model.gui) {
          return Promise.reject(new Error("gui not available for fetch"));
        }
        return model.gui.fetch(url, options).then((response) => {
          if (options.parse && typeof model.parse === "function") {
            return model.parse(response.data);
          }
          return response.data;
        }).then((data2) => {
          return model.update(data2);
        });
      };
      this.save = function(url, options = {}) {
        if (!model.gui) {
          return Promise.reject(new Error("gui not available for save"));
        }
        const data2 = model.toJSON();
        const settings = {
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(data2),
          ...options
        };
        return model.gui.fetch(url, settings).then((response) => response.data);
      };
      return this;
    };
    View = function(gui2, options = {}) {
      const view = this;
      this.gui = gui2;
      this.options = options;
      this.el = options.el ? gui2.$(options.el) : null;
      this.template = options.template || null;
      this.events = options.events || {};
      this._boundEvents = [];
      this.render = function(data = {}) {
        if (!view.el) {
          return Promise.reject(new Error("View element not defined"));
        }
        return Promise.resolve().then(() => {
          if (typeof view.template === "function") {
            return view.template(data);
          } else if (typeof view.template === "string") {
            return view._interpolate(view.template, data);
          }
          return "";
        }).then((html) => {
          view.el.html(html);
          view.delegateEvents();
          return view.afterRender(data);
        }).then(() => view);
      };
      this.afterRender = function(data) {
        return Promise.resolve();
      };
      this._interpolate = function(template, data) {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return data[key] !== void 0 ? data[key] : "";
        });
      };
      this.delegateEvents = function() {
        view.undelegateEvents();
        Object.keys(view.events).forEach((key) => {
          const [event, selector] = key.split(/\s+/);
          const handler = view.events[key];
          const method = typeof handler === "string" ? view[handler] : handler;
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
      this.update = function(selector, content) {
        if (!view.el) {
          return Promise.reject(new Error("View element not defined"));
        }
        const target = selector ? view.el.find(selector) : view.el;
        target.html(content);
        return Promise.resolve(view);
      };
      this.show = function(animate = false) {
        if (!view.el) return Promise.resolve(view);
        if (animate) {
          return view.el.animateAsync({ opacity: 1 }, 300).then(() => {
            view.el.show();
            return view;
          });
        }
        view.el.show();
        return Promise.resolve(view);
      };
      this.hide = function(animate = false) {
        if (!view.el) return Promise.resolve(view);
        if (animate) {
          return view.el.animateAsync({ opacity: 0 }, 300).then(() => {
            view.el.hide();
            return view;
          });
        }
        view.el.hide();
        return Promise.resolve(view);
      };
      this.destroy = function() {
        view.undelegateEvents();
        if (view.el) {
          view.el.empty();
        }
        return Promise.resolve();
      };
      if (this.el && Object.keys(this.events).length > 0) {
        this.delegateEvents();
      }
      return this;
    };
    Controller = function(gui2, options = {}) {
      const controller = this;
      this.gui = gui2;
      this.options = options;
      this.model = options.model || null;
      this.view = options.view || null;
      this.routes = options.routes || {};
      this._bindings = [];
      this.initialize = function() {
        return Promise.resolve().then(() => {
          if (controller.model && controller.view) {
            return controller.bindModelToView();
          }
        }).then(() => {
          if (typeof controller.onInit === "function") {
            return controller.onInit();
          }
        }).then(() => controller);
      };
      this.bindModelToView = function() {
        if (!controller.model || !controller.view) {
          return Promise.reject(new Error("Model and View required for binding"));
        }
        const unsubscribe = controller.model.on("*", (change) => {
          if (change.reset) {
            return controller.view.render(controller.model.toJSON());
          }
          if (typeof controller.onModelChange === "function") {
            controller.onModelChange(change);
          } else {
            controller.view.render(controller.model.toJSON());
          }
        });
        controller._bindings.push(unsubscribe);
        return Promise.resolve(controller);
      };
      this.route = function(path, ...args) {
        const handler = controller.routes[path];
        if (!handler) {
          return Promise.reject(new Error(`No route handler for: ${path}`));
        }
        const method = typeof handler === "string" ? controller[handler] : handler;
        if (!method) {
          return Promise.reject(new Error(`Route handler ${handler} not found`));
        }
        return Promise.resolve(method.call(controller, ...args));
      };
      this.updateFromForm = function(formSelector) {
        if (!controller.model) {
          return Promise.reject(new Error("Model not available"));
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
      this.render = function() {
        if (!controller.view) {
          return Promise.reject(new Error("View not available"));
        }
        const data = controller.model ? controller.model.toJSON() : {};
        return controller.view.render(data);
      };
      this.destroy = function() {
        controller._bindings.forEach((unsubscribe) => unsubscribe());
        controller._bindings = [];
        if (controller.view && typeof controller.view.destroy === "function") {
          return controller.view.destroy().then(() => controller);
        }
        return Promise.resolve(controller);
      };
      return this;
    };
    createModel = (data) => new Model(data);
    createView = (gui2, options) => new View(gui2, options);
    createController = (gui2, options) => new Controller(gui2, options);
    MVCPlugin = function(FEAR$12, options) {
      const plugin = {};
      plugin.load = function(gui2) {
        gui2.Model = (data) => {
          const model = new Model(data);
          model.gui = gui2;
          return model;
        };
        gui2.View = (opts) => new View(gui2, opts);
        gui2.Controller = (opts) => new Controller(gui2, opts);
        gui2.createMVC = (config = {}) => {
          const model = config.modelData ? gui2.Model(config.modelData) : null;
          const view = config.viewOptions ? gui2.View(config.viewOptions) : null;
          const controller = gui2.Controller({
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
    MVCPlugin$1 = {
      Model,
      View,
      Controller,
      createModel,
      createView,
      createController,
      MVCPlugin
    };
    Metrics = FEAR$1.create("Metrics", function(FEAR$12, options) {
      const metrics = this;
      this.monitor = null;
      this.metricsInterval = null;
      this.$metricsDisplay = null;
      const createPerformanceMonitor = (enabled = true) => {
        const state = {
          enabled,
          metrics: {
            routeLoadTimes: /* @__PURE__ */ new Map(),
            moduleLoadTimes: /* @__PURE__ */ new Map(),
            totalRoutes: 0,
            totalModules: 0,
            cacheHits: 0,
            cacheMisses: 0,
            errors: 0,
            startTime: Date.now()
          },
          timings: /* @__PURE__ */ new Map()
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
            if (key.startsWith("route:")) {
              state.metrics.routeLoadTimes.set(key, duration);
              state.metrics.totalRoutes++;
            } else if (key.startsWith("module:")) {
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
              gui.log("Error recorded:", error);
            }
          },
          getCacheHitRate: () => {
            const total = state.metrics.cacheHits + state.metrics.cacheMisses;
            return total > 0 ? (state.metrics.cacheHits / total * 100).toFixed(2) : 0;
          },
          getAverageLoadTime: (type) => {
            const times = type === "route" ? state.metrics.routeLoadTimes : state.metrics.moduleLoadTimes;
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
              cacheHitRate: state.metrics.cacheHits + state.metrics.cacheMisses > 0 ? (state.metrics.cacheHits / (state.metrics.cacheHits + state.metrics.cacheMisses) * 100).toFixed(2) : 0,
              averageRouteLoadTime: state.metrics.routeLoadTimes.size === 0 ? 0 : (Array.from(state.metrics.routeLoadTimes.values()).reduce((a, b) => a + b, 0) / state.metrics.routeLoadTimes.size).toFixed(2),
              averageModuleLoadTime: state.metrics.moduleLoadTimes.size === 0 ? 0 : (Array.from(state.metrics.moduleLoadTimes.values()).reduce((a, b) => a + b, 0) / state.metrics.moduleLoadTimes.size).toFixed(2)
            };
          },
          reset: () => {
            state.metrics = {
              routeLoadTimes: /* @__PURE__ */ new Map(),
              moduleLoadTimes: /* @__PURE__ */ new Map(),
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
        const seconds = Math.floor(ms / 1e3);
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
      return {
        /**
         * Initialize the metrics module
         */
        load: function(gui2, options2 = {}) {
          return Promise.resolve().then(() => {
            gui2.log("Metrics module loading with options:", options2);
            metrics.monitor = createPerformanceMonitor(options2.enabled !== false);
            gui2.add("route:start", (data) => {
              const routeKey = `route:${data.path || "unknown"}`;
              metrics.monitor.startTiming(routeKey);
              gui2.log("Route started:", routeKey);
            });
            gui2.add("route:complete", (data) => {
              const routeKey = `route:${data.path || "unknown"}`;
              const duration = metrics.monitor.endTiming(routeKey);
              gui2.log(`Route completed: ${routeKey} in ${duration}ms`);
              return gui2.emit("metrics:updated", metrics.monitor.getMetrics());
            });
            gui2.add("module:start", (data) => {
              const moduleKey = `module:${data.name || "unknown"}`;
              metrics.monitor.startTiming(moduleKey);
              gui2.log("Module started:", moduleKey);
            });
            gui2.add("module:complete", (data) => {
              const moduleKey = `module:${data.name || "unknown"}`;
              const duration = metrics.monitor.endTiming(moduleKey);
              gui2.log(`Module loaded: ${moduleKey} in ${duration}ms`);
              return gui2.emit("metrics:updated", metrics.monitor.getMetrics());
            });
            gui2.add("cache:hit", () => {
              metrics.monitor.recordCacheHit();
            });
            gui2.add("cache:miss", () => {
              metrics.monitor.recordCacheMiss();
            });
            gui2.add("error", (error) => {
              metrics.monitor.recordError(error);
            });
            if (options2.displayMetrics) {
              metrics.$metricsDisplay = gui2.$("#metrics-display");
              if (metrics.$metricsDisplay.length === 0) {
                metrics.$metricsDisplay = gui2.$('<div id="metrics-display"></div>');
                gui2.$("body").append(metrics.$metricsDisplay);
              }
              const updateInterval = options2.updateInterval || 5e3;
              metrics.metricsInterval = setInterval(() => {
                metrics._updateMetricsDisplay();
              }, updateInterval);
            }
            gui2.metrics = {
              start: (key) => metrics.monitor.startTiming(key),
              end: (key) => metrics.monitor.endTiming(key),
              cacheHit: () => metrics.monitor.recordCacheHit(),
              cacheMiss: () => metrics.monitor.recordCacheMiss(),
              recordError: (error) => metrics.monitor.recordError(error),
              get: () => metrics.monitor.getMetrics(),
              reset: () => metrics.monitor.reset()
            };
            gui2.log("Metrics module loaded successfully");
          });
        },
        /**
         * Unload the metrics module
         */
        unload: function() {
          return Promise.resolve().then(() => {
            gui.log("Metrics module unloading");
            if (metrics.metricsInterval) {
              clearInterval(metrics.metricsInterval);
              metrics.metricsInterval = null;
            }
            if (metrics.$metricsDisplay) {
              metrics.$metricsDisplay.remove();
              metrics.$metricsDisplay = null;
            }
            delete gui.metrics;
          });
        },
        /**
         * Destroy the metrics module
         */
        destroy: function() {
          return Promise.resolve().then(() => {
            gui.log("Metrics module destroying");
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
          return Promise.resolve().then(() => {
            if (metrics.monitor) {
              metrics.monitor.reset();
              return gui.emit("metrics:reset");
            }
          }).then(() => {
            gui.log("Metrics reset");
          });
        }
      };
    }, {
      // Default module options
      enabled: true,
      displayMetrics: false,
      updateInterval: 5e3
    });
    FEAR$1.use(function(FEAR$12, options) {
      FEAR$12.Router = Router;
      return {
        load: function(gui2) {
          gui2.router = function(config) {
            return new Router(config);
          };
        }
      };
    });
    FEAR$1.use(MVCPlugin$1);
    $.FEAR$1 = function(options) {
      const instance = FEAR$1;
      if (options) instance.configure(options);
      instance.metrics = Metrics;
      return instance;
    };
    $.FEAR$1 = FEAR$1;
    window.FEAR = FEAR$1;
  }
});

// src/lib/format.js
function highlight(text) {
  let h = esc(text);
  TOKENS.forEach(([re, cls]) => {
    h = h.replace(re, (m) => `<span class="${cls}">${m}</span>`);
  });
  return h.replace(/✓/g, '<span class="tok-ok">\u2713</span>').replace(/✗/g, '<span class="tok-err">\u2717</span>');
}
function markdown(src) {
  const blocks = [];
  const text = String(src || "").replace(/```([\w+#.-]*)[^\S\n]*\n?([\s\S]*?)(```|$)/g, (m, lang, code) => {
    blocks.push({ lang, code: code.replace(/\n$/, "") });
    return `\0${blocks.length - 1}\0`;
  });
  const out = [];
  let list = null;
  let para = [];
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join("<br>")}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };
  text.split("\n").forEach((line) => {
    let m;
    if (m = line.match(/^\u0000(\d+)\u0000$/)) {
      flushPara();
      closeList();
      const b = blocks[+m[1]];
      out.push(
        `<div class="codeblock"><div class="codebar"><span>${esc(b.lang || "text")}</span><button type="button" class="copy-code">copy</button></div><pre><code>${esc(b.code)}</code></pre></div>`
      );
    } else if (m = line.match(/^(#{1,4})\s+(.*)$/)) {
      flushPara();
      closeList();
      out.push(`<h${m[1].length + 2}>${inline(m[2])}</h${m[1].length + 2}>`);
    } else if (m = line.match(/^\s*[-*+]\s+(.*)$/)) {
      flushPara();
      if (list !== "ul") {
        closeList();
        out.push("<ul>");
        list = "ul";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if (m = line.match(/^\s*\d+[.)]\s+(.*)$/)) {
      flushPara();
      if (list !== "ol") {
        closeList();
        out.push("<ol>");
        list = "ol";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if (m = line.match(/^>\s?(.*)$/)) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(m[1])}</blockquote>`);
    } else if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      flushPara();
      closeList();
      out.push("<hr>");
    } else if (!line.trim()) {
      flushPara();
      closeList();
    } else {
      closeList();
      para.push(inline(line));
    }
  });
  flushPara();
  closeList();
  return out.join("");
}
var EMAIL_PATTERN, redactLogin, ENT, esc, clock, copyText, TOKENS, fmt, inline;
var init_format = __esm({
  "src/lib/format.js"() {
    EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    redactLogin = (cmd) => cmd.replace(/^(login\s+\S+\s+)\S.*$/, "$1********");
    ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ENT[c]);
    clock = (d = /* @__PURE__ */ new Date()) => d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    copyText = (text) => {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      return new Promise((resolve, reject) => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
        } catch (e) {
          reject(e);
        } finally {
          ta.remove();
        }
      });
    };
    TOKENS = [
      [/\[(CRITICAL|HIGH)\]/g, "tok-crit"],
      [/\[(MEDIUM|WARNING|NOT CONFIGURED)\]/g, "tok-warn"],
      [/\[(LOW|SUCCESS|READY|RUNNING|OK)\]/g, "tok-ok"],
      [/\[(ERROR|UNAVAILABLE|FAIL)\]/g, "tok-err"],
      [/\[(INFO|STOPPED|SKIP)\]/g, "tok-dim"]
    ];
    fmt = (h) => h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*(?!\*)/g, "$1<em>$2</em>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    inline = (s) => s.split(/(`[^`]+`)/g).map((p) => p.length > 1 && p[0] === "`" && p[p.length - 1] === "`" ? `<code>${esc(p.slice(1, -1))}</code>` : fmt(esc(p))).join("");
  }
});

// src/lib/icons.js
function icon(name, cls = "") {
  const d = PATHS[name] || "";
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}
var PATHS;
var init_icons = __esm({
  "src/lib/icons.js"() {
    PATHS = {
      "layout-dashboard": '<rect width="7" height="9" x="3" y="3" rx="1" /> <rect width="7" height="5" x="14" y="3" rx="1" /> <rect width="7" height="9" x="14" y="12" rx="1" /> <rect width="7" height="5" x="3" y="16" rx="1" />',
      "terminal": '<path d="M12 19h8" /> <path d="m4 17 6-6-6-6" />',
      "message-square": '<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />',
      "settings": '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" />',
      "chevron-right": '<path d="m9 18 6-6-6-6" />',
      "loader-circle": '<path d="M21 12a9 9 0 1 1-6.219-8.56" />',
      "zap": '<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" />',
      "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />',
      "square": '<rect width="18" height="18" x="3" y="3" rx="2" />',
      "refresh-cw": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" /> <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /> <path d="M8 16H3v5" />',
      "trash-2": '<path d="M10 11v6" /> <path d="M14 11v6" /> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /> <path d="M3 6h18" /> <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
      "send": '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /> <path d="m21.854 2.147-10.94 10.939" />',
      "search": '<path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" />',
      "x": '<path d="M18 6 6 18" /> <path d="m6 6 12 12" />',
      "check": '<path d="M20 6 9 17l-5-5" />',
      "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />',
      "cpu": '<path d="M12 20v2" /> <path d="M12 2v2" /> <path d="M17 20v2" /> <path d="M17 2v2" /> <path d="M2 12h2" /> <path d="M2 17h2" /> <path d="M2 7h2" /> <path d="M20 12h2" /> <path d="M20 17h2" /> <path d="M20 7h2" /> <path d="M7 20v2" /> <path d="M7 2v2" /> <rect x="4" y="4" width="16" height="16" rx="2" /> <rect x="8" y="8" width="8" height="8" rx="1" />',
      "power": '<path d="M12 2v10" /> <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />',
      "log-in": '<path d="m10 17 5-5-5-5" /> <path d="M15 12H3" /> <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />',
      "log-out": '<path d="m16 17 5-5-5-5" /> <path d="M21 12H9" /> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />',
      "play": '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />',
      "command": '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />',
      "plus": '<path d="M5 12h14" /> <path d="M12 5v14" />',
      "circle-alert": '<circle cx="12" cy="12" r="10" /> <line x1="12" x2="12" y1="8" y2="12" /> <line x1="12" x2="12.01" y1="16" y2="16" />',
      "wifi-off": '<path d="M12 20h.01" /> <path d="M8.5 16.429a5 5 0 0 1 7 0" /> <path d="M5 12.859a10 10 0 0 1 5.17-2.69" /> <path d="M19 12.859a10 10 0 0 0-2.007-1.523" /> <path d="M2 8.82a15 15 0 0 1 4.177-2.643" /> <path d="M22 8.82a15 15 0 0 0-11.288-3.764" /> <path d="m2 2 20 20" />',
      "download": '<path d="M12 15V3" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /> <path d="m7 10 5 5 5-5" />',
      "corner-down-left": '<path d="M20 4v7a4 4 0 0 1-4 4H4" /> <path d="m9 10-5 5 5 5" />',
      "sparkles": '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" />',
      "activity": '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />',
      "server": '<rect width="20" height="8" x="2" y="2" rx="2" ry="2" /> <rect width="20" height="8" x="2" y="14" rx="2" ry="2" /> <line x1="6" x2="6.01" y1="6" y2="6" /> <line x1="6" x2="6.01" y1="18" y2="18" />',
      "panel-left": '<rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M9 3v18" />',
      "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" />',
      "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /> <circle cx="12" cy="12" r="3" />',
      "eye-off": '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /> <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /> <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /> <path d="m2 2 20 20" />'
    };
  }
});

// src/modules/settings.js
function register(FEAR) {
  FEAR.create("settings", (sb) => {
    let model;
    let view = null;
    let mounted = false;
    const read = () => {
      try {
        return JSON.parse(localStorage.getItem(KEY)) || {};
      } catch {
        return {};
      }
    };
    const persist = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(model.toJSON()));
      } catch {
      }
    };
    const toast = (type, text) => sb.emit("toast", { type, text }).catch(() => {
    });
    const apply = (patch) => model.update(patch).then(() => {
      const snap = model.toJSON();
      return sb.emit("settings:changed", snap).then(() => snap);
    });
    const template = (s) => `
      <div class="page page-narrow">
        <header class="page-head">
          <h1>Settings</h1>
          <p class="muted">Stored in this browser only. Credentials are never saved: sign-in uses an httpOnly session cookie.</p>
        </header>
        <form class="panel form" id="settings-form" autocomplete="off" novalidate>
          <h2>${icon("sparkles")} Appearance</h2>
          <label class="field"><span>Animated background</span>
            <select class="bg-select" name="background">${["matrix", "network", "off"].map((m) => `<option value="${m}"${s.background === m ? " selected" : ""}>${m}</option>`).join("")}</select>
            <small>Applies immediately. Matrix rain or a cursor-reactive network, drawn on a canvas behind the UI. Pauses while the tab is hidden and stays still with reduced-motion on. Choose off on slow GPUs.</small>
          </label>

          <h2>${icon("server")} Agent API</h2>
          <label class="field"><span>API root</span>
            <input name="apiRoot" value="${esc(s.apiRoot)}" spellcheck="false" placeholder="https://host/fear/api">
            <small>Commands go to <code>{root}/agent</code>, sign-in to <code>{root}/auth</code>. Keep it same-origin with this page so the session cookie is sent.</small>
          </label>
          <div class="row"><button type="button" class="btn btn-test" data-test="agent">${icon("zap")} Test connection</button><span class="test-result" data-for="agent"></span></div>

          <h2>${icon("cpu")} Local LLM (Ollama)</h2>
          <label class="field"><span>Ollama host</span>
            <input name="ollamaHost" value="${esc(s.ollamaHost)}" spellcheck="false" placeholder="http://localhost:11434">
            <small>The browser talks to Ollama directly. Start it with <code>OLLAMA_ORIGINS</code> including this page's origin.</small>
          </label>
          <label class="field"><span>Default model</span>
            <input name="ollamaModel" value="${esc(s.ollamaModel)}" spellcheck="false" placeholder="chat-ai (leave empty to auto-pick)">
          </label>
          <label class="field"><span>System prompt</span>
            <textarea name="systemPrompt" rows="5" spellcheck="false">${esc(s.systemPrompt)}</textarea>
          </label>
          <div class="row"><button type="button" class="btn btn-test" data-test="ollama">${icon("zap")} Test Ollama</button><span class="test-result" data-for="ollama"></span></div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${icon("check")} Save</button>
            <button type="button" class="btn btn-ghost btn-reset">Reset to defaults</button>
          </div>
          <p class="form-error" role="alert"></p>
        </form>
      </div>`;
    const result = (which, ok, text) => view.el.find(`.test-result[data-for="${which}"]`).attr("class", `test-result ${ok ? "ok" : "bad"}`).text(text);
    const formValues = () => {
      const $f = view.el.find("#settings-form");
      const val = (n) => $f.find(`[name="${n}"]`).val();
      return {
        apiRoot: normUrl(val("apiRoot")),
        ollamaHost: normUrl(val("ollamaHost")),
        ollamaModel: String(val("ollamaModel") || "").trim(),
        systemPrompt: String(val("systemPrompt") || "").trim() || DEFAULT_PROMPT
      };
    };
    const events = {
      "change .bg-select": (e) => {
        apply({ background: e.currentTarget.value });
      },
      "submit #settings-form": function(e) {
        e.preventDefault();
        const v = formValues();
        const $err = view.el.find(".form-error");
        if (!validUrl(v.apiRoot)) return $err.text("API root must be a full http(s) URL.");
        if (!validUrl(v.ollamaHost)) return $err.text("Ollama host must be a full http(s) URL.");
        $err.text("");
        apply(v).then(() => toast("ok", "Settings saved"));
      },
      "click .btn-reset": function() {
        const d = defaults();
        apply({ ...d, collapsed: model.get("collapsed"), background: model.get("background") }).then(() => view.render(model.toJSON())).then(() => toast("ok", "Defaults restored"));
      },
      "click .btn-test": async function(e) {
        const which = $2(e.currentTarget).data("test");
        const v = formValues();
        result(which, true, "testing\u2026");
        try {
          if (which === "agent") {
            const res = await fetch(`${v.apiRoot}/agent/version`, { credentials: "include" });
            if (res.status === 401 || res.status === 403) return result(which, true, `reachable (HTTP ${res.status}: sign in as admin)`);
            result(which, res.ok, res.ok ? "reachable" : `HTTP ${res.status}`);
          } else {
            const res = await fetch(`${v.ollamaHost}/api/tags`);
            const data = await res.json();
            result(which, true, `${(data.models || []).length} model(s) found`);
          }
        } catch (err) {
          result(which, false, which === "ollama" ? "unreachable (is Ollama running? check OLLAMA_ORIGINS)" : `unreachable: ${err.message}`);
        }
      }
    };
    const mount = () => {
      view = sb.View({ el: "#view-settings", template, events });
      mounted = true;
      return view.render(model.toJSON());
    };
    const unmount = () => {
      if (mounted) {
        mounted = false;
        view.destroy();
      }
    };
    return {
      load() {
        model = sb.Model({ ...defaults(), ...read() });
        model.on("*", persist);
        sb.add("settings:get", () => model.toJSON());
        sb.add("settings:set", (patch) => apply(patch));
        sb.add("view:mount", (m) => m.name === "settings" ? mount() : void 0);
        sb.add("route:start", (m) => {
          if (mounted && m.path !== "settings") unmount();
        });
        return Promise.resolve();
      },
      unload() {
        unmount();
      }
    };
  });
}
var $2, KEY, DEFAULT_PROMPT, defaults, normUrl, validUrl;
var init_settings = __esm({
  "src/modules/settings.js"() {
    init_format();
    init_icons();
    $2 = window.jQuery;
    KEY = "fear.agent.settings.v1";
    DEFAULT_PROMPT = "You are FEAR, an assistant for security engineers and developers. Be concise and precise. Prefer defensive guidance: explain vulnerabilities, hardening, secure code, and how to detect and fix issues. Use fenced code blocks for code.";
    defaults = () => ({
      apiRoot: location.protocol.startsWith("http") ? `${location.origin}/fear/api` : "http://fear.dedyn.io:4000/fear/api",
      ollamaHost: "http://localhost:11434",
      ollamaModel: "",
      systemPrompt: DEFAULT_PROMPT,
      collapsed: false,
      background: "matrix"
      // matrix | network | off
    });
    normUrl = (v) => String(v || "").trim().replace(/\/+$/, "");
    validUrl = (v) => {
      try {
        const u = new URL(v);
        return /^https?:$/.test(u.protocol);
      } catch {
        return false;
      }
    };
  }
});

// src/modules/api.js
function register2(FEAR) {
  FEAR.create("api", (sb) => {
    let cfg = { apiRoot: "" };
    let user = null;
    let online = false;
    const root = () => String(cfg.apiRoot).replace(/\/+$/, "").replace(/\/agent$/, "");
    const notify = (ch, data) => sb.emit(ch, data).catch((e) => sb.warn(e));
    async function http(url, req) {
      const method = req && req.method || "GET";
      try {
        const hasBody = !!(req && req.body) && method !== "GET";
        const res = await fetch(url, {
          method,
          credentials: "include",
          headers: hasBody ? { "Content-Type": "application/json" } : void 0,
          body: hasBody ? JSON.stringify(req.body) : void 0,
          signal: req && req.signal
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message = data.message || data.error && data.error.message || `API error: ${res.status}`;
          return { ok: false, status: res.status, message, data };
        }
        return { ok: true, status: res.status, data };
      } catch (err) {
        return { ok: false, status: 0, message: err.message || "Network error", network: true };
      }
    }
    const status = () => ({ user, online });
    const publish = () => notify("session:changed", status());
    async function init() {
      const res = await http(`${root()}/agent/initialize`, { method: "POST" });
      online = res.ok;
      await notify("agent:status", { online, status: res.status, message: res.message });
      return res;
    }
    async function login(req) {
      const email = String(req && req.email || "").trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) return { ok: false, status: 400, message: "Invalid email address" };
      const res = await http(`${root()}/auth/login`, { method: "POST", body: { email, password: req.password } });
      if (!res.ok) return res;
      const u = res.data.data && res.data.data.user || res.data.result && res.data.result.user || {};
      user = { email: u.email || email, role: u.role };
      await publish();
      await init();
      return { ok: true, status: 200, user };
    }
    async function logout() {
      const res = await http(`${root()}/auth/logout`, { method: "POST" });
      user = null;
      online = false;
      await publish();
      await notify("agent:status", { online: false });
      return res;
    }
    async function restore() {
      const res = await http(`${root()}/auth/me`);
      const u = res.ok && res.data.data && res.data.data.user;
      if (u) {
        user = { email: u.email, role: u.role };
        await publish();
      }
      return init();
    }
    return {
      load() {
        return sb.fire("settings:get").then((s) => {
          cfg = s;
          sb.add("settings:changed", (s2) => {
            cfg = s2;
          });
          sb.add("session:get", () => status());
          sb.add("api:agent", (req) => http(`${root()}/agent${req.path}`, req));
          sb.add("api:auth", (req) => http(`${root()}/auth${req.path}`, req));
          sb.add("api:init", () => init());
          sb.add("api:restore", () => restore());
          sb.add("api:login", (req) => login(req));
          sb.add("api:logout", () => logout());
        });
      }
    };
  });
}
var init_api = __esm({
  "src/modules/api.js"() {
    init_format();
  }
});

// src/modules/overview.js
function register3(FEAR) {
  FEAR.create("overview", (sb) => {
    let view = null;
    let mounted = false;
    let poll = null;
    let data = null;
    let session = { user: null, online: false };
    let error = "";
    let loading = false;
    const toast = (type, text) => sb.emit("toast", { type, text }).catch(() => {
    });
    const stat = (ic, label, value, sub) => `
      <div class="stat"><div class="stat-ic">${icon(ic)}</div>
        <div><div class="stat-v">${esc(value)}</div><div class="stat-l">${esc(label)}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div></div>`;
    const template = () => {
      const s = data && data.stats || {};
      const v = data && data.version && (data.version.version || data.version.agentVersion);
      const mods = Object.entries(data && data.modules || {});
      const svcs = Object.entries(data && data.services || {});
      const offline = !session.online;
      return `
      <div class="page">
        <header class="page-head row-between">
          <div><h1>Overview</h1><p class="muted">${session.online ? "Agent connected" : "Agent offline"}${v ? ` \xB7 v${esc(v)}` : ""}${session.user ? ` \xB7 ${esc(session.user.email)}` : ""}</p></div>
          <div class="row">
            <button type="button" class="btn btn-ghost btn-refresh">${icon("refresh-cw", loading ? "spin" : "")} Refresh</button>
            <button type="button" class="btn btn-primary" data-action="goto:terminal">${icon("terminal")} Open terminal</button>
            <button type="button" class="btn" data-action="goto:chat">${icon("message-square")} AI chat</button>
          </div>
        </header>

        ${offline ? `
        <div class="callout">
          ${icon("wifi-off")}
          <div><strong>Agent not connected.</strong> ${esc(error || "Sign in with an admin account to use the agent.")}</div>
          <button type="button" class="btn btn-primary btn-sm" data-action="${session.user ? "retry" : "login"}">${session.user ? "Retry" : icon("log-in") + " Sign in"}</button>
        </div>` : ""}

        <div class="stat-grid">
          ${stat("cpu", "Modules loaded", s.modulesLoaded != null ? s.modulesLoaded : "\u2013")}
          ${stat("terminal", "Commands available", s.commandsAvailable != null ? s.commandsAvailable : "\u2013")}
          ${stat("zap", "Services running", s.servicesRunning != null ? s.servicesRunning : "\u2013", svcs.length ? `of ${svcs.length}` : "")}
          ${stat("activity", "Commands run", s.commandHistory != null ? s.commandHistory : "\u2013")}
        </div>

        <div class="cols">
          <section class="panel">
            <h2>${icon("cpu")} Modules</h2>
            ${mods.length ? `<ul class="rows">${mods.map(([n, m]) => `
              <li><span class="grow">${esc(m.displayName || n)}${m.provider ? ` <span class="muted">\xB7 ${esc(m.provider)}</span>` : ""}</span>
              <span class="pill ${m.status === "ready" && m.configured !== false ? "pill-ok" : m.status === "ready" ? "pill-warn" : "pill-bad"}"><i class="dot"></i>${m.status === "ready" && m.configured === false ? "not configured" : esc(m.status)}</span></li>`).join("")}</ul>` : `<p class="muted pad">${offline ? "Connect the agent to see its modules." : "No module data."}</p>`}
          </section>

          <div class="stack">
            <section class="panel">
              <h2>${icon("server")} Background services</h2>
              ${svcs.length ? `<ul class="rows">${svcs.map(([n, st]) => `
                <li><span class="grow mono">${esc(n)}</span>
                <span class="pill ${st === "running" ? "pill-ok" : ""}"><i class="dot"></i>${esc(st)}</span>
                <button type="button" class="btn btn-sm btn-svc" data-svc="${esc(n)}" data-to="${st === "running" ? "stop" : "start"}">${icon(st === "running" ? "square" : "play")} ${st === "running" ? "Stop" : "Start"}</button></li>`).join("")}</ul>` : `<p class="muted pad">No services registered.</p>`}
            </section>
            <section class="panel">
              <h2>${icon("zap")} Quick commands</h2>
              <div class="chips pad">${QUICK.map((c) => `<button type="button" class="chip btn-cmd" data-cmd="${c}">${c}</button>`).join("")}</div>
            </section>
          </div>
        </div>
      </div>`;
    };
    const draw = () => mounted && view.render({});
    const refresh = async () => {
      if (loading) return;
      loading = true;
      draw();
      const [res, ses] = await Promise.all([sb.fire("api:agent", { path: "/status" }), sb.fire("session:get")]);
      session = ses;
      if (res.ok && res.data.initialized !== false) {
        data = res.data;
        error = "";
      } else {
        data = res.ok ? null : data;
        error = res.ok ? "The agent has not been initialised." : res.message;
      }
      loading = false;
      draw();
    };
    const events = {
      "click .btn-refresh": () => refresh(),
      "click .btn-cmd": (e) => {
        location.hash = "terminal";
        sb.emit("terminal:run", { cmd: String($3(e.currentTarget).data("cmd")) });
      },
      "click .btn-svc": async (e) => {
        const $b = $3(e.currentTarget).prop("disabled", true);
        const res = await sb.fire("api:agent", { path: `/service/${$b.data("to")}`, method: "POST", body: { service: $b.data("svc") } });
        toast(res.ok ? "ok" : "bad", res.ok ? `Service ${$b.data("svc")}: ${$b.data("to")} requested` : res.message);
        refresh();
      }
    };
    const mount = () => {
      view = sb.View({ el: "#view-overview", template, events });
      mounted = true;
      draw();
      refresh();
      poll = sb.interval(() => document.hidden ? null : refresh(), 15e3);
      poll.promise.catch(() => {
      });
    };
    const unmount = () => {
      if (mounted) {
        mounted = false;
        poll && poll.stop();
        view.destroy();
      }
    };
    return {
      load() {
        sb.add("view:mount", (m) => {
          if (m.name === "overview") mount();
        });
        sb.add("route:start", (m) => {
          if (mounted && m.path !== "overview") unmount();
        });
        sb.add("agent:status", (s) => {
          session.online = !!s.online;
          if (mounted) refresh();
        });
        sb.add("session:changed", (s) => {
          session = s;
        });
        sb.add("overview:retry", () => sb.fire("api:init"));
      },
      unload() {
        unmount();
      }
    };
  });
}
var $3, QUICK;
var init_overview = __esm({
  "src/modules/overview.js"() {
    init_format();
    init_icons();
    $3 = window.jQuery;
    QUICK = ["status", "version", "service-list", "ai-status", "proxy-status", "help"];
  }
});

// src/modules/terminal.js
function register4(FEAR) {
  FEAR.create("terminal", (sb) => {
    const st = sb.Model({ busy: false, login: null });
    let entries = [
      { type: "banner", ts: /* @__PURE__ */ new Date() },
      { type: "output", content: "Initializing agent...", ts: /* @__PURE__ */ new Date() }
    ];
    let cmdHist = [];
    let hIdx = -1;
    let completions = [...LOCAL];
    let pending = [];
    let session = { user: null, online: false };
    let announced = null;
    let view = null;
    let mounted = false;
    let timer = null;
    let t0 = 0;
    let cfg = {};
    const agent = (path, method, body) => sb.fire("api:agent", { path, method: method || "GET", body });
    const must = async (path, method, body) => {
      const res = await agent(path, method, body);
      if (!res.ok) {
        const e = new Error(res.message);
        e.status = res.status;
        throw e;
      }
      return res.data;
    };
    const entryHtml = (e) => {
      const t = `<span class="t">${clock(e.ts)}</span>`;
      if (e.type === "banner") return `<pre class="tl-banner">${esc(LOGO)}

${esc(BANNER)}</pre>`;
      if (e.type === "input") return `<div class="tl tl-in">${t}<span class="chev">\u276F</span><span class="txt">${esc(e.content)}</span></div>`;
      if (e.type === "system") return `<div class="tl tl-sys">${t}<pre class="txt">${esc(e.content)}</pre></div>`;
      return `<div class="tl tl-out">${t}<pre class="txt">${highlight(e.content)}</pre></div>`;
    };
    const $log = () => view.el.find(".term-log");
    const scroll = () => {
      const s = view.el.find(".term-scroll")[0];
      if (s) s.scrollTop = s.scrollHeight;
    };
    const add = (type, content) => {
      const e = { type, content, ts: /* @__PURE__ */ new Date() };
      entries.push(e);
      if (mounted) {
        const $b = $log().find(".tl-busy");
        const $n = $4(entryHtml(e));
        $b.length ? $b.before($n) : $log().append($n);
        scroll();
      }
    };
    const syncPrompt = () => {
      if (!mounted) return;
      const lg = st.get("login");
      const $f = view.el.find(".term-field");
      $f.attr({
        type: lg && lg.step === "password" ? "password" : "text",
        placeholder: lg ? lg.step === "password" ? "Password" : "Email" : "Enter command\u2026",
        autocomplete: lg && lg.step === "password" ? "current-password" : "off"
      });
      const who = session.user ? session.user.email.split("@")[0] : "guest";
      view.el.find(".ps").text(lg ? lg.step === "password" ? "password" : "email" : `${who}@fear`);
      view.el.find(".term-state").attr("class", `pill ${session.online ? "pill-ok" : "pill-bad"} term-state`).html(`<i class="dot"></i>${session.online ? "connected" : "offline"}${session.user ? " \xB7 " + esc(session.user.email) : ""}`);
    };
    const syncBusy = () => {
      if (!mounted) return;
      const busy = st.get("busy");
      const $f = view.el.find(".term-field").prop("disabled", busy);
      $log().find(".tl-busy").remove();
      clearInterval(timer);
      if (busy) {
        $log().append(`<div class="tl tl-busy"><span class="t">${clock()}</span>${icon("loader-circle", "spin")}<span>processing\u2026 <b class="el">0.0s</b></span></div>`);
        timer = setInterval(() => $log().find(".el").text(((Date.now() - t0) / 1e3).toFixed(1) + "s"), 100);
        scroll();
      } else {
        $f.trigger("focus");
      }
    };
    const helpText = () => `SECURITY AI AGENT - COMMAND REFERENCE

ACCOUNT:
  login <email> <password>  - sign in (admin account required)
  login <email>             - sign in, asking for the password (hidden)
  login                     - sign in, asking for email and password
  logout

AI:
  ai-status, ai-provider, ai-explain, ai-threat
  ai-ask, ai-generate, chat-quick, chat-history, chat-clear

CVE & SECURITY:
  search-cve, check-cwe, check-package

CRYPTO:
  crypto-price, compare-rates, crypto-convert
  track-portfolio, market-summary

BACKGROUND SERVICES:
  service-list, service-status, service-start
  service-stop, service-restart, service-logs

PROXIES:
  proxy-status, list-proxies

SYSTEM:
  help, status, history, version, commands, clear, banner
  set-api <url> - Set API base URL

KEYS:
  Tab complete \xB7 \u2191/\u2193 history \xB7 Ctrl+L clear \xB7 Ctrl+K command palette

API Status: ${session.online ? "Connected" : "Disconnected"}
Signed in: ${session.user ? session.user.email : "no"}
API URL: ${cfg.apiRoot}/agent`;
    const performLogin = async (email, password) => {
      const res = await sb.fire("api:login", { email, password });
      if (!res.ok) return add("system", `Login failed: ${res.message}`);
      add("output", `Signed in as ${res.user.email}${res.user.role ? ` (${res.user.role})` : ""}`);
    };
    const handleLogin = async (line) => {
      const rest = line.replace(/^login\s*/, "");
      const m = rest.match(/^(\S+)\s+(\S.*)$/);
      if (m) return performLogin(m[1], m[2]);
      if (rest) {
        if (!EMAIL_PATTERN.test(rest)) return add("system", "Invalid email address");
        st.set("login", { step: "password", email: rest });
        return add("output", "Password:");
      }
      st.set("login", { step: "email" });
      return add("output", "Email:");
    };
    const dispatch = async (command, args, line) => {
      switch (command) {
        case "clear":
          entries = [{ type: "output", content: "Terminal cleared", ts: /* @__PURE__ */ new Date() }];
          if (mounted) $log().html(entryHtml(entries[0]));
          return;
        case "banner":
          return add("banner");
        case "set-api":
          if (args[0]) {
            await sb.fire("settings:set", { apiRoot: args[0].replace(/\/+$/, "").replace(/\/agent$/, "") });
            return add("output", `API base URL set to: ${cfg.apiRoot}/agent`);
          }
          return add("output", `Current API base URL: ${cfg.apiRoot}/agent`);
        case "login":
          return handleLogin(line);
        case "logout": {
          await sb.fire("api:logout");
          return add("output", "Signed out");
        }
        case "help":
          return add("output", helpText());
        case "status": {
          const r = await must("/status");
          let out = "SYSTEM STATUS\n\n";
          Object.entries(r.modules || {}).forEach(([n, m]) => {
            out += `${n.padEnd(25)} [${String(m.status).toUpperCase()}]
`;
          });
          const v = r.version && (r.version.version || r.version.agentVersion);
          if (v) out += `
Version: ${v}`;
          if (r.stats) out += `
Modules: ${r.stats.modulesLoaded}  Commands: ${r.stats.commandsAvailable}  Services running: ${r.stats.servicesRunning}`;
          return add("output", out);
        }
        case "history": {
          const r = await must(`/history?limit=${encodeURIComponent(args[0] || 20)}`);
          let out = "COMMAND HISTORY\n\n";
          (r.history || []).forEach((c, i) => {
            out += `${i + 1}. ${c}
`;
          });
          return add("output", out);
        }
        case "version": {
          const r = await must("/version");
          return add("output", `VERSION INFORMATION

Agent Version: ${r.version || r.agentVersion || "Unknown"}
Node Version: ${r.nodeVersion || "Unknown"}
Platform: ${r.platform || "Unknown"}
`);
        }
        case "commands": {
          const r = await must("/commands");
          let out = "AVAILABLE COMMANDS\n\n";
          Object.entries(r.commands || {}).forEach(([c, d]) => {
            out += `${c.padEnd(25)} - ${d && d.description || d}
`;
          });
          return add("output", out);
        }
        case "search-cve": {
          if (!args.length) return add("output", "Usage: search-cve <query>");
          const r = await must("/cve/search", "POST", { query: args.join(" ") });
          return add("output", r.output || "CVE search completed");
        }
        default: {
          const r = await must("/execute", "POST", { command, args });
          if (r.output) return add("output", r.output);
          return add("output", r.message || "Command executed successfully");
        }
      }
    };
    const drain = () => {
      if (pending.length && !st.get("busy")) {
        const n = pending.shift();
        execute(n.cmd, n.display);
      }
    };
    async function execute(cmd, display) {
      const line = cmd.trim();
      if (!line) return;
      if (st.get("busy")) {
        pending.push({ cmd, display });
        return;
      }
      add("input", display == null ? line : display);
      t0 = Date.now();
      await st.set("busy", true);
      const [command, ...args] = line.split(" ");
      try {
        await dispatch(command, args, line);
      } catch (err) {
        add("system", `Error: ${err.message}`);
        if (err.status === 401 || err.status === 403) add("output", "Sign in with an admin account: login <email> <password>");
        else add("output", "Check API connection and try again");
      } finally {
        await st.set("busy", false);
        drain();
      }
    }
    const submit = async () => {
      if (st.get("busy")) return;
      const $f = view.el.find(".term-field");
      const raw = String($f.val());
      const lg = st.get("login");
      if (lg) {
        const value = lg.step === "password" ? raw : raw.trim();
        if (!value) return;
        $f.val("");
        if (lg.step === "email") {
          add("input", value);
          if (!EMAIL_PATTERN.test(value)) return add("system", "Invalid email address, try again (Esc to cancel)");
          await st.set("login", { step: "password", email: value });
          return add("output", "Password:");
        }
        add("input", "********");
        await st.set("login", null);
        t0 = Date.now();
        await st.set("busy", true);
        try {
          await performLogin(lg.email, value);
        } finally {
          await st.set("busy", false);
          drain();
        }
        return;
      }
      if (!raw.trim()) return;
      const cmd = raw.trim();
      cmdHist.push(redactLogin(cmd));
      hIdx = -1;
      $f.val("");
      hideSuggest();
      execute(cmd, redactLogin(cmd));
    };
    const hideSuggest = () => view && view.el.find(".term-suggest").empty();
    const suggest = (list) => {
      view.el.find(".term-suggest").html(list.slice(0, 8).map((c) => `<button type="button" class="chip sg" data-c="${esc(c)}">${esc(c)}</button>`).join(""));
    };
    const matches = (v) => v && !/\s/.test(v) ? completions.filter((c) => c.startsWith(v) && c !== v) : [];
    const complete = () => {
      const $f = view.el.find(".term-field");
      const v = String($f.val());
      const m = matches(v);
      if (!m.length) return;
      if (m.length === 1) {
        $f.val(m[0] + " ");
        return hideSuggest();
      }
      let p = m[0];
      m.forEach((c) => {
        while (!c.startsWith(p)) p = p.slice(0, -1);
      });
      if (p.length > v.length) $f.val(p);
      suggest(m);
    };
    const template = () => `
      <div class="term">
        <div class="term-bar">
          <span class="pill term-state"></span>
          <div class="term-chips">${CHIPS.map((c) => `<button type="button" class="chip term-chip" data-cmd="${c}">${c}</button>`).join("")}</div>
          <button type="button" class="btn btn-ghost btn-sm term-clear" title="Clear (Ctrl+L)">${icon("trash-2")} Clear</button>
        </div>
        <div class="term-scroll"><div class="term-log"></div></div>
        <div class="term-suggest"></div>
        <form class="term-form" autocomplete="off">
          <span class="ps"></span><span class="chev">\u276F</span>
          <input class="term-field" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" aria-label="Command">
        </form>
      </div>`;
    const events = {
      "submit .term-form": (e) => {
        e.preventDefault();
        submit();
      },
      "input .term-field": () => {
        const m = matches(String(view.el.find(".term-field").val()));
        m.length ? suggest(m) : hideSuggest();
      },
      "keydown .term-field": (e) => {
        const lg = st.get("login");
        if (lg) {
          if (e.key === "Escape") {
            e.preventDefault();
            st.set("login", null);
            view.el.find(".term-field").val("");
            add("output", "Login cancelled");
          }
          if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
          return;
        }
        const $f = view.el.find(".term-field");
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (hIdx + 1 < cmdHist.length) {
            hIdx += 1;
            $f.val(cmdHist[cmdHist.length - 1 - hIdx]);
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (hIdx > 0) {
            hIdx -= 1;
            $f.val(cmdHist[cmdHist.length - 1 - hIdx]);
          } else if (hIdx === 0) {
            hIdx = -1;
            $f.val("");
          }
        } else if (e.key === "Tab") {
          e.preventDefault();
          complete();
        } else if (e.key === "l" && e.ctrlKey) {
          e.preventDefault();
          entries = [];
          $log().empty();
        }
      },
      "click .sg": (e) => {
        view.el.find(".term-field").val($4(e.currentTarget).data("c") + " ").trigger("focus");
        hideSuggest();
      },
      "click .term-chip": (e) => execute(String($4(e.currentTarget).data("cmd"))),
      "click .term-clear": () => execute("clear"),
      "click .term-scroll": () => {
        if (!String(window.getSelection())) view.el.find(".term-field").trigger("focus");
      }
    };
    const mount = () => {
      view = sb.View({ el: "#view-terminal", template, events });
      mounted = true;
      return view.render({}).then(() => {
        $log().html(entries.map(entryHtml).join(""));
        syncPrompt();
        syncBusy();
        scroll();
        view.el.find(".term-field").trigger("focus");
      });
    };
    const unmount = () => {
      if (mounted) {
        mounted = false;
        clearInterval(timer);
        view.destroy();
      }
    };
    const loadCompletions = async () => {
      const res = await agent("/commands");
      if (res.ok && res.data.commands) completions = [.../* @__PURE__ */ new Set([...LOCAL, ...Object.keys(res.data.commands)])].sort();
    };
    const onAgent = (s) => {
      session.online = !!s.online;
      const key = `${s.online}:${s.status || ""}`;
      if (key !== announced) {
        announced = key;
        if (s.online) {
          add("output", "Agent initialized successfully");
          add("output", 'Type "help" for commands, "status" for system status');
          loadCompletions();
        } else if (s.status === 401) add("system", "Not signed in. Use: login <email> <password>");
        else if (s.status === 403) add("system", `${s.message}. Sign in with an admin account: login <email> <password>`);
        else if (s.status === 404) add("system", "The agent API is disabled on this server (AGENT_API_ENABLED)");
        else if (s.status) add("system", `Agent initialization failed: ${s.message}`);
        else if (s.message) add("system", "Failed to connect to agent API");
        if (!s.online && s.message) add("output", "Running in offline mode with limited functionality");
      }
      syncPrompt();
    };
    return {
      load() {
        st.on("busy", syncBusy);
        st.on("login", syncPrompt);
        sb.add("agent:status", (s) => onAgent(s));
        sb.add("session:changed", (s) => {
          session.user = s.user;
          syncPrompt();
        });
        sb.add("settings:changed", (s) => {
          cfg = s;
        });
        sb.add("terminal:run", (m) => {
          execute(m.cmd);
        });
        sb.add("view:mount", (m) => m.name === "terminal" ? mount() : void 0);
        sb.add("route:start", (m) => {
          if (mounted && m.path !== "terminal") unmount();
        });
        return sb.fire("settings:get").then((s) => {
          cfg = s;
        });
      },
      unload() {
        unmount();
      }
    };
  });
}
var $4, LOGO, BANNER, LOCAL, CHIPS;
var init_terminal = __esm({
  "src/modules/terminal.js"() {
    init_format();
    init_icons();
    $4 = window.jQuery;
    LOGO = `
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@
@@!       @@!       @@!  @@@  @@!  @@@
!@!       !@!       !@!  @!@  !@!  @!@
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!
!!:       !!:       !!:  !!!  !!: :!!
:!:       :!:       :!:  !:!  :!:  !:!
 ::        :: ::::  ::   :::  ::   :::
 :        : :: ::    :   : :   :   : :`;
    BANNER = "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n SECURITY AI AGENT v2.4\n Advanced Security Testing Framework\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500";
    LOCAL = ["help", "status", "history", "version", "commands", "clear", "banner", "set-api", "login", "logout", "search-cve"];
    CHIPS = ["status", "help", "service-list", "ai-status", "version"];
  }
});

// src/modules/chat.js
function register5(FEAR) {
  FEAR.create("chat", (sb) => {
    const st = sb.Model({ busy: false, online: null, models: [] });
    let msgs = [];
    let cfg = {};
    let view = null;
    let mounted = false;
    let abort = null;
    let raf = 0;
    const toast = (type, text) => sb.emit("toast", { type, text }).catch(() => {
    });
    const model = () => cfg.ollamaModel || "";
    const $log = () => view.el.find(".chat-log");
    const nearBottom = () => {
      const s = view.el.find(".chat-scroll")[0];
      return !s || s.scrollHeight - s.scrollTop - s.clientHeight < 140;
    };
    const scroll = (force) => {
      const s = view.el.find(".chat-scroll")[0];
      if (s && (force || nearBottom())) s.scrollTop = s.scrollHeight;
    };
    const msgHtml = (m) => {
      const ai = m.role === "assistant";
      const label = m.role === "user" ? "you" : m.model || "assistant";
      const body = m.role === "user" ? `<div class="msg-body plain">${esc(m.content)}</div>` : m.error ? `<div class="msg-body plain">${esc(m.content)}</div>` : `<div class="msg-body md">${markdown(m.content)}${m.streaming ? '<span class="caret"></span>' : ""}</div>`;
      return `<article class="msg ${ai ? "msg-ai" : "msg-user"}${m.error ? " msg-err" : ""}" data-id="${m.id}">
        <div class="msg-head"><span class="msg-role">${esc(label)}</span><span class="msg-time">${clock(m.ts)}</span>
        <span class="msg-tools"><button type="button" class="icon-btn msg-copy" title="Copy">${icon("copy")}</button></span></div>${body}</article>`;
    };
    const emptyHtml = () => `
      <div class="chat-empty">
        <div class="empty-mark">${icon("sparkles")}</div>
        <h2>FEAR AI Chat</h2>
        <p class="muted">Runs on your local Ollama model. Nothing leaves your machine.</p>
        <div class="starters">${STARTERS.map((s) => `<button type="button" class="starter">${esc(s)}</button>`).join("")}</div>
      </div>`;
    const renderLog = () => {
      if (!mounted) return;
      $log().html(msgs.length ? msgs.map(msgHtml).join("") : emptyHtml());
      scroll(true);
    };
    const patchMsg = (m) => {
      if (!mounted) return;
      const $m = $log().find(`.msg[data-id="${m.id}"]`);
      if ($m.length) $m.replaceWith(msgHtml(m));
      else {
        $log().find(".chat-empty").remove();
        $log().append($5(msgHtml(m)).addClass("enter"));
      }
    };
    const syncUi = () => {
      if (!mounted) return;
      const busy = st.get("busy");
      const online = st.get("online");
      view.el.find(".composer").toggleClass("is-busy", busy);
      view.el.find(".btn-send").toggleClass("hidden", busy);
      view.el.find(".btn-stop").toggleClass("hidden", !busy);
      view.el.find(".chat-state").attr("class", `pill chat-state ${online ? "pill-ok" : online === false ? "pill-bad" : ""}`).html(`<i class="dot"></i>${online ? "ollama online" : online === false ? "ollama offline" : "checking\u2026"}`);
      const models = st.get("models");
      const cur = model();
      view.el.find(".model-select").html(
        (models.length ? models : [cur || "chat-ai"]).map((n) => `<option value="${esc(n)}"${n === cur ? " selected" : ""}>${esc(n)}</option>`).join("")
      ).prop("disabled", !models.length);
      view.el.find(".btn-regen").toggleClass("hidden", busy || !msgs.length);
    };
    const refreshModels = async () => {
      try {
        const res = await fetch(`${cfg.ollamaHost}/api/tags`);
        const data = await res.json();
        const names = (data.models || []).map((m) => m.name);
        await st.set("models", names);
        await st.set("online", true);
        if (names.length && !names.includes(cfg.ollamaModel)) {
          cfg = { ...cfg, ollamaModel: names.find((n) => n.split(":")[0] === "chat-ai") || names[0] };
        }
      } catch {
        await st.set("online", false);
        await st.set("models", []);
      }
      sb.emit("llm:status", { online: st.get("online") }).catch(() => {
      });
      syncUi();
    };
    const stream = async (history2, onToken, signal) => {
      const messages = [{ role: "system", content: cfg.systemPrompt }, ...history2.map((m) => ({ role: m.role, content: m.content }))];
      const res = await fetch(`${cfg.ollamaHost}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model(), messages, stream: true }),
        signal
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.json()).error || "";
        } catch {
        }
        throw new Error(`Ollama responded with ${res.status}${detail ? `: ${detail}` : ""}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (; ; ) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line) continue;
          let obj;
          try {
            obj = JSON.parse(line);
          } catch {
            continue;
          }
          if (obj.error) throw new Error(obj.error);
          if (obj.message && obj.message.content) onToken(obj.message.content);
        }
      }
    };
    const generate = async () => {
      const history2 = msgs.filter((m) => !m.error);
      const reply = { id: ++uid, role: "assistant", content: "", ts: /* @__PURE__ */ new Date(), model: model(), streaming: true };
      msgs.push(reply);
      patchMsg(reply);
      scroll(true);
      abort = new AbortController();
      await st.set("busy", true);
      syncUi();
      try {
        await stream(history2, (tok) => {
          reply.content += tok;
          if (!raf) raf = requestAnimationFrame(() => {
            raf = 0;
            patchMsg(reply);
            scroll();
          });
        }, abort.signal);
        if (!reply.content.trim()) throw new Error("The model returned an empty response");
      } catch (err) {
        if (err.name === "AbortError") {
          if (!reply.content) msgs = msgs.filter((m) => m !== reply);
        } else {
          msgs = msgs.filter((m) => m !== reply || reply.content);
          msgs.push({
            id: ++uid,
            role: "assistant",
            error: true,
            ts: /* @__PURE__ */ new Date(),
            content: `Error: ${err.message}
Make sure Ollama is running (${cfg.ollamaHost}), allows this origin (OLLAMA_ORIGINS) and the model "${model()}" is pulled.`
          });
          refreshModels();
        }
      } finally {
        reply.streaming = false;
        cancelAnimationFrame(raf);
        raf = 0;
        abort = null;
        await st.set("busy", false);
        renderLog();
        syncUi();
        if (mounted) view.el.find(".composer-field").trigger("focus");
      }
    };
    const send = (text) => {
      const content = String(text || "").trim();
      if (!content || st.get("busy")) return;
      msgs = msgs.filter((m) => !m.error);
      msgs.push({ id: ++uid, role: "user", content, ts: /* @__PURE__ */ new Date() });
      if (mounted) {
        view.el.find(".composer-field").val("").css("height", "auto");
        renderLog();
      }
      generate();
    };
    const regenerate = () => {
      if (st.get("busy")) return;
      while (msgs.length && msgs[msgs.length - 1].role !== "user") msgs.pop();
      if (!msgs.length) return;
      renderLog();
      generate();
    };
    const newChat = () => {
      if (abort) abort.abort();
      msgs = [];
      renderLog();
      syncUi();
      if (mounted) view.el.find(".composer-field").trigger("focus");
    };
    const template = () => `
      <div class="chat">
        <div class="chat-bar">
          <select class="model-select" aria-label="Model"></select>
          <span class="pill chat-state"></span>
          <span class="spacer"></span>
          <button type="button" class="btn btn-ghost btn-sm btn-regen hidden">${icon("refresh-cw")} Regenerate</button>
          <button type="button" class="btn btn-ghost btn-sm btn-refresh" title="Refresh models">${icon("refresh-cw")} Models</button>
          <button type="button" class="btn btn-ghost btn-sm btn-new" title="New chat (Ctrl+L)">${icon("plus")} New chat</button>
        </div>
        <div class="chat-scroll"><div class="chat-log"></div></div>
        <form class="composer">
          <textarea class="composer-field" rows="1" placeholder="Message the model\u2026  (Enter to send, Shift+Enter for a new line)" aria-label="Message"></textarea>
          <button type="submit" class="btn btn-primary btn-send" title="Send">${icon("send")}</button>
          <button type="button" class="btn btn-danger btn-stop hidden" title="Stop (Esc)">${icon("square")}</button>
        </form>
      </div>`;
    const grow = (el) => {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    };
    const events = {
      "submit .composer": (e) => {
        e.preventDefault();
        send(view.el.find(".composer-field").val());
      },
      "input .composer-field": (e) => grow(e.currentTarget),
      "keydown .composer-field": (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.originalEvent.isComposing) {
          e.preventDefault();
          send(e.currentTarget.value);
        } else if (e.key === "Escape" && abort) abort.abort();
        else if (e.key === "l" && e.ctrlKey) {
          e.preventDefault();
          newChat();
        }
      },
      "click .btn-stop": () => abort && abort.abort(),
      "click .btn-new": () => newChat(),
      "click .btn-regen": () => regenerate(),
      "click .btn-refresh": () => refreshModels(),
      "change .model-select": (e) => {
        const v = e.currentTarget.value;
        cfg = { ...cfg, ollamaModel: v };
        sb.fire("settings:set", { ollamaModel: v });
      },
      "click .starter": (e) => send($5(e.currentTarget).text()),
      "click .msg-copy": (e) => {
        const m = msgs.find((x) => x.id === +$5(e.currentTarget).closest(".msg").data("id"));
        if (m) copyText(m.content).then(() => toast("ok", "Copied"), () => toast("bad", "Copy failed"));
      },
      "click .copy-code": (e) => {
        const code = $5(e.currentTarget).closest(".codeblock").find("code").text();
        copyText(code).then(() => {
          const $b = $5(e.currentTarget).text("copied");
          setTimeout(() => $b.text("copy"), 1200);
        }, () => toast("bad", "Copy failed"));
      }
    };
    const mount = () => {
      view = sb.View({ el: "#view-chat", template, events });
      mounted = true;
      return view.render({}).then(() => {
        renderLog();
        syncUi();
        view.el.find(".composer-field").trigger("focus");
        if (st.get("online") === null || !st.get("models").length) refreshModels();
      });
    };
    const unmount = () => {
      if (mounted) {
        mounted = false;
        view.destroy();
      }
    };
    return {
      load() {
        st.on("busy", syncUi);
        sb.add("settings:changed", (s) => {
          const hostChanged = s.ollamaHost !== cfg.ollamaHost;
          cfg = s;
          if (hostChanged) refreshModels();
        });
        sb.add("chat:new", () => newChat());
        sb.add("view:mount", (m) => m.name === "chat" ? mount() : void 0);
        sb.add("route:start", (m) => {
          if (mounted && m.path !== "chat") unmount();
        });
        return sb.fire("settings:get").then((s) => {
          cfg = s;
        });
      },
      unload() {
        if (abort) abort.abort();
        unmount();
      }
    };
  });
}
var $5, STARTERS, uid;
var init_chat = __esm({
  "src/modules/chat.js"() {
    init_format();
    init_icons();
    $5 = window.jQuery;
    STARTERS = [
      "Explain CVE-2021-44228 and how to mitigate it",
      "Review this Express route for security issues",
      "What are the OWASP Top 10 risks for a Node API?",
      "Write a safe rate limiter middleware for Express"
    ];
    uid = 0;
  }
});

// src/modules/shell.js
function register6(FEAR) {
  FEAR.create("shell", (sb) => {
    let router = null;
    let session = { user: null, online: false };
    let llm = null;
    let palItems = [];
    let palSel = 0;
    let lastFocus = null;
    const go = (name) => {
      location.hash = name;
    };
    const runCmd = (cmd) => {
      go("terminal");
      sb.emit("terminal:run", { cmd });
    };
    const frame = (collapsed) => `
      <div class="app${collapsed ? " is-collapsed" : ""}">
        <aside class="side">
          <div class="brand"><span class="brand-mark">F</span><span class="brand-text"><b>FEAR</b><small>agent console</small></span></div>
          <nav class="nav" aria-label="Main">
            ${ROUTES.map((r) => `<a class="nav-item" href="#${r.name}" data-route="${r.name}" title="${r.label}">${icon(r.icon)}<span>${r.label}</span></a>`).join("")}
          </nav>
          <div class="side-foot">
            <div class="conn" data-conn></div>
            <button type="button" class="icon-btn side-toggle" data-action="collapse" title="Collapse sidebar">${icon("panel-left")}</button>
          </div>
        </aside>
        <div class="main">
          <header class="top">
            <div class="top-title"><h1 data-title></h1><span class="muted" data-sub></span></div>
            <span class="spacer"></span>
            <span class="pill" data-pill-agent></span>
            <button type="button" class="kbd-btn" data-action="palette" title="Command palette">${icon("search")}<span>Search or run\u2026</span><kbd>Ctrl K</kbd></button>
          </header>
          <main id="view" class="viewport" aria-live="polite"></main>
        </div>
      </div>
      <div class="palette hidden" data-palette role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="palette-box">
          <div class="palette-in">${icon("search")}<input class="palette-field" placeholder="Type a command or page\u2026" spellcheck="false" autocomplete="off"></div>
          <ul class="palette-list"></ul>
        </div>
      </div>
      <div class="modal hidden" data-modal role="dialog" aria-modal="true" aria-label="Sign in">
        <form class="modal-box" data-login-form autocomplete="on">
          <h2>${icon("shield")} Sign in</h2>
          <p class="muted">The agent API requires an admin account.</p>
          <label class="field"><span>Email</span><input name="email" type="email" autocomplete="username" required></label>
          <label class="field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required></label>
          <p class="form-error" role="alert"></p>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${icon("log-in")} Sign in</button>
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button>
          </div>
        </form>
      </div>
      <div class="toasts" aria-live="polite"></div>`;
    const renderStatus = () => {
      const { user, online } = session;
      $6("[data-conn]").html(`
        <span class="dot ${online ? "dot-ok" : "dot-bad"}"></span>
        <div class="conn-text"><div class="conn-title">${online ? "Agent online" : "Agent offline"}</div>
        <div class="conn-sub">${user ? esc(user.email) : "Not signed in"}</div></div>
        <button type="button" class="icon-btn" data-action="${user ? "logout" : "login"}" title="${user ? "Sign out" : "Sign in"}">${icon(user ? "log-out" : "log-in")}</button>`);
      $6("[data-pill-agent]").attr("class", `pill ${online ? "pill-ok" : "pill-bad"}`).html(`<i class="dot"></i>${online ? "agent" : "offline"}${llm === false ? "" : ""}`);
    };
    const toast = (t) => {
      const $t = $6(`<div class="toast toast-${t.type || "ok"}">${icon(t.type === "bad" ? "circle-alert" : "check")}<span>${esc(t.text)}</span></div>`);
      $6(".toasts").append($t);
      setTimeout(() => $t.addClass("out"), 3200);
      setTimeout(() => $t.remove(), 3600);
    };
    const buildItems = () => [
      ...ROUTES.map((r) => ({ group: "Go to", label: r.label, hint: r.sub, ic: r.icon, run: () => go(r.name) })),
      ...["status", "version", "service-list", "ai-status", "help"].map((c) => ({ group: "Run", label: c, hint: "in terminal", ic: "play", run: () => runCmd(c) })),
      { group: "Chat", label: "New chat", hint: "clear the transcript", ic: "plus", run: () => {
        go("chat");
        sb.emit("chat:new");
      } },
      { group: "Appearance", label: "Cycle background", hint: "matrix \xB7 network \xB7 off", ic: "sparkles", run: () => sb.fire("background:cycle") },
      session.user ? { group: "Account", label: "Sign out", hint: session.user.email, ic: "log-out", run: () => sb.fire("api:logout") } : { group: "Account", label: "Sign in", hint: "admin account", ic: "log-in", run: () => openLogin() }
    ];
    const drawPalette = () => {
      const q = String($6(".palette-field").val()).trim().toLowerCase();
      const score = (i) => i.label.toLowerCase().startsWith(q) ? 0 : i.label.toLowerCase().includes(q) ? 1 : 2;
      palItems = buildItems().filter((i) => !q || `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(q));
      if (q) palItems.sort((a, b) => score(a) - score(b));
      if (q) palItems.push({ group: "Run", label: q, hint: "run as terminal command", ic: "corner-down-left", run: () => runCmd(q) });
      palSel = Math.min(palSel, Math.max(palItems.length - 1, 0));
      let last = "";
      $6(".palette-list").html(palItems.map((i, n) => {
        const head = !q && i.group !== last ? `<li class="pal-group">${esc(i.group)}</li>` : "";
        last = i.group;
        return `${head}<li class="pal-item${n === palSel ? " sel" : ""}" data-i="${n}">${icon(i.ic)}<span class="grow">${esc(i.label)}</span><small>${esc(i.hint)}</small></li>`;
      }).join("") || '<li class="pal-empty">No matches</li>');
      const sel = $6(".pal-item.sel")[0];
      if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
    };
    const openPalette = () => {
      lastFocus = document.activeElement;
      palSel = 0;
      $6("[data-palette]").removeClass("hidden");
      $6(".palette-field").val("").trigger("focus");
      drawPalette();
    };
    const closePalette = () => {
      $6("[data-palette]").addClass("hidden");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const runPalette = (n) => {
      const item = palItems[n];
      closePalette();
      if (item) setTimeout(item.run, 0);
    };
    const openLogin = () => {
      lastFocus = document.activeElement;
      $6("[data-modal]").removeClass("hidden").find(".form-error").text("");
      $6("[data-login-form] [name=email]").trigger("focus");
    };
    const closeLogin = () => {
      $6("[data-modal]").addClass("hidden");
      $6("[data-login-form] [name=password]").val("");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const bind = () => {
      $6(document).on("click.shell", "[data-action]", (e) => {
        const a = String($6(e.currentTarget).data("action"));
        if (a.startsWith("goto:")) go(a.slice(5));
        else if (a === "login") openLogin();
        else if (a === "logout") sb.fire("api:logout").then(() => toast({ type: "ok", text: "Signed out" }));
        else if (a === "retry") sb.fire("api:init");
        else if (a === "palette") openPalette();
        else if (a === "close-modal") closeLogin();
        else if (a === "collapse") {
          const c = $6(".app").toggleClass("is-collapsed").hasClass("is-collapsed");
          sb.fire("settings:set", { collapsed: c });
        }
      }).on("keydown.shell", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          $6("[data-palette]").hasClass("hidden") ? openPalette() : closePalette();
        } else if (e.key === "Escape") {
          if (!$6("[data-palette]").hasClass("hidden")) closePalette();
          else if (!$6("[data-modal]").hasClass("hidden")) closeLogin();
        }
      }).on("input.shell", ".palette-field", () => {
        palSel = 0;
        drawPalette();
      }).on("keydown.shell", ".palette-field", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          palSel = (palSel + 1) % Math.max(palItems.length, 1);
          drawPalette();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          palSel = (palSel - 1 + palItems.length) % Math.max(palItems.length, 1);
          drawPalette();
        } else if (e.key === "Enter") {
          e.preventDefault();
          runPalette(palSel);
        }
      }).on("click.shell", ".pal-item", (e) => runPalette(+$6(e.currentTarget).data("i"))).on("mousedown.shell", "[data-palette]", (e) => {
        if ($6(e.target).is("[data-palette]")) closePalette();
      }).on("mousedown.shell", "[data-modal]", (e) => {
        if ($6(e.target).is("[data-modal]")) closeLogin();
      }).on("submit.shell", "[data-login-form]", async (e) => {
        e.preventDefault();
        const $f = $6(e.currentTarget);
        const $b = $f.find("[type=submit]").prop("disabled", true);
        const res = await sb.fire("api:login", { email: $f.find("[name=email]").val(), password: $f.find("[name=password]").val() });
        $b.prop("disabled", false);
        if (!res.ok) return $f.find(".form-error").text(res.message);
        closeLogin();
        toast({ type: "ok", text: `Signed in as ${res.user.email}` });
      });
    };
    const onRendered = (m) => {
      const r = ROUTES.find((x) => x.name === m.route) || ROUTES[0];
      $6(".nav-item").removeClass("active").removeAttr("aria-current").filter(`[data-route="${r.name}"]`).addClass("active").attr("aria-current", "page");
      $6("[data-title]").text(r.label);
      $6("[data-sub]").text(r.sub);
      $6(".app").attr("data-route", r.name);
    };
    const startRouter = () => {
      const routes = {};
      ROUTES.forEach((r) => {
        routes[r.name] = {
          name: r.name,
          title: `${r.label} \xB7 FEAR Agent`,
          html: `<section class="view" id="view-${r.name}" aria-label="${r.label}"></section>`,
          callback: () => sb.emit("view:mount", { name: r.name })
        };
      });
      router = sb.router({
        container: "#view",
        routes,
        defaultRoute: "overview",
        pushState: false,
        // navigate() with pushState never triggers a load; plain hash does
        hashNavigation: true,
        smoothScroll: false,
        animations: { enabled: true, fadeSpeed: 80 },
        loading: { enabled: false, template: "", minDisplay: 0 },
        accessibility: { announceRoutes: true, focusContent: false }
      });
      $6(window).on("hashchange.shell", () => {
        const n = location.hash.slice(1);
        if (n && !routes[n]) go("overview");
      });
      if (location.hash.slice(1) && !routes[location.hash.slice(1)]) location.hash = "overview";
      if (!location.hash) history.replaceState(null, "", "#overview");
      router.init();
    };
    return {
      load() {
        return sb.fire("settings:get").then((s) => {
          $6("#app").html(frame(s.collapsed));
          bind();
          renderStatus();
          sb.add("toast", (t) => toast(t));
          sb.add("router:rendered", (m) => onRendered(m));
          sb.add("session:changed", (s2) => {
            session = s2;
            renderStatus();
          });
          sb.add("agent:status", (s2) => {
            session.online = !!s2.online;
            renderStatus();
          });
          sb.add("llm:status", (s2) => {
            llm = s2.online;
          });
          startRouter();
        });
      },
      unload() {
        $6(document).off(".shell");
        $6(window).off(".shell");
        if (router) router.destroy();
      }
    };
  });
}
var $6, ROUTES;
var init_shell = __esm({
  "src/modules/shell.js"() {
    init_format();
    init_icons();
    $6 = window.jQuery;
    ROUTES = [
      { name: "overview", label: "Overview", icon: "layout-dashboard", sub: "Agent health, modules and services" },
      { name: "terminal", label: "Terminal", icon: "terminal", sub: "Run agent commands" },
      { name: "chat", label: "AI Chat", icon: "message-square", sub: "Local model via Ollama" },
      { name: "settings", label: "Settings", icon: "settings", sub: "API, model and prompt" }
    ];
  }
});

// src/modules/background.js
function register7(FEAR) {
  FEAR.create("background", (sb) => {
    let canvas = null;
    let ctx = null;
    let mode = "matrix";
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let t = 0;
    let cols = [];
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glows = () => {
      const r = Math.max(w, h);
      const orb = (x, y, rad, rgb, a) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      orb(w * (0.2 + 0.06 * Math.sin(t * 18e-5)), h * (0.02 + 0.05 * Math.cos(t * 23e-5)), r * 0.62, GREEN, 0.085);
      orb(w * (0.95 + 0.05 * Math.cos(t * 21e-5)), h * (1.05 + 0.05 * Math.sin(t * 17e-5)), r * 0.55, RED, 0.085);
    };
    const initMatrix = () => {
      const n = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      cols = Array.from({ length: n }, () => ({
        y: rnd(-rows, rows),
        speed: rnd(0.12, 0.42),
        red: Math.random() < 0.1,
        chars: Array.from({ length: TRAIL }, glyph)
      }));
    };
    const drawMatrix = () => {
      const rows = h / CELL;
      ctx.font = `${CELL - 3}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
      cols.forEach((c, i) => {
        c.y += reduced ? 0 : c.speed;
        if (c.y - TRAIL > rows) {
          c.y = rnd(-TRAIL, 0);
          c.speed = rnd(0.12, 0.42);
          c.red = Math.random() < 0.1;
        }
        if (Math.random() < 0.08) c.chars[Math.random() * TRAIL | 0] = glyph();
        const rgb = c.red ? RED : GREEN;
        for (let k = 0; k < TRAIL; k++) {
          const row = Math.floor(c.y) - k;
          if (row < 0 || row > rows) continue;
          const a = k === 0 ? 0.55 : 0.2 * (1 - k / TRAIL);
          ctx.fillStyle = k === 0 ? `rgba(215,255,232,${a})` : `rgba(${rgb},${a})`;
          ctx.fillText(c.chars[k], i * CELL, row * CELL);
        }
      });
    };
    const initNetwork = () => {
      const n = Math.max(28, Math.min(90, Math.round(w * h / 19e3)));
      nodes = Array.from({ length: n }, () => ({
        x: rnd(0, w),
        y: rnd(0, h),
        vx: rnd(-0.22, 0.22),
        vy: rnd(-0.22, 0.22),
        red: Math.random() < 0.12
      }));
    };
    const drawNetwork = () => {
      nodes.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${a.red || b.red ? RED : GREEN},${0.32 * (1 - d / LINK)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < LINK * 1.5) {
          ctx.strokeStyle = `rgba(${GREEN},${0.5 * (1 - dm / (LINK * 1.5))})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      nodes.forEach((p) => {
        ctx.fillStyle = `rgba(${p.red ? RED : GREEN},0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      glows();
      if (mode === "matrix") drawMatrix();
      else if (mode === "network") drawNetwork();
    };
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      t = now;
      last = now;
      frame();
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const run = () => {
      stop();
      if (mode === "off" || !ctx) return;
      if (reduced || document.hidden) {
        frame();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initMatrix();
      initNetwork();
      if (mode !== "off") frame();
    };
    const setMode = (m) => {
      mode = BG_MODES.includes(m) ? m : "matrix";
      $7("body").toggleClass("bg-live", mode !== "off");
      $7(canvas).toggleClass("hidden", mode === "off");
      if (mode === "off" && ctx) ctx.clearRect(0, 0, w, h);
      run();
    };
    let resizeTimer = 0;
    return {
      load() {
        canvas = document.createElement("canvas");
        canvas.className = "bg-canvas";
        canvas.setAttribute("aria-hidden", "true");
        document.body.prepend(canvas);
        ctx = canvas.getContext("2d");
        $7(window).on("resize.bg", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            resize();
            run();
          }, 150);
        }).on("mousemove.bg", (e) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        }).on("mouseleave.bg blur.bg", () => {
          mouse.x = -9999;
          mouse.y = -9999;
        });
        $7(document).on("visibilitychange.bg", run);
        sb.add("settings:changed", (s) => {
          if (s.background !== mode) setMode(s.background);
        });
        sb.add("background:cycle", () => {
          const next = BG_MODES[(BG_MODES.indexOf(mode) + 1) % BG_MODES.length];
          return sb.fire("settings:set", { background: next });
        });
        return sb.fire("settings:get").then((s) => {
          resize();
          setMode(s.background);
        });
      },
      unload() {
        stop();
        $7(window).off(".bg");
        $7(document).off(".bg");
        $7("body").removeClass("bg-live");
        if (canvas) canvas.remove();
      }
    };
  });
}
var $7, BG_MODES, GREEN, RED, GLYPHS, CELL, TRAIL, LINK, FRAME_MS, rnd, glyph;
var init_background = __esm({
  "src/modules/background.js"() {
    $7 = window.jQuery;
    BG_MODES = ["matrix", "network", "off"];
    GREEN = "43,255,136";
    RED = "236,17,17";
    GLYPHS = "0123456789abcdef<>/{}[]$#%&*+=;:".split("");
    CELL = 16;
    TRAIL = 16;
    LINK = 135;
    FRAME_MS = 1e3 / 30;
    rnd = (a, b) => a + Math.random() * (b - a);
    glyph = () => GLYPHS[Math.random() * GLYPHS.length | 0];
  }
});

// src/main.js
var require_main = __commonJS({
  "src/main.js"() {
    init_jquery_gui();
    init_settings();
    init_api();
    init_overview();
    init_terminal();
    init_chat();
    init_shell();
    init_background();
    FEAR$1.configure({ logLevel: 1 });
    [register, register7, register2, register3, register4, register5, register6].forEach((register8) => register8(FEAR$1));
    var order = ["settings", "background", "api", "overview", "terminal", "chat", "shell"];
    FEAR$1.utils.run.series(order.map((id) => () => FEAR$1.start(id))).then(() => FEAR$1.broker.emit("app:ready")).then(() => FEAR$1.broker.fire("api:restore")).catch((err) => {
      console.error(err);
      window.jQuery("#app").html(`<div class="boot boot-err">Failed to start: ${String(err && err.message || err).replace(/[<>&]/g, "")}</div>`);
    });
  }
});
export default require_main();
