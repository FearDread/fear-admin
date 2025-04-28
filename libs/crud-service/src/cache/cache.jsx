
const cache = (options = {}) => {
  
  const type = options.type
  const { ttl, key, store, cmd, callback  } = options;
  
  if ( !window[Storage[type]] ) {
    throw new Error("No storage found for type : " + type);
  }

  return {
    [type] : {
      set: ( key, state ) => {
        window[Storage[type]].setItem(key, JSON.stringify(state))
      },
      has: (key) => {
        if ( window[Storage[type]].getItem(key) ) {
          return true;
        }
        return false;
      },
      get: (key) => {
        const result = window[Storage[type]].getItem(key);
        return JSON.parse(result);
      },
      remove: (key) => {
        window[Storage[type]].removeItem(key);
      },
      getAll: () => {
        return window[Storage[type]];
      },
      clear: () => {
        window[Storage[type]].clear();
      },
    }
  }
}

export default cache;
