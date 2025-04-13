
const cache = (options = {}) => {
  
  const type = options.storage
  const { ttl, key, store, cmd, callback  } = options;
  
  this.data = {};

  return {
    [type] : {
      set: ( key, state ) => {
        window[Storage[type]].setItem(key, JSON.stringify(state))
      },
      get: (key) => {
        const result = window[Storage[type]].getItem(key);
        return JSON.parse(result);
      },
      remove: (key) => {
        window[Storage[type]].removeItem(key);
      ,
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
