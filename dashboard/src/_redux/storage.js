export const storage = {
  set: (key, state) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  },
  get: (key) => {
    const result = window.localStorage.getItem(JSON.stringify(key));
    return JSON.parse(result);
  },
  remove: (key) => {
    window.localStorage.removeItem(key);
  },
  getAll: () => {
    return window.localStorage;
  },
  clear: () => {
    window.localStorage.clear();
  },
  session: {
    set: (key, state) => {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    },
    get: (key) => {
      const result = window.sessionStorage.getItem(key);
      return JSON.parse(result);
    },
    remove: (key) => {
      window.sessionStorage.removeItem(key);
    },
    getAll: () => {
      return window.sessionStorage;
    },
    clear: () => {
      window.sessionStorage.clear();
    },
  }
};

export default storage;
