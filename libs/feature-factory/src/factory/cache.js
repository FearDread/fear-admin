

// cache
export const CacheFactory = (options = {}) => {
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
        if (key !== "undefined") {
          const data = window[engine].getItem(key);
          return data != 'undefined' ? JSON.parse(data) : null;
        }


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
  };
}

CacheFactory.local = CacheFactory({ type: 'local' });
CacheFactory.session = CacheFactory({ type: 'session' });

export default CacheFactory;
