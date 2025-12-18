import { createSlice, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import ThunkFactory from './thunk';
import StateFactory from './state';
import UtilsFactory from './utils';

/**
 * Creates a Redux feature with standardized structure including slice, async actions, and reducers
 * @param {string} entity - The entity name for the feature
 * @param {Object} customReducers - Custom reducers to include in the slice
 * @param {Object|null} endpoints - API endpoints (currently unused)
 * @returns {Object} Feature factory instance with methods to create slices and manage reducers
 */
export function FeatureFactory(entity, customReducers = {}, endpoints = null) {
  if (!entity || typeof entity !== 'string') {
    throw new Error('Entity name must be provided as a string');
  }

  const adapter = createEntityAdapter();
  const commonReducers = UtilsFactory.createReducers(entity, adapter);

  /**
   * Creates a dynamic reducer manager for adding/removing reducers at runtime
   */
  const createReducerManager = (initialReducers = {}) => {
    const reducersMap = { ...initialReducers };
    let combinedReducer = combineReducers(reducersMap);

    return {
      reduce: (state, action) => combinedReducer(state, action),

      add: (key, reducer) => {
        if (!key || typeof key !== 'string') {
          console.warn('Invalid reducer key provided');
          return;
        }
        if (reducersMap[key]) {
          console.warn(`Reducer with key '${key}' already exists`);
          return;
        }

        reducersMap[key] = reducer;
        combinedReducer = combineReducers(reducersMap);
      },

      remove: (key) => {
        if (!key || !reducersMap[key]) {
          console.warn(`Reducer with key '${key}' does not exist`);
          return;
        }

        delete reducersMap[key];
        combinedReducer = combineReducers(reducersMap);
      },

      getReducerMap: () => ({ ...reducersMap }),
    };
  };

  /**
   * Merges properties from source object into destination object
   */
  const mergeObjects = (source, destination) => {
    if (!source || !destination) {
      throw new Error('Both source and destination objects must be provided');
    }

    return Object.keys(source).reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        acc[key] = source[key];
      }
      return acc;
    }, { ...destination });
  };

  /**
   * Creates a Redux slice with standard and custom async actions
   * @param {Object} options - Configuration options
   * @param {Object} options.service - Custom service actions
   * @param {Object} options.initialState - Custom initial state
   * @param {Object} options.stateOptions - State factory configuration
   * @param {Object} options.operations - Which standard operations to include
   * @param {boolean} options.includeCommonReducers - Whether to include common reducers
   * @param {Array} options.excludeReducers - List of common reducers to exclude
   * @returns {Object} Created slice and async actions
   */
  const createFactorySlice = (options = {}) => {
    const {
      service = null,
      initialState = null,
      stateOptions = {},
      operations = {},
      includeCommonReducers = true,
      excludeReducers = [],
    } = options;

    const sliceName = entity;

    // Create standard thunks based on operations config
    const standardThunks = UtilsFactory.createThunks(sliceName, operations);

    // Filter common reducers based on exclude list
    const filteredCommonReducers = includeCommonReducers
      ? Object.entries(commonReducers).reduce((acc, [key, reducer]) => {
        if (!excludeReducers.includes(key)) {
          acc[key] = reducer;
        }
        return acc;
      }, {})
      : {};

    // Merge all reducers (common + custom)
    const allReducers = {
      ...filteredCommonReducers,
      ...customReducers,
    };

    // Create the slice
    const factorySlice = createSlice({
      name: sliceName,
      initialState: initialState || StateFactory(sliceName, stateOptions),
      reducers: allReducers,
      extraReducers: (builder) => {
        // Add standard async action handlers
        UtilsFactory.addHandlers(builder, standardThunks, sliceName);

        // Add custom service action handlers
        if (service && typeof service === 'object') {
          const customActions = Object.entries(service).reduce((acc, [key, action]) => {
            // Only add if it's not already in standard thunks
            if (!standardThunks[key]) {
              acc[key] = action;
            }
            return acc;
          }, {});

          UtilsFactory.addHandlers(builder, customActions, sliceName);
        }
      },
    });

    // Merge standard and custom async actions
    const asyncActions = service
      ? mergeObjects(standardThunks, service)
      : standardThunks;

    return {
      slice: factorySlice,
      asyncActions,
      reducers: allReducers,
    };
  };

  /**
   * Creates a complete CRUD feature with all operations
   */
  const createCrudFeature = (options = {}) => {
    return createFactorySlice({
      ...options,
      operations: {
        fetch: true,
        fetchOne: true,
        search: true,
        create: true,
        update: true,
        patch: true,
        delete: true,
      },
    });
  };

  /**
   * Creates a read-only feature (fetch, fetchOne, search only)
   */
  const createBasicFeature = (options = {}) => {
    return createFactorySlice({
      ...options,
      operations: {
        fetch: true,
        fetchOne: true,
        search: true,
        create: false,
        update: false,
        patch: false,
        delete: false,
      },
    });
  };

  // Public API
  return {
    entity,
    adapter,
    reducers: commonReducers,
    manager: createReducerManager,

    // Utilities
    inject: mergeObjects,
    createReducer: (handler) => handler,
    createHandler: (builder, action, handlers) => {
      if (handlers.pending) {
        builder.addCase(action.pending, handlers.pending);
      }
      if (handlers.fulfilled) {
        builder.addCase(action.fulfilled, handlers.fulfilled);
      }
      if (handlers.rejected) {
        builder.addCase(action.rejected, handlers.rejected);
      }
    },
    // Creators
    create: createFactorySlice,
    createCrud: createCrudFeature,
    createBasic: createBasicFeature,
    createThunks: (operations) => UtilsFactor.createThunks(entity, operations),
    createCustomThunk: (prefix, options) => ThunkFactory.custom(entity, prefix, options),

    // Getters
    getEntityName: () => entity,
    getAdapter: () => adapter,
    getCommonReducers: (exclude = []) => {
      return Object.entries(commonReducers).reduce((acc, [key, reducer]) => {
        if (!exclude.includes(key)) {
          acc[key] = reducer;
        }
        return acc;
      }, {});
    },
  }
}

export default FeatureFactory;