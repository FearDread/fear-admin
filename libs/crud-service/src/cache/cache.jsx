

// cache
const cache = (options = {}) => {
  var engine = options.type == 'local' ? 'localStorage' : 'sessionStorage';
 
  return {
    check: () => {
      if (!window[engine]) {
        return false;
      }
      return true;
    },
    set: (key, value) => {
      if (!key) throw Error('Error:> Invalid key');

      try {
        window[engine].setItem(key, JSON.stringify(value));

      } catch (error) {
        console.error(`Error setting item ${key}:`, error);
        return false;
      }
      return true;
    },
    get: (key) => {
      try {
        const data = window[engine].getItem(key);
        return data ? JSON.parse(data) : null;

      } catch (error) {
        console.error(`Error getting item ${key}:`, error);
        return null;
      }
    },
    remove: function (key) {
      window[engine].removeItem(key);
    },
    clear: () => {
      window[engine].clear();
    },
    keys: () => {
      return Object.keys(window[engine]);
    },
    has: (key) => {
      return window[engine].getItem(key) !== null;
    },
    _extend: () => {
      const destination = typeof arguments[0] === 'object' ? arguments[0] : {};

      for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] && typeof arguments[i] === 'object') {
          for (var property in arguments[i])
            destination[property] = arguments[i][property];
        }
      }

      return destination;
    }
  };
}

cache.local = new cache({type: 'local'})
cache.session = new cache({type: 'session'})

export default cache;
