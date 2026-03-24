import axios from 'axios';
import qs from 'qs';
import { Platform } from 'react-native';
import CacheFactory from './cache';

/**
 * Environment-based configuration
 */
const CONFIG = {
  BASE_URL: null,
  environment: process.env.NODE_ENV,
  // API Base URLs
  baseUrls: {
    production: process.env.API_BASE_URL_PROD || 'https://fear.dedyn.io/fear/api/',
    development: process.env.API_BASE_URL_DEV || 'http://localhost:4000/fear/api/',
    test: process.env.API_BASE_URL_TEST || 'https://fear.dedyn.io/fear/api/',
  },
  cacheKeys: {
    userPrefs: 'user_preferences',
  },
  timeout: parseInt(process.env.API_TIMEOUT) || 30000,
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.API_RETRY_DELAY) || 1000,
};

const setBaseUrl = (uri) => {
  CONFIG.BASE_URL = uri || CONFIG.baseUrls['development'];
  getBaseUrl();
};

/**
 * Gets the appropriate base URL for the current environment
 * @returns {string} Base URL
 */
const getBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  if (!CONFIG.BASE_URL) CONFIG.BASE_URL = CONFIG.baseUrls[env] || CONFIG.baseUrls.development;
  return CONFIG.BASE_URL;
};

/**
 * Creates retry delay with exponential backoff
 * @param {number} attempt - Current attempt number
 * @returns {number} Delay in milliseconds
 */
const getRetryDelay = (attempt) => {
  return CONFIG.retryDelay * Math.pow(2, attempt - 1);
};

/**
 * Standardized error formatter
 * @param {Object} error - Axios error object
 * @returns {Object} Formatted error
 */
const formatError = (error) => {
  const baseError = {
    message: 'An unknown error occurred',
    status: null,
    code: null,
    data: null,
    timestamp: new Date().toISOString(),
  };

  if (error.response) {
    return {
      ...baseError,
      message: error.response.data?.message || `HTTP Error ${error.response.status}`,
      status: error.response.status,
      code: error.response.data?.code || error.code,
      data: error.response.data,
    };
  }

  if (error.request) {
    return {
      ...baseError,
      message: 'Network error - no response received',
      code: 'NETWORK_ERROR',
    };
  }

  return {
    ...baseError,
    message: error.message || 'Request configuration error',
    code: error.code || 'CONFIG_ERROR',
  };
};

/**
 * Request interceptor — adds tracking headers
 * @param {Object} config - Axios config
 * @returns {Promise<Object>} Modified config
 */
const requestInterceptor = async (config) => {
  try {
    config.metadata = { startTime: Date.now() };
    config._retry = config._retry || 0;

    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Client-Version'] = process.env.API_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = Platform.OS;   // 'ios' | 'android' | 'web'

    return config;
  } catch (error) {
    console.error('Request interceptor error:', error);
    return config;
  }
};

/**
 * Request error interceptor
 * @param {Object} error - Request error
 * @returns {Promise<Object>} Rejected promise
 */
const requestErrorInterceptor = (error) => {
  console.error('Request setup error:', error);
  return Promise.reject(formatError(error));
};

/**
 * Response interceptor with success handling
 * @param {Object} response - Axios response
 * @returns {Object} Processed response
 */
const responseInterceptor = (response) => {
  response.metadata = {
    responseTime: Date.now() - (response.config.metadata?.startTime || Date.now()),
    requestId: response.config.headers['X-Request-ID'],
  };

  if (CONFIG.environment === 'development') {
    console.log(`✅ API Success [${response.status}]:`, {
      url: response.config.url,
      data: response.data,
      method: response.config.method?.toUpperCase(),
      responseTime: response.metadata.responseTime,
      requestId: response.metadata.requestId,
    });
  }

  if (response.data && typeof response.data === 'object') {
    if ([200, 201, 202, 204].includes(response.status)) {
      return response;
    }
  }

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return Promise.reject(formatError({
    response,
    message: `Unexpected response status: ${response.status}`,
  }));
};

/**
 * Response error interceptor with retry logic
 * @param {Object} error - Response error
 * @returns {Promise<Object>} Retry attempt or rejected promise
 */
