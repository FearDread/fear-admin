/**
 * Default state configuration options
 */
const DEFAULT_OPTIONS = {
  includeEntityState: true,
  includePagination: true,
  includeFiltering: true,
  includeSorting: true,
  includeSelection: true,
  includeValidation: false,
  includeMetadata: true,
  customFields: {},
};

/**
 * Standard loading states for async operations
 */
const LOADING_STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

/**
 * Standard sort orders
 */
const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

/**
 * Validates the namespace parameter
 * @param {string} namespace - The namespace for the state
 * @throws {Error} If namespace is invalid
 */
const validateNamespace = (namespace) => {
  if (!namespace || typeof namespace !== 'string') {
    throw new Error('Namespace must be a non-empty string');
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(namespace)) {
    throw new Error('Namespace must be a valid identifier (letters, numbers, underscore, starting with letter)');
  }
};

/**
 * Creates pagination state
 * @returns {Object} Pagination state object
 */
const createPaginationState = () => ({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

/**
 * Creates filtering state
 * @returns {Object} Filtering state object
 */
const createFilteringState = () => ({
  filters: {},
  activeFilters: [],
  searchTerm: '',
  searchFields: [],
});

/**
 * Creates sorting state
 * @returns {Object} Sorting state object
 */
const createSortingState = () => ({
  sortBy: null,
  sortOrder: SORT_ORDERS.ASC,
  multiSort: [],
});

/**
 * Creates selection state
 * @returns {Object} Selection state object
 */
const createSelectionState = () => ({
  selectedItems: [],
  selectedIds: [],
  allSelected: false,
  selectionMode: 'multiple', // 'single', 'multiple', 'none'
});

/**
 * Creates validation state
 * @returns {Object} Validation state object
 */
const createValidationState = () => ({
  validationErrors: {},
  isValid: true,
  fieldErrors: {},
  touched: {},
});

/**
 * Creates metadata state for tracking additional information
 * @returns {Object} Metadata state object
 */
const createMetadataState = () => ({
  lastFetch: null,
  lastUpdate: null,
  version: 0,
  source: null,
  cached: false,
  stale: false,
});

/**
 * Creates async operation state for tracking multiple operations
 * @returns {Object} Async operations state
 */
const createAsyncOperationsState = () => ({
  operations: {},
  globalLoading: false,
  operationQueue: [],
});

/**
 * Deep merges two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object') return target;
  
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  
  return result;
};

/**
 * Creates a comprehensive Redux state structure for an entity
 * @param {string} namespace - The entity namespace/name
 * @param {Object} options - Configuration options for state creation
 * @param {boolean} options.includeEntityState - Include entity-specific state
 * @param {boolean} options.includePagination - Include pagination state
 * @param {boolean} options.includeFiltering - Include filtering state
 * @param {boolean} options.includeSorting - Include sorting state
 * @param {boolean} options.includeSelection - Include selection state
 * @param {boolean} options.includeValidation - Include validation state
 * @param {boolean} options.includeMetadata - Include metadata state
 * @param {Object} options.customFields - Custom fields to add to state
 * @returns {Object} Complete initial state object
 */
export const StateFactory = (namespace, options = {}) => {
  validateNamespace(namespace);
  
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Base state - always included
  const baseState = {
    // Core data
    data: [],
    loading: false,
    success: false,
    error: null,
    
    // Enhanced loading states
    loadingState: LOADING_STATES.IDLE,
    
    // Entity-specific state (dynamic key)
    ...(config.includeEntityState && {
      [namespace]: null,
      [`${namespace}List`]: [],
      [`current${namespace.charAt(0).toUpperCase() + namespace.slice(1)}`]: null,
    }),
  };

  // Optional state sections
  const optionalStates = {
    ...(config.includePagination && {
      pagination: createPaginationState(),
    }),
    
    ...(config.includeFiltering && {
      filtering: createFilteringState(),
    }),
    
    ...(config.includeSorting && {
      sorting: createSortingState(),
    }),
    
    ...(config.includeSelection && {
      selection: createSelectionState(),
    }),
    
    ...(config.includeValidation && {
      validation: createValidationState(),
    }),
    
    ...(config.includeMetadata && {
      metadata: createMetadataState(),
    }),
    
    // Async operations tracking
    async: createAsyncOperationsState(),
  };

  // Merge all states
  const initialState = {
    ...baseState,
    ...optionalStates,
    ...config.customFields,
  };

  return initialState;
};

/**
 * Creates a minimal state for simple use cases
 * @param {string} namespace - The entity namespace
 * @returns {Object} Minimal state object
 */
StateFactory.minimal = (namespace) => {
  return StateFactory(namespace, {
    includeEntityState: true,
    includePagination: false,
    includeFiltering: false,
    includeSorting: false,
    includeSelection: false,
    includeValidation: false,
    includeMetadata: false,
  });
};

/**
 * Creates state optimized for lists/tables
 * @param {string} namespace - The entity namespace
 * @returns {Object} List-optimized state object
 */
StateFactory.forList = (namespace) => {
  return StateFactory(namespace, {
    includeEntityState: true,
    includePagination: true,
    includeFiltering: true,
    includeSorting: true,
    includeSelection: true,
    includeValidation: false,
    includeMetadata: true,
  });
};

/**
 * Creates state optimized for forms
 * @param {string} namespace - The entity namespace
 * @returns {Object} Form-optimized state object
 */
StateFactory.forForm = (namespace) => {
  return StateFactory(namespace, {
    includeEntityState: true,
    includePagination: false,
    includeFiltering: false,
    includeSorting: false,
    includeSelection: false,
    includeValidation: true,
    includeMetadata: true,
    customFields: {
      formData: {},
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
    },
  });
};

/**
 * Creates state for real-time/live data
 * @param {string} namespace - The entity namespace
 * @returns {Object} Real-time optimized state object
 */
StateFactory.forRealTime = (namespace) => {
  return StateFactory(namespace, {
    includeEntityState: true,
    includePagination: false,
    includeFiltering: false,
    includeSorting: false,
    includeSelection: false,
    includeValidation: false,
    includeMetadata: true,
    customFields: {
      connected: false,
      connectionStatus: 'disconnected',
      lastHeartbeat: null,
      subscriptions: [],
      liveUpdates: true,
    },
  });
};

/**
 * State factory for normalized entities (works well with RTK's createEntityAdapter)
 * @param {string} namespace - The entity namespace
 * @returns {Object} Normalized state structure
 */
StateFactory.normalized = (namespace) => {
  return StateFactory(namespace, {
    includeEntityState: false,
    customFields: {
      ids: [],
      entities: {},
    },
  });
};

/**
 * Creates state with custom async operations tracking
 * @param {string} namespace - The entity namespace
 * @param {string[]} operations - List of operation names to track
 * @returns {Object} State with operation tracking
 */
StateFactory.withOperations = (namespace, operations = []) => {
  const operationStates = operations.reduce((acc, op) => {
    acc[`${op}Loading`] = false;
    acc[`${op}Success`] = false;
    acc[`${op}Error`] = null;
    return acc;
  }, {});

  return StateFactory(namespace, {
    customFields: {
      ...operationStates,
      operations: operations.reduce((acc, op) => {
        acc[op] = {
          loading: false,
          success: false,
          error: null,
          lastRun: null,
        };
        return acc;
      }, {}),
    },
  });
};

/**
 * Utility functions for working with state
 */
StateFactory.utils = {
  /**
   * Gets loading states enum
   * @returns {Object} Loading states
   */
  getLoadingStates: () => ({ ...LOADING_STATES }),
  
  /**
   * Gets sort orders enum
   * @returns {Object} Sort orders
   */
  getSortOrders: () => ({ ...SORT_ORDERS }),
  
  /**
   * Creates a loading state updater
   * @param {string} operation - Operation name
   * @returns {Object} Loading state updates
   */
  createLoadingUpdates: (operation = 'default') => ({
    pending: {
      loading: true,
      success: false,
      error: null,
      loadingState: LOADING_STATES.PENDING,
      [`async.operations.${operation}.loading`]: true,
    },
    fulfilled: {
      loading: false,
      success: true,
      error: null,
      loadingState: LOADING_STATES.FULFILLED,
      [`async.operations.${operation}.loading`]: false,
      [`async.operations.${operation}.success`]: true,
      [`async.operations.${operation}.lastRun`]: new Date().toISOString(),
    },
    rejected: (error) => ({
      loading: false,
      success: false,
      error,
      loadingState: LOADING_STATES.REJECTED,
      [`async.operations.${operation}.loading`]: false,
      [`async.operations.${operation}.error`]: error,
      [`async.operations.${operation}.lastRun`]: new Date().toISOString(),
    }),
  }),
  
  /**
   * Validates state structure
   * @param {Object} state - State to validate
   * @param {string} namespace - Expected namespace
   * @returns {boolean} Whether state is valid
   */
  validateState: (state, namespace) => {
    if (!state || typeof state !== 'object') return false;
    if (!Array.isArray(state.data)) return false;
    if (typeof state.loading !== 'boolean') return false;
    if (typeof state.success !== 'boolean') return false;
    return true;
  },
  
  /**
   * Deep merges state updates
   * @param {Object} currentState - Current state
   * @param {Object} updates - State updates
   * @returns {Object} Merged state
   */
  mergeState: deepMerge,
  
  /**
   * Resets state to initial values
   * @param {string} namespace - Entity namespace
   * @param {Object} options - State options
   * @returns {Object} Reset state
   */
  resetState: (namespace, options = {}) => {
    return StateFactory(namespace, options);
  },
};

export default StateFactory;