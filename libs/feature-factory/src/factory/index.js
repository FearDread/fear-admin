import { createSlice, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import ThunkFactory from './thunk';
import StateFactory from './state';

/**
 * Creates a Redux feature with standardized structure including slice, async actions, and reducers
 * @param {string} entity - The entity name for the feature
 * @param {Object} reducers - Custom reducers to include in the slice
 * @param {Object|null} endpoints - API endpoints (currently unused)
 * @returns {Object} Feature factory instance with methods to create slices and manage reducers
 */
export function FeatureFactory(entity, reducers = {}, endpoints = null) {
  if (!entity || typeof entity !== 'string') {
    throw new Error('Entity name must be provided as a string');
  }

  const adapter = createEntityAdapter();

  /**
   * Creates a dynamic reducer manager for adding/removing reducers at runtime
   * @param {Object} initialReducers - Initial set of reducers
   * @returns {Object} Reducer manager with methods to manipulate reducers
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
   * @param {Object} source - Source object
   * @param {Object} destination - Destination object
   * @returns {Object} Merged destination object
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
   * Creates standard async thunks for common operations
   * @param {string} sliceName - Name of the slice
   * @returns {Object} Standard async thunks
   */
  const createStandardThunks = (sliceName) => ({
    fetch: ThunkFactory.create(sliceName, 'all'),
    fetchOne: ThunkFactory.create(sliceName, 'one'),
    search: ThunkFactory.create(sliceName, 'search'),
  });

  /**
   * Adds standard async action handlers to builder
   * @param {Object} builder - RTK builder object
   * @param {Object} asyncActions - Async actions to handle
   * @param {string} sliceName - Name of the slice
   */
  const addAsyncActionHandlers = (builder, asyncActions, sliceName) => {
    Object.entries(asyncActions).forEach(([key, action]) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state, actionPayload) => {
          state.loading = false;
          state.success = true;
          state.data = actionPayload.payload;
          
          // Handle single item for fetchOne operation
          if (key === 'fetchOne' && Array.isArray(actionPayload.payload)) {
            state[sliceName] = actionPayload.payload[0];
          } else if (Array.isArray(actionPayload.payload) && actionPayload.payload.length > 0) {
            state[sliceName] = actionPayload.payload[0];
          }
        })
        .addCase(action.rejected, (state, actionPayload) => {
          state.loading = false;
          state.success = false;
          state.error = actionPayload.error || actionPayload.payload;
        });
    });
  };

  /**
   * Creates a Redux slice with standard and custom async actions
   * @param {Object} options - Configuration options
   * @param {Object} options.service - Custom service actions
   * @param {Object} options.initialState - Custom initial state
   * @returns {Object} Created slice and async actions
   */
  const createSlice = (options = {}) => {
    const { service = null, initialState = null } = options;
    const sliceName = entity;
    
    // Create standard thunks
    const standardThunks = createStandardThunks(sliceName);
    
    // Create the slice
    const factorySlice = createSlice({
      name: sliceName,
      initialState: initialState || StateFactory(sliceName),
      reducers,
      extraReducers: (builder) => {
        // Add standard async action handlers
        addAsyncActionHandlers(builder, standardThunks, sliceName);
        
        // Add custom service action handlers
        if (service && typeof service === 'object') {
          const customActions = Object.entries(service).reduce((acc, [key, action]) => {
            // Only add if it's not already in standard thunks
            if (!standardThunks[key]) {
              acc[key] = action;
            }
            return acc;
          }, {});
          
          addAsyncActionHandlers(builder, customActions, sliceName);
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
    };
  };

  // Public API
  return {
    entity,
    reducers,
    adapter,
    manager: createReducerManager,
    inject: mergeObjects,
    create: createSlice,
    
    // Utility methods
    getEntityName: () => entity,
    getAdapter: () => adapter,
  };
}

export default FeatureFactory;