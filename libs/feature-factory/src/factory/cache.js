/**
 * Storage types supported by the CacheFactory
 */
const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
};

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  type: 'session',
  prefix: '',
  enableLogging: false,
  fallbackToMemory: true,
  maxRetries: 3,
};

/**
 * In-memory fallback storage for when browser storage is unavailable
 */
class MemoryStorage {
  constructor() {
    this.data = new Map();
  }

  setItem(key, value) {
    this.data.set(key, value);
  }

  getItem(key) {
    return this.data.get(key) || null;
  }

  removeItem(key) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  get length() {
    return this.data.size;
  }

  key(index) {
    const keys = Array.from(this.data.keys());
    return keys[index] || null;
  }

  keys() {
    return Array.from(this.data.keys());
  }
}

/**
 * Validates storage availability and functionality
 * @param {Storage} storage - The storage object to test
 * @returns {boolean} Whether storage is available and functional
 */
const isStorageAvailable = (storage) => {
  if (!storage) return false;

  try {
    const testKey = '__cache_factory_test__';
    const testValue = 'test';
    
    storage.setItem(testKey, testValue);
    const retrieved = storage.getItem(testKey);
    storage.removeItem(testKey);
    
    return retrieved === testValue;
  } catch (error) {
    return false;
  }
};

/**
 * Safely serializes data to JSON string
 * @param {any} value - Value to serialize
 * @returns {string|null} Serialized value or null if serialization fails
 */
const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('CacheFactory: Failed to serialize value', error);
    return null;
  }
};

/**
 * Safely parses JSON string
 * @param {string} value - JSON string to parse
 * @returns {any|null} Parsed value or null if parsing fails
 */
const safeParse = (value) => {
  if (value === null || value === undefined) return null;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    // Return the original value if it's not valid JSON
    return value;
  }
};

/**
 * Retries an operation with exponential backoff
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {any} Operation result
 */
const retryOperation = (operation, maxRetries) => {
  let attempts = 0;
  
  while (attempts <= maxRetries) {
    try {
      return operation();
    } catch (error) {
      if (attempts === maxRetries) {
        throw error;
      }
      attempts++;
      // Simple synchronous delay simulation (not recommended for production)
      // In a real scenario, you might want to remove retries for sync operations
      // or handle them differently
    }
  }
};

/**
 * Creates a cache instance with the specified configuration
 * @param {Object} options - Configuration options
 * @param {string} options.type - Storage type ('local' or 'session')
 * @param {string} options.prefix - Key prefix for namespacing
 * @param {boolean} options.enableLogging - Enable debug logging
 * @param {boolean} options.fallbackToMemory - Use memory storage as fallback
 * @param {number} options.maxRetries - Maximum retry attempts for operations
 * @returns {Object} Cache instance with storage methods
 */
