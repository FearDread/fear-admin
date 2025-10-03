const Utils = {
    /* jQuery $.extend pointer */
    merge: $.extend,
    /*   Regex */
    fnRgx: / [^(]*\(([^)]*)\)/,
    /* Argument Regex */
    argRgx: /([^\s,]+)/g,

    each: (obj, iterator, context) => {
        var key, length, isPrimitive;

        if (obj) {
            if (is (obj)) {

                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (isArray(obj) || isArrayLike(obj)) {
                isPrimitive = typeof obj !== 'object';

                for (key = 0, length = obj.length; key < length; key++) {
                    if (isPrimitive || key in obj) {

                        iterator.call(context, obj[key], key, obj);
                    }
                }

            } else if (obj.forEach && obj.forEach !== forEach) {

                obj.forEach(iterator, context, obj);

            } else if (isBlankObject(obj)) {
                for (key in obj) {

                    iterator.call(context, obj[key], key, obj);
                }

            } else if (typeof obj.hasOwnProperty === ' ') {

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {

                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else {
                for (key in obj) {
                    if (hasOwnProperty.call(obj, key)) {

                        iterator.call(context, obj[key], key, obj);
                    }
                }
            }
        }

        return obj;
    },

    /* Shorthand reference to Object.prototype.hasOwnProperty */
    hasProp: {}.hasOwnProperty,
    /* Array.prototype.slice */
    slice: [].slice,

    /**
     * Attach child object prototype to parent object prototype 
     *
     * @param child {object} - object to merge prototype 
     * @param parent {object} - parent object prototype 
     * @return child {object} - combined child & parent prototypes 
    **/
    extend: (child, parent) => {
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
     * Check number of arguments passed to   / method
     *
     * @param fn { } -   to test
     * @param idx {int} - number of arguments to check for
     * @return argument length {int} - number of arguments actually passed to  
    **/
    hasArgs: (fn, idx) => {
        if (!idx || idx === null) {
            idx = 1;
        }

        return this.args(fn).length >= idx;
    },

    /**
    * Check if passed object is instance of Object
    *
    * @param obj {object} - object to check
    * @return boolean
    **/
    isObj: (obj) => {
        return $.isPlainObject(obj);
    },

    /**
    * Check if passed value is Array 
    *
    * @param arr {array} - array to check
    * @return boolean
    **/
    isArr: (arr) => {
        return $.isArray(arr); 
    },

    /**
    * Check if passed   is indeed type  
    *
    * @param obj {object} -   to check
    * @return boolean
    **/
    isFunc: (obj) => {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },

    /**
    * Check typeof of passed value to name 
    *
    * @param type {string} - string type to check against 
    * @return boolean
    **/
    isType: (type, val, name) => {
        if (typeof val !== type) {
            return 'Error :: ' + name + " must be of type " + type;
        }
    },

    /**
    * Check if valid string
    *
    * @param object - string to check
    * @return boolean
    **/
    isStr: (str) => {
        return (typeof str === 'string');
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

        switch(unit){
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
    rand:  (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
    * Returns list of argument names from   
    *
    * @param fn { } - the   to get arguments from 
    * @return {array}  
    **/
    args:  (fn) => {
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

            copy = ( () => {
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
    convertToEm:(value) => {
        return value * this.getFontsize();
    },

    /**
    * Compute passed value to point 
    *
    * @return {number} - computed point value 
    **/
    convertToPt:(value) => {
    
    },

    /**
    * Get computed fontsize from created element in pixels
    *
    * @return base {number} - computed fontsize
    **/
    convertBase:() => {
        var elem = document.createElement(), 
            style = elem.getAttribute('style');

        elem.setAttribute('style', style + ';font-size:1em !important');

        base = this.getFontsize();

        elem.setAttribute('style', style);

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
    mix:(giv, rec, override) => {
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

        if (!length || length === null) {
            length = 8;
        }

        while (id.length < length) {
            id += Math.random().toString(36).substr(2);
        }

        return id.substr(0, length);
    }
};

const Broker = (() => {

    function Broker(obj, cascade) {
        this.cascade = (cascade) ? true : false;
        this.channels = {};

        if (Utils.isObj(obj)) {
            this.install(obj);
        } else if (obj === true) {
            this.cascade = true;
        }
    }

    /**
     * Bind function to specific context
     * @param {Function} fn - function to bind
     * @param {Object} me - context to bind to
     * @return {Function} - bound function
     */
    Broker.prototype.bind = (fn, me) => {
        return (...args) => {
            return fn.apply(me, args);
        };
    };

    /**
     * Add subscription to a channel
     * @param {String} channel - channel name
     * @param {Function} fn - callback function
     * @param {Object} context - execution context
     * @return {Object} - subscription object with listen/ignore methods
     */
    Broker.prototype.add = function(channel, fn, context) {
        const _this = this;

        if (!context || context === null) context = this;
        if (!this.channels[channel]) this.channels[channel] = [];
        
        const subscription = {
            event: channel,
            context: context,
            callback: fn || function(){}
        };
      
        return {
            listen() {
                _this.channels[channel].push(subscription);
                return this;
            },
            ignore() {
                _this.remove(channel, fn, context);
                return this;
            }
        }.listen();
    };

    /**
     * Remove subscriptions from channels
     * @param {String|Function|Object} channel - channel name, callback function, or context object
     * @param {Function} cb - optional callback to remove
     * @param {Object} context - optional context to remove
     * @return {Broker} - this broker instance
     */
    Broker.prototype.remove = function(channel, cb, context) {
        switch (typeof channel) {
            case "string":
                if (typeof cb === "function") {
                    Broker._delete(this, channel, cb, context);
                } else if (typeof cb === "undefined") {
                    Broker._delete(this, channel);
                }
                break;

            case "function":
                for (const id in this.channels) {
                    Broker._delete(this, id, channel);
                }
                break;

            case "undefined":
                for (const id in this.channels) {
                    Broker._delete(this, id);
                }
                break;

            case "object":
                for (const id in this.channels) {
                    Broker._delete(this, id, null, channel);
                }
        }

        return this;
    };

    /**
     * Fire event on channel (first successful handler wins)
     * @param {String} channel - channel name
     * @param {*} data - data to pass to handlers
     * @return {Promise} - resolves with first successful result
     */
    Broker.prototype.fire = function(channel, data) {
        if (typeof channel !== "string") {
            return Promise.reject(new Error("Channel must be a string"));
        }

        if (typeof data === "function") data = undefined;

        const tasks = this._setup(data, channel, channel, this);

        if (tasks.length === 0) {
            return Promise.resolve(null);
        }

        return Utils.run.first(tasks)
            .catch(errors => {
                if (Utils.isArr(errors)) {
                    const errorMessages = errors
                        .filter(x => x !== null && x !== undefined)
                        .map(x => x.message || String(x));
                    
                    const error = new Error(errorMessages.join('; '));
                    error.originalErrors = errors;
                    throw error;
                }
                throw errors;
            });
    };
        
    /**
     * Emit event on channel (all handlers execute in series)
     * @param {String} channel - channel name
     * @param {*} data - data to pass to handlers
     * @param {String} origin - optional origin channel for cascade
     * @return {Promise} - resolves when all handlers complete
     */
    Broker.prototype.emit = function(channel, data, origin) {
        if (!origin || origin === null) origin = channel;

        if (data && Utils.isFunc(data)) data = undefined;

        if (typeof channel !== "string") {
            return Promise.reject(new Error("Channel must be a string"));
        }

        const tasks = this._setup(data, channel, origin, this);

        const emitPromise = Utils.run.series(tasks)
            .catch(errors => {
                if (Utils.isArr(errors)) {
                    const errorMessages = errors
                        .filter(x => x !== null && x !== undefined)
                        .map(x => x.message || String(x));
                    
                    const error = new Error(errorMessages.join('; '));
                    error.originalErrors = errors;
                    throw error;
                }
                throw errors;
            });

        // Handle cascading
        if (this.cascade) {
            const channels = channel.split('/');
            if (channels.length > 1) {
                const parentChannel = channels.slice(0, -1).join('/');
                const originToUse = this.fireOrigin ? origin : parentChannel;
                
                return emitPromise.then(result => {
                    return this.emit(parentChannel, data, originToUse)
                        .then(() => result);
                });
            }
        }

        return emitPromise;
    };

    /**
     * Install broker methods on target object
     * @param {Object} obj - target object
     * @param {Boolean} forced - whether to override existing properties
     * @return {Broker} - this broker instance
     */
    Broker.prototype.install = function(obj, forced) {
        if (Utils.isObj(obj)) {
            for (const key in this) {
                const value = this[key];
                
                if (typeof value === 'function') {
                    if (forced || !obj[key]) {
                        obj[key] = value.bind(this);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Remove specific subscriptions from a channel
     * @param {Object} obj - broker instance
     * @param {String} channel - channel name
     * @param {Function} cb - callback to remove
     * @param {Object} context - context to remove
     * @return {Array} - remaining subscriptions
     */
    Broker._delete = function(obj, channel, cb, context) {
        if (!obj.channels[channel]) {
            return [];
        }

        obj.channels[channel] = obj.channels[channel].filter(subscription => {
            // Keep subscription if none of the removal criteria match
            if (cb && subscription.callback === cb) return false;
            if (context && subscription.context === context) return false;
            if (!cb && !context && subscription.context === obj) return false;
            return true;
        });

        return obj.channels[channel];
    };

    /**
     * Setup tasks for event execution
     * @param {*} data - data to pass to handlers
     * @param {String} channel - channel name
     * @param {String} origin - origin channel
     * @param {Object} context - broker context
     * @return {Array} - array of task functions
     */
    Broker.prototype._setup = function(data, channel, origin, context) {
        const subscribers = context.channels[channel] || [];
        
        return subscribers.map(sub => {
            return () => {
                return new Promise((resolve, reject) => {
                    try {
                        // Check if callback expects a callback parameter (async style)
                        if (Utils.hasArgs(sub.callback, 3)) {
                            sub.callback.call(sub.context, data, origin, (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        } else {
                            // Synchronous callback or returns a promise
                            const result = sub.callback.call(sub.context, data, origin);
                            
                            // If result is a promise, use it directly
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
            };
        });
    };

    /**
     * Pipe events from one channel to another
     * @param {String} src - source channel
     * @param {String} target - target channel
     * @param {Broker} broker - broker to pipe to (defaults to this)
     * @return {Broker} - this broker instance
     */
    Broker.prototype.pipe = function(src, target, broker) {
        // Handle parameter variations
        if (target instanceof Broker) {
            broker = target;
            target = src;
        }

        if (!broker) {
            return this.pipe(src, target, this);
        }

        if (broker === this && src === target) {
            return this;
        }

        this.add(src, (...args) => {
            return broker.fire(target, ...args);
        });

        return this;
    };

    /**
     * Create a channel that only fires once
     * @param {String} channel - channel name
     * @param {Function} fn - callback function
     * @param {Object} context - execution context
     * @return {Object} - subscription object
     */
    Broker.prototype.once = function(channel, fn, context) {
        const _this = this;
        let fired = false;

        const onceWrapper = function(...args) {
            if (!fired) {
                fired = true;
                _this.remove(channel, onceWrapper);
                return fn.apply(this, args);
            }
        };

        return this.add(channel, onceWrapper, context);
    };

    /**
     * Wait for an event to be fired
     * @param {String} channel - channel name
     * @param {Number} timeout - optional timeout in milliseconds
     * @return {Promise} - resolves when event fires or rejects on timeout
     */
    Broker.prototype.waitFor = function(channel, timeout) {
        return new Promise((resolve, reject) => {
            let timeoutId;

            const cleanup = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            // Set up timeout if specified
            if (timeout && timeout > 0) {
                timeoutId = setTimeout(() => {
                    this.remove(channel, handler);
                    reject(new Error(`Timeout waiting for event '${channel}' after ${timeout}ms`));
                }, timeout);
            }

            // Set up event handler
            const handler = (data, origin) => {
                cleanup();
                this.remove(channel, handler);
                resolve({ data, origin, channel });
            };

            this.add(channel, handler);
        });
    };

    /**
     * Get all active channels
     * @return {Array} - array of channel names
     */
    Broker.prototype.getChannels = function() {
        return Object.keys(this.channels).filter(channel => 
            this.channels[channel] && this.channels[channel].length > 0
        );
    };

    /**
     * Get subscriber count for a channel
     * @param {String} channel - channel name
     * @return {Number} - number of subscribers
     */
    Broker.prototype.getSubscriberCount = function(channel) {
        return this.channels[channel] ? this.channels[channel].length : 0;
    };

    /**
     * Clear all subscriptions from all channels
     * @return {Broker} - this broker instance
     */
    Broker.prototype.clear = function() {
        this.channels = {};
        return this;
    };

    /**
     * Create a namespaced broker that prefixes all channel names
     * @param {String} namespace - namespace prefix
     * @return {Object} - namespaced broker interface
     */
    Broker.prototype.namespace = function(namespace) {
        const _this = this;
        const separator = '/';

        return {
            add: (channel, fn, context) => _this.add(namespace + separator + channel, fn, context),
            remove: (channel, cb, context) => _this.remove(namespace + separator + channel, cb, context),
            fire: (channel, data) => _this.fire(namespace + separator + channel, data),
            emit: (channel, data, origin) => _this.emit(namespace + separator + channel, data, origin),
            once: (channel, fn, context) => _this.once(namespace + separator + channel, fn, context),
            waitFor: (channel, timeout) => _this.waitFor(namespace + separator + channel, timeout),
            pipe: (src, target, broker) => _this.pipe(namespace + separator + src, namespace + separator + target, broker),
            getSubscriberCount: (channel) => _this.getSubscriberCount(namespace + separator + channel)
        };
    };

    return Broker;

})();

const SandBox = (() => {
    const DELIM = '__';

    return function() {
        return {
        // create new API sandbox instance
        create: ($gui, instance, options, module) => {
            const sandbox = {
                id: instance,
                module: module,
                options: options || {}
            };

            /* Attach Broker methods to sandbox api */ 
            $gui._broker.install(sandbox);
            sandbox.broker = $gui._broker;
            sandbox.Event = $gui.Event;
            /* Add Utils object to sandbox api */
            sandbox.Utils = $gui.Utils;

             
            /* jQuery wrappers - converted to Promise-based */
            sandbox.fetch = (url, settings = {}) => {
                return new Promise((resolve, reject) => {
                    const ajaxSettings = {
                        ...settings,
                        success: (data, textStatus, jqXHR) => {
                            resolve({ data, textStatus, jqXHR });
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            const error = new Error(textStatus || 'Ajax request failed');
                            error.jqXHR = jqXHR;
                            error.textStatus = textStatus;
                            error.errorThrown = errorThrown;
                            reject(error);
                        }
                    };

                    if (typeof url === 'string') {
                        ajaxSettings.url = url;
                    } else if (typeof url === 'object') {
                        Object.assign(ajaxSettings, url);
                    }

                    $.ajax(ajaxSettings);
                });
            };

            sandbox.data = $.data;
            sandbox.deferred = () => $.Deferred();
            sandbox.animation = $.Animation;

            /* Module Namespaces */ 
            SandBox.Event = $gui.Event;
            sandbox.ui = {};
            sandbox.dom = {};
            sandbox.net = {};

            /**
             * Search DOM for selector and wrap with both native and jQuery helper methods 
             *
             * @param selector {string} - the element to scan DOM for
             * @param context {object} - optional context object to be applied to returned object wrapper
             * @return {object} - enhanced jQuery wrapped element DOM object 
            **/
            sandbox.query = (selector, context) => {
                let $el;
                
                // check for applied context
                if (context && context.find) {
                    // use dom find
                    $el = context.find(selector);
                } else {
                    // wrap with jQuery
                    $el = $(selector);
                }

                // Enhanced jQuery object with additional methods
                const enhancedEl = Object.create($el);
                
                // Copy jQuery properties and methods
                Object.setPrototypeOf(enhancedEl, $el);
                enhancedEl.length = $el.length;

                // Add custom methods
                enhancedEl.query = (sel) => {
                    return sandbox.query(sel, $el);
                };

                enhancedEl.create = (el) => {
                    if (!Utils.isStr(el)) {
                        sandbox.warn('Error :: Element must be type String.');
                        return false;
                    }

                    return document.createElement(el);
                };

                enhancedEl.size = () => {
                    return parseFloat(
                        window.getComputedStyle($el[0] || $el).fontSize
                    );
                };

                // Promise-based animation helper
                enhancedEl.animateAsync = (properties, duration, easing) => {
                    return new Promise((resolve, reject) => {
                        try {
                            $el.animate(properties, {
                                duration: duration,
                                easing: easing,
                                complete: () => resolve(enhancedEl),
                                fail: (error) => reject(error)
                            });
                        } catch (error) {
                            reject(error);
                        }
                    });
                };

                // Promise-based event handling
                enhancedEl.onAsync = (event, selector) => {
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

                return enhancedEl;
            };

            /**
             * Assign $ as shorthand query method 
            **/
            sandbox.$ = sandbox.query;

            /**
             * Reference Utils / jQuery each method 
            **/
            sandbox.each = $.each;

            /**
             * Promise-based timeout method 
             *
             * @param ms {number} - milliseconds to wait
             * @param fn {function} - optional function to execute after timeout
             * @return {Promise} - resolves after the specified time
            **/
            sandbox.timeout = (ms, fn) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (fn && typeof fn === 'function') {
                            const result = fn();
                            resolve(result);
                        } else {
                            resolve();
                        }
                    }, ms);
                });
            };

            /**
             * Promise-based interval method that can be cancelled
             *
             * @param fn {function} - function to execute on each interval
             * @param ms {number} - milliseconds between executions
             * @param maxRuns {number} - optional maximum number of runs
             * @return {object} - object with stop method and promise that resolves when done
            **/
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
             * Reference $gui core log method 
             *
             * @return {function} 
            **/
            sandbox.log = (...args) => {
                return $gui.debug.log(...args);
            };

            /**
             * Reference $gui core warn method 
             *
             * @return {function}
            **/
            sandbox.warn = (...args) => {
                return $gui.debug.warn(...args);
            };

            /**
             * Get location with stored reference to window object 
             *
             * @return {object} - specific window reference location 
            **/
            sandbox.getLocation = () => {
                const win = $gui.config.win;
                return win && win.location;
            };

            /**
             * Take function and apply new context when executed 
             * 
             * @param fn {function} - the function to swap contexts 
             * @return {function} - executes fn 
            **/
            sandbox.hitch = (fn, ...initialArgs) => {
                return function(...args) {
                    const allArgs = initialArgs.concat(args);
                    return fn.apply(this, allArgs);
                };
            };

            /**
             * Cache the results of a function call with Promise support
             * 
             * @param source {function} - the function to execute and store 
             * @param cache {object} - optional store to keep cached results 
             * @param refetch {string} - optional key to update in cache
             * @return {function} - memoized function that returns cached results 
            **/
            sandbox.memoize = (source, cache, refetch) => {
                cache = cache || {};

                return (...args) => {
                    const key = args.length > 1 ? args.join(DELIM) : String(args[0] || '');

                    if (!(key in cache) || (refetch && cache[key] === refetch)) {
                        const result = source.apply(source, args);
                        
                        // If the result is a promise, cache the promise
                        if (result && typeof result.then === 'function') {
                            cache[key] = result.catch(error => {
                                // Remove failed promises from cache so they can be retried
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
             * Promise-based resource loader
             *
             * @param resources {array|string} - URLs or resource objects to load
             * @param options {object} - loading options
             * @return {Promise} - resolves when all resources are loaded
            **/
            sandbox.loadResources = (resources, options = {}) => {
                const resourceArray = Array.isArray(resources) ? resources : [resources];
                
                const loadPromises = resourceArray.map(resource => {
                    if (typeof resource === 'string') {
                        // Determine resource type by extension or explicit type
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
             *
             * @param url {string} - CSS file URL
             * @return {Promise} - resolves when CSS is loaded
            **/
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
             *
             * @param url {string} - JavaScript file URL
             * @return {Promise} - resolves when script is loaded
            **/
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

            /**
             * Wait for DOM ready state
             *
             * @return {Promise} - resolves when DOM is ready
            **/
            sandbox.ready = () => {
                return new Promise((resolve) => {
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        resolve();
                    } else {
                        $(document).ready(resolve);
                    }
                });
            };

            /**
             * Wait for window load event
             *
             * @return {Promise} - resolves when window is fully loaded
            **/
            sandbox.loaded = () => {
                return new Promise((resolve) => {
                    if (document.readyState === 'complete') {
                        resolve();
                    } else {
                        $(window).on('load', resolve);
                    }
                });
            };

            return sandbox;
        }
    };
}
})();

const Event = (() => {

    function Event() {
        this._observers = new Map();
        this._onceHandlers = new WeakSet();
    }

    /**
     * Determine if current device is mobile based on user agent
     * @param {string} agent - the user agent string (defaults to navigator.userAgent)
     * @return {boolean} true if mobile device detected
     */
    Event.prototype.isMobile = function (agent) {
        if (!agent) {
            agent = navigator.userAgent || '';
        }
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    /**
     * Create new custom event with modern GUI support
     * @param {string} eventName - name of the event
     * @param {object} options - event configuration
     * @param {boolean} options.bubbles - whether event should bubble (default: false)
     * @param {boolean} options.cancelable - whether event is cancelable (default: false)
     * @param {*} options.detail - optional data payload (default: null)
     * @return {Event} new custom event
     */
    Event.prototype.create = function (eventName, options = {}) {
        const {
            bubbles = false,
            cancelable = false,
            detail = null
        } = options;

        // Modern browsers with CustomEvent constructor
        if (typeof CustomEvent === 'function') {
            return new CustomEvent(eventName, {
                bubbles,
                cancelable,
                detail
            });
        }
        // Fallback for older browsers
        else if (document.createEvent) {
            const customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(eventName, bubbles, cancelable, detail);
            return customEvent;
        }
        // IE 8 and below
        else if (document.createEventObject) {
            const customEvent = document.createEventObject();
            customEvent.eventType = eventName;
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.detail = detail;
            return customEvent;
        }
        // Ultimate fallback
        else {
            return {
                type: eventName,
                eventName: eventName,
                bubbles: bubbles,
                cancelable: cancelable,
                detail: detail,
                timeStamp: Date.now()
            };
        }
    };

    /**
     * Fire event on element with Promise support
     * @param {Element} elem - the DOM element
     * @param {Event|string} event - the event object or event name
     * @param {object} detail - optional event detail data
     * @return {Promise<boolean>} resolves with dispatch result
     */
    Event.prototype.fire = function (elem, event, detail) {
        return new Promise((resolve, reject) => {
            try {
                if (!elem) {
                    reject(new Error('Element is required'));
                    return;
                }

                let eventObj;

                // If event is a string, create the event
                if (typeof event === 'string') {
                    eventObj = this.create(event, { detail });
                } else {
                    eventObj = event;
                }

                if (!eventObj) {
                    reject(new Error('Invalid event'));
                    return;
                }

                // Modern browsers
                if (elem.dispatchEvent) {
                    const result = elem.dispatchEvent(eventObj);
                    resolve(result);
                }
                // IE 8 and below
                else if (elem.fireEvent && eventObj.eventType) {
                    const result = elem.fireEvent('on' + eventObj.eventType, eventObj);
                    resolve(result);
                }
                // Direct property access fallback
                else if (eventObj.type || eventObj.eventName) {
                    const eventName = eventObj.type || eventObj.eventName;
                    if (elem[eventName]) {
                        elem[eventName]();
                        resolve(true);
                    } else if (elem['on' + eventName]) {
                        elem['on' + eventName]();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    /**
     * Add event listener with Promise-based handling
     * @param {Element} elem - the DOM element
     * @param {string} eventName - event name (without 'on' prefix)
     * @param {function} handler - event handler function
     * @param {object} options - event listener options
     * @return {Promise<object>} resolves with removal function
     */
    Event.prototype.add = function (elem, eventName, handler, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                if (!elem || !eventName || !handler) {
                    reject(new Error('Element, event name, and handler are required'));
                    return;
                }

                const { passive = false, once = false, capture = false } = options;

                let wrappedHandler = handler;

                // Handle once option manually for older browsers
                if (once && !elem.addEventListener) {
                    wrappedHandler = function (...args) {
                        const result = handler.apply(this, args);
                        Event.prototype.remove.call(this, elem, eventName, wrappedHandler);
                        return result;
                    };
                    this._onceHandlers.add(wrappedHandler);
                }

                // Modern browsers
                if (elem.addEventListener) {
                    const listenerOptions = typeof options === 'boolean' ? capture : {
                        passive,
                        once,
                        capture
                    };

                    elem.addEventListener(eventName, wrappedHandler, listenerOptions);
                }
                // IE 8 and below
                else if (elem.attachEvent) {
                    elem.attachEvent('on' + eventName, wrappedHandler);
                }
                // Direct property assignment fallback
                else {
                    elem['on' + eventName] = wrappedHandler;
                }

                // Store observer for tracking
                const observerKey = `${eventName}_${handler.toString()}`;
                if (!this._observers.has(elem)) {
                    this._observers.set(elem, new Map());
                }
                this._observers.get(elem).set(observerKey, { handler: wrappedHandler, eventName });

                // Return removal function
                resolve({
                    remove: () => this.remove(elem, eventName, wrappedHandler),
                    element: elem,
                    eventName: eventName,
                    handler: wrappedHandler
                });

            } catch (error) {
                reject(error);
            }
        });
    };

    /**
     * Remove event listener
     * @param {Element} elem - the DOM element
     * @param {string} eventName - event name (without 'on' prefix)
     * @param {function} handler - event handler function to remove
     * @return {Promise<boolean>} resolves with success status
     */
    Event.prototype.remove = function (elem, eventName, handler) {
        return new Promise((resolve) => {
            try {
                if (!elem || !eventName) {
                    resolve(false);
                    return;
                }

                // Modern browsers
                if (elem.removeEventListener) {
                    elem.removeEventListener(eventName, handler, false);
                }
                // IE 8 and below
                else if (elem.detachEvent) {
                    elem.detachEvent('on' + eventName, handler);
                }
                // Direct property removal fallback
                else {
                    delete elem['on' + eventName];
                }

                // Clean up tracking
                if (this._observers.has(elem)) {
                    const elemObservers = this._observers.get(elem);
                    const observerKey = `${eventName}_${handler.toString()}`;
                    elemObservers.delete(observerKey);

                    if (elemObservers.size === 0) {
                        this._observers.delete(elem);
                    }
                }

                resolve(true);

            } catch (error) {
                resolve(false);
            }
        });
    };

    /**
     * Add event listener that only fires once
     * @param {Element} elem - the DOM element
     * @param {string} eventName - event name
     * @param {function} handler - event handler function
     * @return {Promise<object>} resolves with event data when fired
     */
    Event.prototype.once = function (elem, eventName, handler) {
        return new Promise((resolve, reject) => {
            const onceHandler = (event) => {
                this.remove(elem, eventName, onceHandler)
                    .then(() => {
                        try {
                            const result = handler ? handler(event) : event;
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    });
            };

            this.add(elem, eventName, onceHandler)
                .catch(reject);
        });
    };

    /**
     * Wait for an event to occur
     * @param {Element} elem - the DOM element
     * @param {string} eventName - event name to wait for
     * @param {number} timeout - optional timeout in milliseconds
     * @return {Promise<Event>} resolves with event when fired
     */
    Event.prototype.waitFor = function (elem, eventName, timeout) {
        return new Promise((resolve, reject) => {
            let timeoutId;

            if (timeout && timeout > 0) {
                timeoutId = setTimeout(() => {
                    reject(new Error(`Timeout waiting for '${eventName}' event after ${timeout}ms`));
                }, timeout);
            }

            this.once(elem, eventName, (event) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(event);
            }).catch(reject);
        });
    };

    /**
     * Get viewport inner height cross-browser
     * @return {number} viewport height in pixels
     */
    Event.prototype.innerHeight = function () {
        // Modern browsers
        if (typeof window.innerHeight === 'number') {
            return window.innerHeight;
        }
        // IE 6-8 in standards mode
        else if (document.documentElement && typeof document.documentElement.clientHeight === 'number') {
            return document.documentElement.clientHeight;
        }
        // IE 6 in quirks mode
        else if (document.body && typeof document.body.clientHeight === 'number') {
            return document.body.clientHeight;
        }

        return 0;
    };

    /**
     * Get viewport inner width cross-browser
     * @return {number} viewport width in pixels
     */
    Event.prototype.innerWidth = function () {
        // Modern browsers
        if (typeof window.innerWidth === 'number') {
            return window.innerWidth;
        }
        // IE 6-8 in standards mode
        else if (document.documentElement && typeof document.documentElement.clientWidth === 'number') {
            return document.documentElement.clientWidth;
        }
        // IE 6 in quirks mode
        else if (document.body && typeof document.body.clientWidth === 'number') {
            return document.body.clientWidth;
        }

        return 0;
    };

    /**
     * Get element's computed style property
     * @param {Element} elem - the DOM element
     * @param {string} property - CSS property name
     * @return {Promise<string>} resolves with computed style value
     */
    Event.prototype.getComputedStyle = function (elem, property) {
        return new Promise((resolve, reject) => {
            try {
                if (!elem) {
                    reject(new Error('Element is required'));
                    return;
                }

                // Modern browsers
                if (window.getComputedStyle) {
                    const computed = window.getComputedStyle(elem);
                    resolve(computed.getPropertyValue(property) || computed[property]);
                }
                // IE 8 and below
                else if (elem.currentStyle) {
                    resolve(elem.currentStyle[property]);
                }
                else {
                    resolve(elem.style[property] || '');
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    /**
     * Animate element property changes
     * @param {Element} elem - the DOM element
     * @param {object} properties - CSS properties to animate
     * @param {number} duration - animation duration in milliseconds
     * @param {string} easing - easing function (default: 'ease')
     * @return {Promise} resolves when animation completes
     */
    Event.prototype.animate = function (elem, properties, duration = 300, easing = 'ease') {
        return new Promise((resolve, reject) => {
            try {
                if (!elem) {
                    reject(new Error('Element is required'));
                    return;
                }

                // Check for CSS Transitions support
                const supportsTransitions = 'transition' in elem.style ||
                    'webkitTransition' in elem.style ||
                    'mozTransition' in elem.style ||
                    'oTransition' in elem.style;

                if (supportsTransitions) {
                    // Set up transition
                    const transitionProperty = Object.keys(properties).join(', ');
                    elem.style.transition = `${transitionProperty} ${duration}ms ${easing}`;

                    // Apply properties
                    Object.keys(properties).forEach(prop => {
                        elem.style[prop] = properties[prop];
                    });

                    // Wait for transition to complete
                    const cleanup = () => {
                        elem.style.transition = '';
                        elem.removeEventListener('transitionend', onTransitionEnd);
                        elem.removeEventListener('transitioncancel', onTransitionCancel);
                    };

                    const onTransitionEnd = () => {
                        cleanup();
                        resolve(elem);
                    };

                    const onTransitionCancel = () => {
                        cleanup();
                        reject(new Error('Animation was cancelled'));
                    };

                    elem.addEventListener('transitionend', onTransitionEnd, { once: true });
                    elem.addEventListener('transitioncancel', onTransitionCancel, { once: true });

                    // Fallback timeout
                    setTimeout(() => {
                        cleanup();
                        resolve(elem);
                    }, duration + 50);

                } else {
                    // Fallback for browsers without transition support
                    Object.keys(properties).forEach(prop => {
                        elem.style[prop] = properties[prop];
                    });

                    setTimeout(() => resolve(elem), duration);
                }

            } catch (error) {
                reject(error);
            }
        });
    };

    /**
     * Remove all event listeners from an element
     * @param {Element} elem - the DOM element
     * @return {Promise<boolean>} resolves when all listeners are removed
     */
    Event.prototype.removeAll = function (elem) {
        return new Promise((resolve) => {
            try {
                if (this._observers.has(elem)) {
                    const elemObservers = this._observers.get(elem);
                    const removePromises = [];

                    elemObservers.forEach((observer) => {
                        removePromises.push(
                            this.remove(elem, observer.eventName, observer.handler)
                        );
                    });

                    Promise.all(removePromises)
                        .then(() => resolve(true))
                        .catch(() => resolve(false));
                } else {
                    resolve(true);
                }
            } catch (error) {
                resolve(false);
            }
        });
    };

    Event.on = (elem, event, handler, options) => Event.add(elem, event, handler, options);
    Event.off = (elem, event, handler) => Event.remove(elem, event, handler);
    Event.once = (elem, event, handler) => Event.once(elem, event, handler);
    Event.fire = (elem, event, detail) => Event.fire(elem, event, detail);
    Event.waitFor = (elem, event, timeout) => Event.waitFor(elem, event, timeout);
    Event.animate = (elem, props, duration, easing) => Event.animate(elem, props, duration, easing);

    return Event;

})();

const FEAR = (($) => {

    // Make sure we have jQuery
    if (typeof $ === 'undefined' || $ === null) {
        throw new Error('FEAR GUI requires jQuery library.');
    }

    // GUI Constructor
    function GUI() {
        // Default configuration
        this.config = {
            logLevel: 0,
            name: 'FEAR_GUI',
            mode: 'single',
            version: '1.0.1',
            jquery: true,
            animations: false
        };

        // Private objects & arrays for tracking
        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};
        this._running = {};
        this._imports = [];

        // Add broker and router to core object
        this._broker = new Broker(this);
        this._event = new Event();


        // Public access to classes
        this.Broker = Broker;
        this.Event = new Event();
          this.Event.on = (elem, event, handler, options) => this.Event.add(elem, event, handler, options);
        this.Event.off = (elem, event, handler) => this.Event.remove(elem, event, handler);
        // Dynamic async module loading
        this.attach = async (imports) => {
            console.log('Dynamic async module loading.');
            console.log('Imports:', imports);
        };

        // Configuration method
        this.configure = (options) => {
            if (options && Utils.isObj(options)) {
                // Set custom config options
                this.config = Utils.merge(this.config, options);

                // Set logging verbosity
                this.debug.level = this.config.logLevel || 0;
            }
        };

        this.debug.warn('GUI = ', this);
        return this;
    }

    // console log wrapper
    GUI.prototype.debug = {
        level: 0,
        history: [],
        timeout: 5000,

        /**
         * Adds a warning message to the console.
         * @param {String} out the message
         */
        warn(out) {
            if (this.level < 2) {
                const args = ['WARN:', ...arguments];

                if (typeof window !== 'undefined' && window.console?.warn) {
                    this._logger("warn", args);
                } else if (window.console?.log) {
                    this._logger("log", args);
                } else if (window.opera?.postError) {
                    window.opera.postError(`WARNING: ${out}`);
                }
            }
        },

        /**
         * Adds a message to the console.
         * @param {String} out the message
         */
        log(out) {
            if (this.level < 1) {
                if (window.console?.log) {
                    const args = ['Debug:', ...arguments];
                    this._logger("log", args);
                } else if (window.opera?.postError) {
                    window.opera.postError(`DEBUG: ${out}`);
                }
            }
        },

        _logger(type, arr) {
            this.history.push({ type, args: arr });

            if (console[type]?.apply) {
                console[type].apply(console, arr);
            } else {
                console[type](arr);
            }
        },

        _stackTrace() {
            this.log(this.history);
        }
    };

    /* Public Methods */
    /******************/

    /** 
     * Create new GUI module 
     *
     * @param id {string} - module identifier
     * @param creator {function}  logic to execute inside module namespace
     * @param options {object} - optional object of extra parameters that will be passed to load() 
     * @return this {object}
    **/
    GUI.prototype.create = function(id, creator, options = {}) {
        // Validate input parameters
        const error = Utils.isType("string", id, "module ID") ||
            Utils.isType("function", creator, "creator") ||
            Utils.isType("object", options, "option parameter");

        if (error) {
            this.debug.warn(`could not register module '${id}': ${error}`);
            return this;
        }

        // Check if module is already registered
        if (this._modules[id]) {
            this.debug.log(`module ${id} was already registered`);
            return this;
        }

        // Register the module
        this._modules[id] = {
            id,
            creator,
            options
        };

        return this;
    };

    /** 
     * Starts module with new sandbox instance 
     *
     * @param moduleId {string} - module name or identifier
     * @param opt {object} - optional options object
     * @return Promise - resolves when module is started
    **/
    GUI.prototype.start = function(moduleId, opt = {}) {
        // Handle different parameter combinations
        if (arguments.length === 0) {
            return this._startAll();
        }

        if (moduleId instanceof Array) {
            return this._startAll(moduleId);
        }

        if (typeof moduleId === "function") {
            return this._startAll();
        }

        const id = opt.instanceId || moduleId;

        // Validate parameters
        const error = Utils.isType("string", moduleId, "module ID") ||
            Utils.isType("object", opt, "second parameter") ||
            (!this._modules[moduleId] ? "module doesn't exist" : undefined);

        if (error) {
            return Promise.reject(new Error(error));
        }

        if (this._running[id] === true) {
            return Promise.reject(new Error("module was already started"));
        }

        // Boot and create instance
        return this.boot()
            .then(() => this._createInstance(moduleId, opt))
            .then(({ instance, options }) => {
                // Check if load method expects a callback or returns a promise
                if (instance.load && typeof instance.load === 'function') {
                    const loadResult = instance.load(options);
                    
                    // If load returns a promise, use it
                    if (loadResult && typeof loadResult.then === 'function') {
                        return loadResult.then(() => {
                            this._running[id] = true;
                        });
                    } else {
                        // Synchronous load
                        this._running[id] = true;
                        return Promise.resolve();
                    }
                } else {
                    this._running[id] = true;
                    return Promise.resolve();
                }
            })
            .catch(err => {
                this.debug.warn(err);
                throw new Error("could not start module: " + err.message);
            });
    };

    /** 
     * Loads plugin to Sandbox or Core classes 
     *
     * @param plugin {function} - method with plugin logic 
     * @param opt {object} - optional options object to be accessed in plugin 
     * @return this {object}
    **/
    GUI.prototype.use = function(plugin, opt) {
        if (Utils.isArr(plugin)) {
            // Handle array of plugins
            plugin.forEach(p => {
                if (typeof p === "function") {
                    this.use(p);
                } else if (typeof p === "object") {
                    this.use(p.plugin, p.options);
                }
            });
        } else {
            // Must be a function
            if (!Utils.isFunc(plugin)) {
                return this;
            }

            // Add to _plugins array
            this._plugins.push({
                creator: plugin,
                options: opt
            });
        }

        return this;
    };

    /** 
     * Stops all running instances 
     *
     * @param id {string} - module identifier 
     * @return Promise - resolves when module is stopped
    **/
    GUI.prototype.stop = function (id) {
        if (arguments.length === 0 || typeof id === "function") {
            const moduleIds = Object.keys(this._instances);
            return this._run.all(moduleIds.map(moduleId => () => this.stop(moduleId)));
        }

        const instance = this._instances[id];
        
        if (!instance) {
            return Promise.resolve();
        }

        // remove instance from instances cache
        delete this._instances[id];

        // disable any events registered by module
        this._broker.off(instance);

        // run unload method in stopped modules
        return this._runSandboxPlugins('unload', this._sandboxes[id])
            .then(() => {
                if (instance.unload && typeof instance.unload === 'function') {
                    const unloadResult = instance.unload();
                    
                    // If unload returns a promise, use it
                    if (unloadResult && typeof unloadResult.then === 'function') {
                        return unloadResult;
                    }
                }
                return Promise.resolve();
            })
            .then(() => {
                delete this._running[id];
            });
    };

    /** 
     * Register jQuery plugins to $ nameSpace 
     *
     * @param plugin {object} - plugin object with all logic 
     * @param module {string} - identifier for jQuery plugin 
     * @return {function} - initialized jQuery plugin 
    **/
    GUI.prototype.plugin = function(plugin, module) {
        if (plugin.fn && Utils.isFunc(plugin.fn)) {
            $.fn[module.toLowerCase()] = function (options) {
                return new plugin.fn(this, options);
            };
        } else {
            this.debug.log('Error :: Missing ' + plugin + ' fn() method.');
        }
    };

    /** 
     * Load single or all available core plugins 
     *
     * @return Promise - resolves when plugins are loaded
    **/
    GUI.prototype.boot = function() {
        const core = this;

        const tasks = this._plugins
            .filter(plugin => plugin.booted !== true)
            .map(plugin => () => {
                return new Promise((resolve, reject) => {
                    try {
                        // Check if creator expects a callback (3 parameters: core, options, next)
                        if (Utils.hasArgs(plugin.creator, 3)) {
                            plugin.creator(core, plugin.options, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    plugin.booted = true;
                                    resolve();
                                }
                            });
                        } else {
                            plugin.plugin = plugin.creator(core, plugin.options);
                            plugin.booted = true;
                            resolve();
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            });

        return this._run.series(tasks);
    };

    /* Private Methods */
    /*******************/
    /* Run methods for async loading of modules and plugins */
    GUI.prototype._run = {
        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return Promise
        **/
        all: (args = []) => {
            const tasks = args.map(a => () => Promise.resolve(a));
            return this.parallel(tasks);
        },

        /**
        * Run asynchronous tasks in parallel 
        *
        * @param tasks {array} - array of functions that return promises
        * @return Promise
        **/
        parallel: (tasks = []) => {
            if (tasks.length === 0) {
                return Promise.resolve([]);
            }

            const promises = tasks.map((task, index) => {
                try {
                    const result = task();
                    // Ensure it's a promise
                    return Promise.resolve(result).catch(err => ({ error: err, index }));
                } catch (err) {
                    return Promise.resolve({ error: err, index });
                }
            });

            return Promise.all(promises)
                .then(results => {
                    const errors = [];
                    const validResults = [];
                    
                    results.forEach((result, index) => {
                        if (result && result.error) {
                            errors[index] = result.error;
                        } else {
                            validResults[index] = result;
                        }
                    });

                    if (errors.some(err => err !== undefined)) {
                        const error = new Error('Some tasks failed');
                        error.errors = errors;
                        error.results = validResults;
                        throw error;
                    }

                    return validResults;
                });
        },

        /**
        * Run asynchronous tasks one after another 
        *
        * @param tasks {array} - array of functions that return promises
        * @return Promise
        **/
        series: (tasks = []) => {
            if (tasks.length === 0) {
                return Promise.resolve([]);
            }

            return tasks.reduce((promise, task, index) => {
                return promise.then(results => {
                    try {
                        const result = task();
                        return Promise.resolve(result)
                            .then(taskResult => [...results, taskResult])
                            .catch(err => {
                                const error = new Error(`Task ${index} failed`);
                                error.originalError = err;
                                error.taskIndex = index;
                                throw error;
                            });
                    } catch (err) {
                        const error = new Error(`Task ${index} failed`);
                        error.originalError = err;
                        error.taskIndex = index;
                        throw error;
                    }
                });
            }, Promise.resolve([]));
        },

        /**
        * Run first task that succeeds
        *
        * @param tasks {array} - array of functions that return promises
        * @return Promise
        **/
        first: (tasks = []) => {
            if (tasks.length === 0) {
                return Promise.reject(new Error('No tasks provided'));
            }

            return tasks.reduce((promise, task, index) => {
                return promise.catch(() => {
                    try {
                        return Promise.resolve(task());
                    } catch (err) {
                        if (index === tasks.length - 1) {
                            throw err;
                        }
                        return Promise.reject(err);
                    }
                });
            }, Promise.reject());
        },

        /**
        * Run asynchronous tasks one after another
        * and pass the result to the next task
        *
        * @param tasks {array} - array of functions that accept previous result and return promises
        * @return Promise
        **/
        waterfall: (tasks = []) => {
            if (tasks.length === 0) {
                return Promise.resolve();
            }

            return tasks.reduce((promise, task) => {
                return promise.then(result => {
                    try {
                        return Promise.resolve(task(result));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                });
            }, Promise.resolve());
        }
    };

    /** 
      * Called when starting all modules
      *
      * @param mods {array} - array of module IDs to start 
      * @return Promise
    **/
    GUI.prototype._startAll = function(mods) {
        // start all stored modules
        if (!mods || mods === null) {
            mods = Object.keys(this._modules);
        }

        const startTasks = mods.map(moduleId => () => 
            this.start(moduleId, this._modules[moduleId].options)
                .catch(err => {
                    // Store error with module ID for reporting
                    const moduleError = new Error(`Failed to start module '${moduleId}': ${err.message}`);
                    moduleError.moduleId = moduleId;
                    moduleError.originalError = err;
                    throw moduleError;
                })
        );

        return this._run.parallel(startTasks)
            .catch(error => {
                if (error.errors) {
                    const moduleErrors = {};
                    const failedModules = [];
                    
                    error.errors.forEach((err, index) => {
                        if (err) {
                            const moduleId = mods[index];
                            moduleErrors[moduleId] = err;
                            failedModules.push(`'${moduleId}'`);
                        }
                    });

                    const aggregatedError = new Error(`errors occurred in the following modules: ${failedModules.join(', ')}`);
                    aggregatedError.moduleErrors = moduleErrors;
                    throw aggregatedError;
                }
                throw error;
            });
    };

    /** 
      * Create new sandbox instance and attach to module 
      *
      * @param moduleId {string} - the module to create sandbox instance for 
      * @param o {object} - options object 
      * @return Promise - resolves with {instance, options}
    **/
    GUI.prototype._createInstance = function(moduleId, o) {
        const { options: opt } = o;
        const id = o.instanceId || moduleId;
        const module = this._modules[moduleId];

        // Return existing instance if it exists
        if (this._instances[id]) {
            return Promise.resolve({ instance: this._instances[id], options: opt });
        }

        // Merge options with module defaults (module options have lower priority)
        const iOpts = {
            ...module.options,
            ...opt
        };

        // Create new API Sandbox
        const sb = SandBox().create(this, id, iOpts, moduleId);

        // Add config object if available
        if (this.config) {
            sb.config = this.config;
        }

        // Run sandboxed instance load method
        return this._runSandboxPlugins('load', sb)
            .then(() => {
                const instance = new module.creator(sb);

                // Check if module has required methods
                if (typeof instance.load !== "function") {
                    // Check if it's a jQuery plugin
                    if (instance.fn && typeof instance.fn === 'function') {
                        this.plugin(instance, id);
                        return { instance, options: iOpts };
                    }
                    throw new Error("module has no 'load' or 'fn' method");
                }

                // Store instance and sandbox
                this._instances[id] = instance;
                this._sandboxes[id] = sb;

                return { instance, options: iOpts };
            });
    };

    /** 
      * Sets up needed tasks for module initializations 
      *
      * @param ev {string} - check module for load / unload methods 
      * @param sb {object} - the sandbox instance 
      * @return Promise
    **/
    GUI.prototype._runSandboxPlugins = function(ev, sb) {
        // Filter plugins that have the specified event handler
        const tasks = this._plugins
            .filter(plugin => typeof plugin.plugin?.[ev] === "function")
            .map(plugin => () => {
                const eventHandler = plugin.plugin[ev];
                
                return new Promise((resolve, reject) => {
                    try {
                        // Check if the handler expects a callback (3 parameters: sb, options, next)
                        if (Utils.hasArgs(eventHandler, 3)) {
                            eventHandler(sb, plugin.options, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            // Handler doesn't use callback, call it synchronously
                            const result = eventHandler(sb, plugin.options);
                            
                            // If handler returns a promise, use it
                            if (result && typeof result.then === 'function') {
                                result.then(resolve, reject);
                            } else {
                                resolve();
                            }
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            });

        return this._run.series(tasks);
    };

    return GUI;

})(jQuery);

GUI = FEAR;

window.FEAR = FEAR;
window.Broker = Broker;
window.Utils = Utils;
window.SandBox = SandBox;

(function($) {
  
  var $GUI = new FEAR();

  // Main FEAR function
  $.FEAR = function() {
    var argc = Array.prototype.slice.call(arguments);
    var options = argc[0] || null;
    
    if (options && options !== null) {
      if (Utils.isArr(options)) {
        $GUI.attach(options);
      } else if (Utils.isObj(options)) {
        $GUI.configure(options);
      }
    }
    
    return $GUI;
  };

  // jQuery plugin method
  $.fn.FEAR = function(options) {
    return this.each(function() {
      $(this);
      
      if (!$.data(this, 'fear')) {
        $.data(this, 'fear', new $.FEAR().create(this, options));
      } else {
        return new $.FEAR().create(this, options);
      }
    });
  };

})(
  // Dependency injection - works with different module systems
  typeof jQuery !== 'undefined' ? jQuery : 
  typeof $ !== 'undefined' ? $ : 
  (function() { throw new Error('jQuery is required'); })(),
);
