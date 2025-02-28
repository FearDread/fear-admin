
const storage = {};
const options = {};

export default cache = {
      setCache: (entity, data) => {
        if (this.storage.cache[entity] === undefined) {
          this.storage.cache[entity] = data;
        }
        console.log("Cached obj :: ", this.storage);
        return true;
      },
    
      checkCache: (entity) => {
        return (this.storage.cache[entity]) ? true : false;
      },
    
      getCache: (entity) => {
        return (this.storage.cache[entity]) ? this.storage.cache[entity] : null;
      },
}