export const CacheFactory = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const storageType = config.type === 'local' ? STORAGE_TYPES.LOCAL : STORAGE_TYPES.SESSION;
  
  let storage = null;
  let usingMemoryFallback = false;

  // Initialize storage
  const initializeStorage = () => {
    if (typeof window === 'undefined') {
      // Server-side rendering or Node.js environment
      if (config.fallbackToMemory) {
        storage = new MemoryStorage();
        usingMemoryFallback = true;
        if (config.enableLogging) {
          console.warn('CacheFactory: Browser storage unavailable, using memory fallback');
        }
      }
      return;
    }

    const browserStorage = window[storageType];
    
    if (isStorageAvailable(browserStorage)) {
      storage = browserStorage;
    } else if (config.fallbackToMemory) {
      storage = new MemoryStorage();
      usingMemoryFallback = true;
      if (config.enableLogging) {
        console.warn(`CacheFactory: ${storageType} unavailable, using memory fallback`);
      }
    }
  };

  initializeStorage();

  /**
   * Generates a prefixed key
   * @param {string} key - Original key
   * @returns {string} Prefixed key
   */
  const getPrefixedKey = (key) => {
    return config.prefix ? `${config.prefix}${key}` : key;
  };

  /**
   * Removes prefix from key
   * @param {string} prefixedKey - Prefixed key
   * @returns {string} Original key
   */
  const removePrefixFromKey = (prefixedKey) => {
    if (!config.prefix) return prefixedKey;
    return prefixedKey.startsWith(config.prefix) 
      ? prefixedKey.slice(config.prefix.length) 
      : prefixedKey;
  };

  /**
   * Logs debug information if logging is enabled
   * @param {string} operation - Operation name
   * @param {string} key - Storage key
   * @param {any} data - Additional data to log
   */
  const log = (operation, key, data = null) => {
    if (config.enableLogging) {
      console.debug(`CacheFactory[${storageType}]: ${operation}`, { key, data, usingMemoryFallback });
    }
  };

  return {
    /**
     * Checks if storage is available
     * @returns {boolean} Storage availability status
     */
    isAvailable() {
      return storage !== null;
    },

    /**
     * Checks if using memory fallback
     * @returns {boolean} Whether using memory storage
     */
    isUsingMemoryFallback() {
      return usingMemoryFallback;
    },

    /**
     * Gets storage type being used
     * @returns {string} Storage type name
     */
    getStorageType() {
      return usingMemoryFallback ? 'memory' : storageType;
    },

    /**
     * Sets an item in storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
      if (!storage) {
        console.error('CacheFactory: Storage not available');
        return false;
      }

      if (!key || typeof key !== 'string') {
        throw new Error('CacheFactory: Invalid key provided');
      }

      const prefixedKey = getPrefixedKey(key);
      const serializedValue = safeStringify(value);

      if (serializedValue === null) {
        return false;
      }

      try {
        retryOperation(() => {
          storage.setItem(prefixedKey, serializedValue);
        }, config.maxRetries);
        
        log('SET', key, value);
        return true;
      } catch (error) {
        console.error(`CacheFactory: Error setting item ${key}:`, error);
        return false;
      }
    },

    /**
     * Gets an item from storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Retrieved value or default
     */
    get(key, defaultValue = null) {
      if (!storage) {
        console.warn('CacheFactory: Storage not available');
        return defaultValue;
      }

      if (!key || typeof key !== 'string' || key === 'undefined') {
        console.warn('CacheFactory: Invalid key provided for get operation');
        return defaultValue;
      }

      const prefixedKey = getPrefixedKey(key);

      try {
        const data = retryOperation(() => {
          return storage.getItem(prefixedKey);
        }, config.maxRetries);

        if (data === null || data === 'undefined') {
          log('GET_MISS', key);
          return defaultValue;
        }

        const parsedData = safeParse(data);
        log('GET_HIT', key, parsedData);
        return parsedData;
      } catch (error) {
        console.error(`CacheFactory: Error getting item ${key}:`, error);
        return defaultValue;
      }
    },

    /**
     * Removes an item from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
      if (!storage) {
        console.error('CacheFactory: Storage not available');
        return false;
      }

      if (!key || typeof key !== 'string') {
        console.warn('CacheFactory: Invalid key provided for remove operation');
        return false;
      }

      const prefixedKey = getPrefixedKey(key);

      try {
        retryOperation(() => {
          storage.removeItem(prefixedKey);
        }, config.maxRetries);
        
        log('REMOVE', key);
        return true;
      } catch (error) {
        console.error(`CacheFactory: Error removing item ${key}:`, error);
        return false;
      }
    },

    /**
     * Clears all items from storage (respects prefix)
     * @returns {boolean} Success status
     */
    clear() {
      if (!storage) {
        console.error('CacheFactory: Storage not available');
        return false;
      }

      try {
        if (config.prefix) {
          // Clear only prefixed items
          const keys = this.keys();
          keys.forEach(key => this.remove(key));
        } else {
          retryOperation(() => {
            storage.clear();
          }, config.maxRetries);
        }
        
        log('CLEAR');
        return true;
      } catch (error) {
        console.error('CacheFactory: Error clearing storage:', error);
        return false;
      }
    },

    /**
     * Gets all keys from storage (without prefix)
     * @returns {string[]} Array of keys
     */
    keys() {
      if (!storage) {
        console.warn('CacheFactory: Storage not available');
        return [];
      }

      try {
        let keys = [];

        if (usingMemoryFallback) {
          keys = storage.keys();
        } else {
          keys = Object.keys(storage);
        }

        // Filter by prefix and remove prefix from keys
        const filteredKeys = config.prefix
          ? keys.filter(key => key.startsWith(config.prefix))
              .map(key => removePrefixFromKey(key))
          : keys;

        log('KEYS', null, filteredKeys);
        return filteredKeys;
      } catch (error) {
        console.error('CacheFactory: Error getting keys:', error);
        return [];
      }
    },

    /**
     * Checks if a key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} Whether key exists
     */
    has(key) {
      if (!storage || !key || typeof key !== 'string') {
        return false;
      }

      const prefixedKey = getPrefixedKey(key);

      try {
        const exists = retryOperation(() => {
          return storage.getItem(prefixedKey) !== null;
        }, config.maxRetries);
        
        log('HAS', key, exists);
        return exists;
      } catch (error) {
        console.error(`CacheFactory: Error checking if key ${key} exists:`, error);
        return false;
      }
    },

    /**
     * Gets storage usage information
     * @returns {Object} Storage usage stats
     */
    getStats() {
      const keys = this.keys();
      
      return {
        keyCount: keys.length,
        storageType: this.getStorageType(),
        usingMemoryFallback: usingMemoryFallback,
        prefix: config.prefix || 'none',
        keys: keys,
      };
    },

    /**
     * Bulk operations
     */
    bulk: {
      /**
       * Sets multiple items at once
       * @param {Object} items - Key-value pairs to set
       * @returns {Object} Results of each operation
       */
      set: (items) => {
        const results = {};
        
        Object.entries(items).forEach(([key, value]) => {
          results[key] = this.set(key, value);
        });
        
        return results;
      },

      /**
       * Gets multiple items at once
       * @param {string[]} keys - Keys to retrieve
       * @returns {Object} Retrieved key-value pairs
       */
      get: (keys) => {
        const results = {};
        
        keys.forEach(key => {
          results[key] = this.get(key);
        });
        
        return results;
      },

      /**
       * Removes multiple items at once
       * @param {string[]} keys - Keys to remove
       * @returns {Object} Results of each operation
       */
      remove: (keys) => {
        const results = {};
        
        keys.forEach(key => {
          results[key] = this.remove(key);
        });
        
        return results;
      },
    },
  };
};

// Pre-configured instances for convenience
CacheFactory.local = CacheFactory({ type: 'local' });
CacheFactory.session = CacheFactory({ type: 'session' });
exports.Cache = CacheFactory({type: 'local'});
// Memory-only instance for testing or server-side use
CacheFactory.memory = CacheFactory({ 
  type: 'session', 
  fallbackToMemory: true 
});

export default CacheFactory;