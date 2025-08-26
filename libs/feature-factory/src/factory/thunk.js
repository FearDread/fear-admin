import { createAsyncThunk } from '@reduxjs/toolkit';
import API from './api';

/**
 * HTTP methods supported by the ThunkFactory
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Standard operation prefixes and their configurations
 */
const STANDARD_OPERATIONS = {
  all: { method: HTTP_METHODS.GET, useParams: false },
  one: { method: HTTP_METHODS.GET, useParams: false, useIdInUrl: true },
  search: { method: HTTP_METHODS.GET, useParams: true },
  create: { method: HTTP_METHODS.POST, useParams: false },
  update: { method: HTTP_METHODS.PUT, useParams: false, useIdInUrl: true },
  patch: { method: HTTP_METHODS.PATCH, useParams: false, useIdInUrl: true },
  delete: { method: HTTP_METHODS.DELETE, useParams: false, useIdInUrl: true },
};

/**
 * Validates input parameters for thunk creation
 * @param {string} entity - The entity name
 * @param {string} prefix - The operation prefix
 * @throws {Error} If validation fails
 */
const validateThunkParams = (entity, prefix) => {
  if (!entity || typeof entity !== 'string') {
    throw new Error('Entity must be a non-empty string');
  }
  if (!prefix || typeof prefix !== 'string') {
    throw new Error('Prefix must be a non-empty string');
  }
};

/**
 * Builds the URL for the API call
 * @param {string} entity - The entity name
 * @param {string} prefix - The operation prefix
 * @param {Object} params - Parameters object
 * @param {boolean} useIdInUrl - Whether to append ID to URL
 * @returns {string} The constructed URL
 */
const buildUrl = (entity, prefix, params = {}, useIdInUrl = false) => {
  let url = `${entity}`;
  
  if (useIdInUrl && params?.id) {
    url += `/${params.id}`;
  } else if (!useIdInUrl || prefix !== 'one') {
    url += `/${prefix}`;
  }
  
  return url;
};

/**
 * Handles API response consistently
 * @param {Object} response - API response object
 * @returns {any} The response data
 */
const handleResponse = (response) => {
  // Handle different response structures
  if (response?.data?.result !== undefined) {
    return response.data.result;
  }
  if (response?.data !== undefined) {
    return response.data;
  }
  return response;
};

/**
 * Handles API errors consistently
 * @param {Error} error - Error object
 * @param {Object} thunkApi - Redux Toolkit thunk API
 * @returns {any} Rejected value
 */
const handleError = (error, thunkApi) => {
  const errorMessage = error?.response?.data?.message || 
                      error?.message || 
                      'An unknown error occurred';
  
  const errorPayload = {
    message: errorMessage,
    status: error?.response?.status,
    code: error?.code,
  };

  return thunkApi.rejectWithValue(errorPayload);
};

/**
 * Creates a generic async thunk with configurable HTTP method and behavior
 * @param {string} entity - The entity name
 * @param {string} prefix - The operation prefix
 * @param {Object} options - Configuration options
 * @returns {Function} The created async thunk
 */
const createGenericThunk = (entity, prefix, options = {}) => {
  validateThunkParams(entity, prefix);
  
  const config = {
    method: HTTP_METHODS.GET,
    useParams: false,
    useIdInUrl: false,
    customUrl: null,
    ...options,
  };

  return createAsyncThunk(
    `${entity}/${prefix}`,
    async (payload = {}, thunkApi) => {
      try {
        const url = config.customUrl || buildUrl(entity, prefix, payload, config.useIdInUrl);
        
        let apiCall;
        const apiConfig = config.useParams ? { params: payload } : {};

        switch (config.method) {
          case HTTP_METHODS.GET:
            apiCall = API.get(url, apiConfig);
            break;
          case HTTP_METHODS.POST:
            apiCall = API.post(url, payload, apiConfig);
            break;
          case HTTP_METHODS.PUT:
            apiCall = API.put(url, payload, apiConfig);
            break;
          case HTTP_METHODS.PATCH:
            apiCall = API.patch(url, payload, apiConfig);
            break;
          case HTTP_METHODS.DELETE:
            apiCall = API.delete(url, apiConfig);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${config.method}`);
        }

        const response = await apiCall;
        return handleResponse(response);
      } catch (error) {
        return handleError(error, thunkApi);
      }
    }
  );
};

/**
 * Factory for creating Redux async thunks with standardized patterns
 */
export const ThunkFactory = {
  /**
   * Creates a GET request thunk (legacy method for backward compatibility)
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @returns {Function} The created async thunk
   */
  create: (entity, prefix) => {
    validateThunkParams(entity, prefix);
    
    const operation = STANDARD_OPERATIONS[prefix];
    if (operation) {
      return createGenericThunk(entity, prefix, operation);
    }
    
    // Fallback to original behavior for custom prefixes
    const useParams = prefix === 'search';
    const useIdInUrl = prefix === 'one';
    
    return createGenericThunk(entity, prefix, {
      method: HTTP_METHODS.GET,
      useParams,
      useIdInUrl,
    });
  },

  /**
   * Creates a POST request thunk (legacy method for backward compatibility)
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @returns {Function} The created async thunk
   */
  post: (entity, prefix) => {
    return createGenericThunk(entity, prefix, {
      method: HTTP_METHODS.POST,
      useParams: false,
    });
  },

  /**
   * Creates a PUT request thunk
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @returns {Function} The created async thunk
   */
  put: (entity, prefix) => {
    return createGenericThunk(entity, prefix, {
      method: HTTP_METHODS.PUT,
      useIdInUrl: prefix === 'update',
    });
  },

  /**
   * Creates a PATCH request thunk
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @returns {Function} The created async thunk
   */
  patch: (entity, prefix) => {
    return createGenericThunk(entity, prefix, {
      method: HTTP_METHODS.PATCH,
      useIdInUrl: true,
    });
  },

  /**
   * Creates a DELETE request thunk
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @returns {Function} The created async thunk
   */
  delete: (entity, prefix) => {
    return createGenericThunk(entity, prefix, {
      method: HTTP_METHODS.DELETE,
      useIdInUrl: true,
    });
  },

  /**
   * Creates a custom thunk with full control over configuration
   * @param {string} entity - The entity name
   * @param {string} prefix - The operation prefix
   * @param {Object} options - Custom configuration options
   * @returns {Function} The created async thunk
   */
  custom: (entity, prefix, options = {}) => {
    return createGenericThunk(entity, prefix, options);
  },

  /**
   * Creates standard CRUD thunks for an entity
   * @param {string} entity - The entity name
   * @returns {Object} Object containing all CRUD thunks
   */
  createCrud: (entity) => {
    validateThunkParams(entity, 'crud');
    
    return {
      fetchAll: ThunkFactory.create(entity, 'all'),
      fetchOne: ThunkFactory.create(entity, 'one'),
      create: ThunkFactory.post(entity, 'create'),
      update: ThunkFactory.put(entity, 'update'),
      patch: ThunkFactory.patch(entity, 'patch'),
      delete: ThunkFactory.delete(entity, 'delete'),
      search: ThunkFactory.create(entity, 'search'),
    };
  },

  /**
   * Gets available HTTP methods
   * @returns {Object} HTTP methods object
   */
  getHttpMethods: () => ({ ...HTTP_METHODS }),

  /**
   * Gets standard operations configuration
   * @returns {Object} Standard operations object
   */
  getStandardOperations: () => ({ ...STANDARD_OPERATIONS }),
};

export default ThunkFactory;