const responseErrorInterceptor = async (error) => {
  const originalRequest = error.config;
  const formattedError = formatError(error);

  if (CONFIG.environment === 'development') {
    console.error(`❌ API Error [${formattedError.status}]:`, {
      url: originalRequest?.url,
      error: formattedError,
      method: originalRequest?.method?.toUpperCase(),
      message: formattedError.message,
      requestId: originalRequest?.headers['X-Request-ID'],
    });
  }

  // Handle retryable errors with exponential backoff
  const isRetryable = [408, 429, 500, 502, 503, 504].includes(formattedError.status) ||
                      formattedError.code === 'NETWORK_ERROR';

  if (isRetryable && originalRequest._retry < CONFIG.retryAttempts) {
    originalRequest._retry += 1;
    const delay = getRetryDelay(originalRequest._retry);
    console.log(`⏳ Retrying request (${originalRequest._retry}/${CONFIG.retryAttempts}) in ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return apiInstance(originalRequest);
  }

  // Attach retry-after duration when rate-limited
  if (formattedError.status === 429) {
    const retryAfter = error.response?.headers['retry-after'];
    if (retryAfter) {
      formattedError.retryAfter = parseInt(retryAfter) * 1000;
    }
  }

  return Promise.reject(formattedError);
};

/**
 * Creates the main API instance
 */
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: CONFIG.timeout,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, {
        indices: false,
        skipNulls: true,
        arrayFormat: 'brackets',
      }),
    },
    // withCredentials intentionally omitted — cookies are not supported in React Native
    transformResponse: [
      (data) => {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      },
    ],
  });

  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return instance;
};

// Create the main API instance
const apiInstance = createApiInstance();

/**
 * API utility methods
 */
const API = {
  // Main axios instance
  instance: apiInstance,

  // Direct access to axios methods
  get:     apiInstance.get.bind(apiInstance),
  post:    apiInstance.post.bind(apiInstance),
  put:     apiInstance.put.bind(apiInstance),
  patch:   apiInstance.patch.bind(apiInstance),
  delete:  apiInstance.delete.bind(apiInstance),
  head:    apiInstance.head.bind(apiInstance),
  options: apiInstance.options.bind(apiInstance),

  /**
   * Makes a request with custom configuration
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response
   */
  request: (config) => apiInstance.request(config),

  /**
   * Creates a new API instance with custom configuration
   * @param {Object} customConfig - Custom axios configuration
   * @returns {Object} New API instance
   */
  create: (customConfig = {}) => {
    const customInstance = axios.create({
      ...apiInstance.defaults,
      ...customConfig,
    });
    customInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
    customInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
    return customInstance;
  },

  /**
   * Configures global request defaults
   * @param {Object} config - Configuration object
   */
  configure: (config) => {
    Object.assign(apiInstance.defaults, config);
  },

  /**
   * Health check endpoint
   * @returns {Promise<Object>} Health status
   */
  healthCheck: async () => {
    try {
      const response = await apiInstance.get('health', { timeout: 5000 });
      return { status: 'healthy', response: response.data, timestamp: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: formatError(error), timestamp: Date.now() };
    }
  },

  /**
   * Upload file with progress tracking
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload response
   */
  uploadFile: (url, formData, onProgress) => {
    return apiInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress, progressEvent);
        }
      },
    });
  },

  // Cache utility methods
  getCached:     (key, defaultValue = null) => CacheFactory.local.get(key, defaultValue),
  setCached:     (key, value)               => CacheFactory.local.set(key, value),
  removeCached:  (key)                      => CacheFactory.local.remove(key),
  clearCache:    ()                         => CacheFactory.local.clear(),
  getCacheStats: ()                         => CacheFactory.local.getStats(),

  /** Bulk cache operations */
  cache: {
    getMultiple:    (keys)  => CacheFactory.local.bulk.get(keys),
    setMultiple:    (items) => CacheFactory.local.bulk.set(items),
    removeMultiple: (keys)  => CacheFactory.local.bulk.remove(keys),
  },

  // Configuration access
  config: CONFIG,
  getBaseUrl,
  setBaseUrl,
};

export { API };
export default API;