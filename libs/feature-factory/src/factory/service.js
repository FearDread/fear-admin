import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Default configuration for the API factory
 */
const DEFAULT_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/fear/api/',
  timeout: 30000,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Add common headers here
    headers.set('Content-Type', 'application/json');
    
    // Add auth token if available
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
};

/**
 * Standard HTTP methods
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Standard endpoint configurations for common CRUD operations
 */
const STANDARD_ENDPOINTS = {
  getAll: {
    method: HTTP_METHODS.GET,
    url: (entity) => `${entity}/all`,
    providesTags: (entity) => [{ type: entity, id: 'LIST' }],
  },
  getById: {
    method: HTTP_METHODS.GET,
    url: (entity, id) => `${entity}/${id}`,
    providesTags: (entity, id) => [{ type: entity, id }],
  },
  create: {
    method: HTTP_METHODS.POST,
    url: (entity) => `${entity}`,
    invalidatesTags: (entity) => [{ type: entity, id: 'LIST' }],
  },
  update: {
    method: HTTP_METHODS.PUT,
    url: (entity, id) => `${entity}/${id}`,
    invalidatesTags: (entity, id) => [
      { type: entity, id },
      { type: entity, id: 'LIST' },
    ],
  },
  patch: {
    method: HTTP_METHODS.PATCH,
    url: (entity, id) => `${entity}/${id}`,
    invalidatesTags: (entity, id) => [
      { type: entity, id },
      { type: entity, id: 'LIST' },
    ],
  },
  delete: {
    method: HTTP_METHODS.DELETE,
    url: (entity, id) => `${entity}/${id}`,
    invalidatesTags: (entity, id) => [
      { type: entity, id },
      { type: entity, id: 'LIST' },
    ],
  },
  search: {
    method: HTTP_METHODS.GET,
    url: (entity) => `${entity}/search`,
    providesTags: (entity) => [{ type: entity, id: 'SEARCH' }],
  },
};

/**
 * Validates input parameters
 * @param {string} sliceName - The slice/entity name
 * @throws {Error} If validation fails
 */
const validateParams = (sliceName) => {
  if (!sliceName || typeof sliceName !== 'string') {
    throw new Error('SliceName must be a non-empty string');
  }
};

/**
 * Transforms entity name to proper case for tag types
 * @param {string} entity - Entity name
 * @returns {string} Capitalized entity name
 */
const toTagType = (entity) => {
  return entity.charAt(0).toUpperCase() + entity.slice(1);
};

/**
 * Creates a standardized error handler
 * @param {Object} error - Error object from RTK Query
 * @returns {Object} Formatted error
 */
const handleError = (error) => {
  if (error.status) {
    return {
      status: error.status,
      message: error.data?.message || `HTTP Error ${error.status}`,
      data: error.data,
    };
  }
  
  return {
    status: 'FETCH_ERROR',
    message: error.message || 'Network error occurred',
    error: error.error,
  };
};

/**
 * Creates query configuration for RTK Query
 * @param {Object} config - Endpoint configuration
 * @param {string} entity - Entity name
 * @param {any} args - Arguments passed to the query
 * @returns {Object} RTK Query configuration
 */
const createQueryConfig = (config, entity, args = {}) => {
  const { method, url: urlFn } = config;
  
  let queryConfig = {
    method,
    url: typeof urlFn === 'function' ? urlFn(entity, args.id, args) : urlFn,
  };

  // Add body for mutations
  if (method !== HTTP_METHODS.GET && method !== HTTP_METHODS.DELETE) {
    queryConfig.body = args.data || args;
  }

  // Add params for GET requests with parameters
  if (method === HTTP_METHODS.GET && args.params) {
    queryConfig.params = args.params;
  }

  return queryConfig;
};

/**
 * Factory function to create RTK Query APIs with standardized patterns
 * @param {string} sliceName - The slice/entity name
 * @param {Object} options - Configuration options
 * @param {string[]} options.tagTypes - Additional tag types beyond the entity
 * @param {Object} options.baseQuery - Custom base query configuration
 * @param {boolean} options.includeStandardEndpoints - Whether to include CRUD endpoints
 * @returns {Object} ApiFactory instance with methods to build and configure the API
 */
