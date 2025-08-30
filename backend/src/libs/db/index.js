const mongoose = require("mongoose");

/**
 * MongoDB connection utility module
 * Provides connection management and ObjectId utilities
 */
class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.currentDbName = null;
    
    // Setup connection event listeners
    this._setupEventListeners();
  }

  /**
   * Setup mongoose connection event listeners
   * @private
   */
  _setupEventListeners() {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      console.log(`✅ MongoDB connected successfully to: ${this.currentDbName}`);
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      console.log(`🔌 MongoDB disconnected from: ${this.currentDbName || 'database'}`);
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      console.log(`🔄 MongoDB reconnected to: ${this.currentDbName}`);
    });

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      await this.close();
      process.exit(0);
    });
  }

  /**
   * Connect to MongoDB database
   * @param {Object} env - Environment configuration object
   * @param {string} env.DB_LINK - MongoDB connection string
   * @param {string} env.DB_NAME - Database name
   * @param {Function} [callback] - Optional callback function
   * @param {Object} [options] - Additional mongoose connection options
   * @returns {Promise<void>}
   */
  async connect(env, callback = null, options = {}) {
    try {
      // Validate required environment variables
      if (!env.DB_LINK) {
        throw new Error('DB_LINK is required in environment configuration');
      }
      if (!env.DB_NAME) {
        throw new Error('DB_NAME is required in environment configuration');
      }

      // Check if already connected to the same database
      if (this.isConnected && this.currentDbName === env.DB_NAME) {
        console.log(`📋 Already connected to MongoDB: ${env.DB_NAME}`);
        if (callback) callback();
        return;
      }

      // Close existing connection if connected to different database
      if (this.isConnected && this.currentDbName !== env.DB_NAME) {
        await this.close();
      }

      // Set mongoose configuration
      mongoose.set("strictQuery", false);
      
      // Default connection options
      const defaultOptions = {
        dbName: env.DB_NAME,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        ...options
      };

      this.currentDbName = env.DB_NAME;

      // Connect to MongoDB
      await mongoose.connect(env.DB_LINK, defaultOptions);
      
      // Execute callback if provided
      if (callback) callback();
      
    } catch (error) {
      this.isConnected = false;
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   * @param {Function} [callback] - Optional callback function
   * @returns {Promise<void>}
   */
  async close(callback = null) {
    try {
      if (!this.isConnected) {
        console.log('📋 MongoDB is not connected');
        if (callback) callback();
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      
      if (callback) callback();
      
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {Object} Connection status information
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      dbName: this.currentDbName,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    };
  }

  /**
   * Wait for database connection to be ready
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForConnection(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error(`Connection timeout after ${timeout}ms`));
      }, timeout);

      mongoose.connection.once('connected', () => {
        clearTimeout(timeoutId);
        resolve();
      });

      mongoose.connection.once('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

/**
 * ObjectId utility functions
 */
const ObjectIdUtils = {
  /**
   * Create new ObjectId from string or return existing ObjectId
   * @param {string|mongoose.Types.ObjectId} id - ID to wrap
   * @returns {mongoose.Types.ObjectId} ObjectId instance
   */
  wrapId(id) {
    if (!id) {
      throw new Error('ID parameter is required');
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    
    throw new Error(`Invalid ObjectId format: ${id}`);
  },

  /**
   * Validate if string is a valid ObjectId
   * @param {string} id - ID to validate
   * @param {boolean} [throwError=true] - Whether to throw error on invalid ID
   * @returns {boolean} True if valid ObjectId
   */
  validate(id, throwError = true) {
    if (!id) {
      if (throwError) {
        throw new Error('ID parameter is required');
      }
      return false;
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);
    
    if (!isValid && throwError) {
      throw new Error(`Invalid ObjectId format: ${id}`);
    }
    
    return isValid;
  },

  /**
   * Generate new ObjectId
   * @returns {mongoose.Types.ObjectId} New ObjectId
   */
  generate() {
    return new mongoose.Types.ObjectId();
  },

  /**
   * Convert ObjectId to string
   * @param {mongoose.Types.ObjectId} objectId - ObjectId to convert
   * @returns {string} String representation of ObjectId
   */
  toString(objectId) {
    if (!objectId) {
      throw new Error('ObjectId parameter is required');
    }
    return objectId.toString();
  },

  /**
   * Check if two ObjectIds are equal
   * @param {string|mongoose.Types.ObjectId} id1 - First ID
   * @param {string|mongoose.Types.ObjectId} id2 - Second ID
   * @returns {boolean} True if IDs are equal
   */
  areEqual(id1, id2) {
    if (!id1 || !id2) return false;
    
    try {
      const objId1 = this.wrapId(id1);
      const objId2 = this.wrapId(id2);
      return objId1.equals(objId2);
    } catch (error) {
      return false;
    }
  }
};

/**
 * Legacy compatibility functions (backwards compatibility)
 */
const legacyAPI = {
  /**
   * Legacy run function for backwards compatibility
   * @deprecated Use dbManager.connect() instead
   */
  async run(env, callback) {
    console.warn('⚠️  Warning: run() is deprecated. Use connect() instead.');
    return await dbManager.connect(env, callback);
  },

  /**
   * Legacy close function for backwards compatibility
   * @deprecated Use dbManager.close() instead
   */
  async close(callback) {
    console.warn('⚠️  Warning: close() is deprecated. Use disconnect() instead.');
    return await dbManager.disconnect(callback);
  },

  /**
   * Legacy store function (placeholder)
   * @deprecated This function was not implemented in original code
   */
  store() {
    console.warn('⚠️  Warning: store() function is not implemented');
    return null;
  },

  /**
   * Legacy wrapId function for backwards compatibility
   * @deprecated Use ObjectIdUtils.wrapId() instead
   */
  wrapId(id) {
    console.warn('⚠️  Warning: wrapId() is deprecated. Use ObjectIdUtils.wrapId() instead.');
    return ObjectIdUtils.wrapId(id);
  },

  /**
   * Legacy validate function for backwards compatibility
   * @deprecated Use ObjectIdUtils.validate() instead
   */
  validate(id) {
    console.warn('⚠️  Warning: validate() is deprecated. Use ObjectIdUtils.validate() instead.');
    return ObjectIdUtils.validate(id);
  }
};

// Export both new API and legacy API for backwards compatibility
module.exports = {
  // New recommended API
  connect: (env, callback, options) => dbManager.connect(env, callback, options),
  disconnect: (callback) => dbManager.close(callback),
  getConnectionStatus: () => dbManager.getConnectionStatus(),
  waitForConnection: (timeout) => dbManager.waitForConnection(timeout),
  
  // ObjectId utilities
  ObjectId: ObjectIdUtils,
  
  // Database manager instance (for advanced usage)
  dbManager,
  
  // Mongoose instance (for direct access if needed)
  mongoose,
  
  // Legacy API (backwards compatibility)
  ...legacyAPI
};      