const ApiFactory = (sliceName, options = {}) => {
  validateParams(sliceName);
  
  const config = {
    tagTypes: ['Product', 'Order', 'User', 'Category'],
    baseQuery: {},
    includeStandardEndpoints: true,
    ...options,
  };

  // Ensure the entity tag type is included
  const entityTagType = toTagType(sliceName);
  if (!config.tagTypes.includes(entityTagType)) {
    config.tagTypes.push(entityTagType);
  }

  // Create base query with merged configuration
  const baseQueryConfig = {
    ...DEFAULT_CONFIG,
    ...config.baseQuery,
  };

  // Create the base API
  const baseApi = createApi({
    reducerPath: `${sliceName}Api`,
    tagTypes: config.tagTypes,
    baseQuery: fetchBaseQuery(baseQueryConfig),
    endpoints: () => ({}),
  });

  /**
   * Injects a single endpoint into the API
   * @param {string} name - Endpoint name
   * @param {Object} endpointConfig - Endpoint configuration
   * @param {string} endpointConfig.method - HTTP method
   * @param {string|Function} endpointConfig.url - URL or URL generator function
   * @param {string} endpointConfig.type - 'query' or 'mutation'
   * @param {Function} endpointConfig.providesTags - Tags provided by this endpoint
   * @param {Function} endpointConfig.invalidatesTags - Tags invalidated by this endpoint
   * @param {Function} endpointConfig.transformResponse - Response transformer
   * @param {Function} endpointConfig.transformErrorResponse - Error transformer
   * @returns {Object} Enhanced API with injected endpoint
   */
  const injectEndpoint = (name, endpointConfig) => {
    const {
      method = HTTP_METHODS.GET,
      url,
      type = method === HTTP_METHODS.GET ? 'query' : 'mutation',
      providesTags,
      invalidatesTags,
      transformResponse,
      transformErrorResponse = handleError,
    } = endpointConfig;

    return baseApi.injectEndpoints({
      endpoints: (builder) => ({
        [name]: builder[type]({
          query: (args = {}) => createQueryConfig({ method, url }, sliceName, args),
          providesTags: providesTags 
            ? (result, error, args) => providesTags(sliceName, args?.id, result, error, args)
            : undefined,
          invalidatesTags: invalidatesTags
            ? (result, error, args) => invalidatesTags(sliceName, args?.id, result, error, args)
            : undefined,
          transformResponse,
          transformErrorResponse,
        }),
      }),
    });
  };

  /**
   * Injects multiple endpoints at once
   * @param {Object} endpoints - Object with endpoint configurations
   * @returns {Object} Enhanced API with all injected endpoints
   */
  const injectEndpoints = (endpoints) => {
    return baseApi.injectEndpoints({
      endpoints: (builder) => {
        const builtEndpoints = {};
        
        Object.entries(endpoints).forEach(([name, config]) => {
          const {
            method = HTTP_METHODS.GET,
            url,
            type = method === HTTP_METHODS.GET ? 'query' : 'mutation',
            providesTags,
            invalidatesTags,
            transformResponse,
            transformErrorResponse = handleError,
          } = config;

          builtEndpoints[name] = builder[type]({
            query: (args = {}) => createQueryConfig({ method, url }, sliceName, args),
            providesTags: providesTags 
              ? (result, error, args) => providesTags(sliceName, args?.id, result, error, args)
              : undefined,
            invalidatesTags: invalidatesTags
              ? (result, error, args) => invalidatesTags(sliceName, args?.id, result, error, args)
              : undefined,
            transformResponse,
            transformErrorResponse,
          });
        });
        
        return builtEndpoints;
      },
    });
  };

  /**
   * Creates standard CRUD endpoints for the entity
   * @returns {Object} Enhanced API with standard endpoints
   */
  const createStandardEndpoints = () => {
    const endpoints = {};
    
    Object.entries(STANDARD_ENDPOINTS).forEach(([name, config]) => {
      endpoints[name] = {
        method: config.method,
        url: config.url,
        providesTags: config.providesTags,
        invalidatesTags: config.invalidatesTags,
      };
    });
    
    return injectEndpoints(endpoints);
  };

  /**
   * Creates the final API with all configured endpoints
   * @returns {Object} Complete RTK Query API
   */
  const create = () => {
    let api = baseApi;
    
    if (config.includeStandardEndpoints) {
      api = createStandardEndpoints();
    }
    
    return api;
  };

  /**
   * Creates a custom endpoint with advanced configuration
   * @param {string} name - Endpoint name
   * @param {Object} config - Advanced endpoint configuration
   * @returns {Object} Enhanced API with custom endpoint
   */
  const createCustomEndpoint = (name, config) => {
    return injectEndpoint(name, config);
  };

  /**
   * Creates endpoints for bulk operations
   * @returns {Object} Enhanced API with bulk endpoints
   */
  const createBulkEndpoints = () => {
    const bulkEndpoints = {
      bulkCreate: {
        method: HTTP_METHODS.POST,
        url: `${sliceName}/bulk`,
        invalidatesTags: () => [{ type: entityTagType, id: 'LIST' }],
      },
      bulkUpdate: {
        method: HTTP_METHODS.PUT,
        url: `${sliceName}/bulk`,
        invalidatesTags: () => [{ type: entityTagType, id: 'LIST' }],
      },
      bulkDelete: {
        method: HTTP_METHODS.DELETE,
        url: `${sliceName}/bulk`,
        invalidatesTags: () => [{ type: entityTagType, id: 'LIST' }],
      },
    };
    
    return injectEndpoints(bulkEndpoints);
  };

  // Public API
  return {
    // Core properties
    sliceName,
    entityTagType,
    baseApi,
    
    // Methods
    inject: injectEndpoint,
    injectMany: injectEndpoints,
    create,
    createStandard: createStandardEndpoints,
    createBulk: createBulkEndpoints,
    createCustom: createCustomEndpoint,
    
    // Utilities
    getTagTypes: () => [...config.tagTypes],
    getBaseUrl: () => baseQueryConfig.baseUrl,
    getReducerPath: () => baseApi.reducerPath,
    
    // Advanced methods
    withAuth: (token) => {
      return ApiFactory(sliceName, {
        ...config,
        baseQuery: {
          ...baseQueryConfig,
          prepareHeaders: (headers, api) => {
            headers.set('Authorization', `Bearer ${token}`);
            return DEFAULT_CONFIG.prepareHeaders(headers, api);
          },
        },
      });
    },
    
    withBaseUrl: (baseUrl) => {
      return ApiFactory(sliceName, {
        ...config,
        baseQuery: {
          ...baseQueryConfig,
          baseUrl,
        },
      });
    },
  };
};

/**
 * Creates a complete API factory with all standard endpoints
 * @param {string} sliceName - Entity name
 * @param {Object} options - Configuration options
 * @returns {Object} Complete RTK Query API
 */
ApiFactory.createComplete = (sliceName, options = {}) => {
  return ApiFactory(sliceName, options).create();
};

/**
 * Creates an API factory with only custom endpoints
 * @param {string} sliceName - Entity name
 * @param {Object} endpoints - Custom endpoints
 * @param {Object} options - Configuration options
 * @returns {Object} RTK Query API with custom endpoints
 */
ApiFactory.createCustom = (sliceName, endpoints, options = {}) => {
  return ApiFactory(sliceName, { ...options, includeStandardEndpoints: false })
    .injectMany(endpoints);
};

/**
 * Utility to get standard endpoint configurations
 * @returns {Object} Standard endpoint configurations
 */
ApiFactory.getStandardEndpoints = () => ({ ...STANDARD_ENDPOINTS });

/**
 * Utility to get HTTP methods
 * @returns {Object} HTTP methods
 */
ApiFactory.getHttpMethods = () => ({ ...HTTP_METHODS });

export default ApiFactory;