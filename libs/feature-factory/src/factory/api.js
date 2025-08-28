import axios from 'axios';
import qs from 'qs';
import CacheFactory from './cache';

/**
 * Environment-based configuration
 */
const CONFIG = {
  // API Base URLs
  baseUrls: {
    production: process.env.REACT_APP_API_BASE_URL_PROD || 'http://fear.master.com/fear/api/',
    development: process.env.REACT_APP_API_BASE_URL_DEV || 'http://localhost:4000/fear/api/',
    test: process.env.REACT_APP_API_BASE_URL_TEST || 'http://localhost:3001/fear/api/',
  },
  
  // Token configuration
  tokenNames: {
    bearer: 'Authorization',
    custom: process.env.REACT_APP_JWT_TOKEN_HEADER || 'x-token',
  },
  
  // Cache keys
  cacheKeys: {
    auth: 'auth',
    refreshToken: 'refresh_token',
    userPrefs: 'user_preferences',
  },
  
  // Request configuration
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.REACT_APP_API_RETRY_DELAY) || 1000,
};

/**
 * Gets the appropriate base URL for the current environment
 * @returns {string} Base URL
 */
const getBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  const uri = 'production';
  return CONFIG.baseUrls[uri] || CONFIG.baseUrls.development;
};

/**
 * Gets authentication data from cache
 * @returns {Object|null} Auth data or null
 */
const getAuthData = async () => {
  try {
    const authData = await CacheFactory.local.get(CONFIG.cacheKeys.auth);
    return authData && typeof authData === 'object' ? authData : null;
  } catch (error) {
    console.warn('Failed to retrieve auth data:', error);
    return null;
  }
};

/**
 * Checks if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} Whether token is expired
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Refreshes the authentication token
 * @returns {Promise<string|null>} New token or null if refresh failed
 */
const refreshAuthToken = async () => {
  try {
    const authData = await getAuthData();
    const refreshToken = authData?.refreshToken || await CacheFactory.local.get(CONFIG.cacheKeys.refreshToken);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${getBaseUrl()}auth/refresh`, {
      refreshToken,
    });

    const newAuthData = {
      token: response.data.token,
      refreshToken: response.data.refreshToken || refreshToken,
      user: response.data.user,
      expiresAt: response.data.expiresAt,
    };

    await CacheFactory.local.set(CONFIG.cacheKeys.auth, newAuthData);
    return newAuthData.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await clearAuthData();
    return null;
  }
};

/**
 * Clears authentication data from cache
 */
const clearAuthData = async () => {
  try {
    await Promise.all([
      CacheFactory.local.remove(CONFIG.cacheKeys.auth),
      CacheFactory.local.remove(CONFIG.cacheKeys.refreshToken),
    ]);
  } catch (error) {
    console.warn('Failed to clear auth data:', error);
  }
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
    // Server responded with error status
    return {
      ...baseError,
      message: error.response.data?.message || `HTTP Error ${error.response.status}`,
      status: error.response.status,
      code: error.response.data?.code || error.code,
      data: error.response.data,
    };
  }
  
  if (error.request) {
    // Request made but no response received
    return {
      ...baseError,
      message: 'Network error - no response received',
      code: 'NETWORK_ERROR',
    };
  }
  
  // Something else happened
  return {
    ...baseError,
    message: error.message || 'Request configuration error',
    code: error.code || 'CONFIG_ERROR',
  };
};

/**
 * Request interceptor with retry logic
 * @param {Object} config - Axios config
 * @returns {Promise<Object>} Modified config
 */
const requestInterceptor = async (config) => {
  try {
    // Set retry metadata
    config.metadata = { startTime: Date.now() };
    config._retry = config._retry || 0;

    // Get authentication data
    const authData = await getAuthData();
    let token = authData?.token;

    // Check if token needs refresh
    if (token && isTokenExpired(token) && config._retry === 0) {
      token = await refreshAuthToken();
    }

    // Set authorization headers
    if (token) {
      config.headers[CONFIG.tokenNames.bearer] = `Bearer ${token}`;
      config.headers[CONFIG.tokenNames.custom] = token;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add client info
    config.headers['X-Client-Version'] = process.env.REACT_APP_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = 'web';

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
  // Add response metadata
  response.metadata = {
    responseTime: Date.now() - (response.config.metadata?.startTime || Date.now()),
    requestId: response.config.headers['X-Request-ID'],
  };

  // Log successful responses in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ API Success [${response.status}]:`, {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      responseTime: response.metadata.responseTime,
      requestId: response.metadata.requestId,
    });
  }

  // Validate response structure
  if (response.data && typeof response.data === 'object') {
    // Handle different success status codes
    if ([200, 201, 202, 204].includes(response.status)) {
      return response;
    }
  }

  // Handle edge cases
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // Unexpected status code
  return Promise.reject(formatError({
    response,
    message: `Unexpected response status: ${response.status}`,
  }));
};

/**
 * Response error interceptor with retry and auth handling
 * @param {Object} error - Response error
 * @returns {Promise<Object>} Retry attempt or rejected promise
 */
const responseErrorInterceptor = async (error) => {
  const originalRequest = error.config;
  
  // Format error for consistent handling
  const formattedError = formatError(error);
  
  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ API Error [${formattedError.status}]:`, {
      url: originalRequest?.url,
      method: originalRequest?.method?.toUpperCase(),
      message: formattedError.message,
      requestId: originalRequest?.headers['X-Request-ID'],
    });
  }

  // Handle authentication errors
  if (formattedError.status === 401 && !originalRequest._isRetryingAuth) {
    originalRequest._isRetryingAuth = true;
    
    try {
      const newToken = await refreshAuthToken();
      if (newToken) {
        // Retry original request with new token
        originalRequest.headers[CONFIG.tokenNames.bearer] = `Bearer ${newToken}`;
        originalRequest.headers[CONFIG.tokenNames.custom] = newToken;
        return apiInstance(originalRequest);
      }
    } catch (refreshError) {
      console.error('Auth refresh failed:', refreshError);
    }
    
    // Clear auth data and redirect to login
    await clearAuthData();
    
    // Dispatch auth failure event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:failure', {
        detail: { error: formattedError }
      }));
    }
  }

  // Handle retryable errors
  const isRetryable = [408, 429, 500, 502, 503, 504].includes(formattedError.status) ||
                     formattedError.code === 'NETWORK_ERROR';
  
  if (isRetryable && originalRequest._retry < CONFIG.retryAttempts) {
    originalRequest._retry += 1;
    
    const delay = getRetryDelay(originalRequest._retry);
    console.log(`⏳ Retrying request (${originalRequest._retry}/${CONFIG.retryAttempts}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return apiInstance(originalRequest);
  }

  // Handle rate limiting
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
    withCredentials: true,
    // Disable automatic JSON parsing for better error handling
    transformResponse: [
      (data) => {
        try {
          return JSON.parse(data);
        } catch (error) {
          return data;
        }
      }
    ],
  });

  // Add interceptors
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
  get: apiInstance.get.bind(apiInstance),
  post: apiInstance.post.bind(apiInstance),
  put: apiInstance.put.bind(apiInstance),
  patch: apiInstance.patch.bind(apiInstance),
  delete: apiInstance.delete.bind(apiInstance),
  head: apiInstance.head.bind(apiInstance),
  options: apiInstance.options.bind(apiInstance),

  // Utility methods
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
   * Sets authentication token
   * @param {string} token - Auth token
   * @param {Object} userData - User data
   * @returns {Promise<boolean>} Success status
   */
  setAuth: async (token, userData = {}) => {
    try {
      const authData = {
        token,
        user: userData,
        timestamp: Date.now(),
        expiresAt: userData.expiresAt,
      };
      
      await CacheFactory.local.set(CONFIG.cacheKeys.auth, authData);
      return true;
    } catch (error) {
      console.error('Failed to set auth:', error);
      return false;
    }
  },

  /**
   * Clears authentication
   * @returns {Promise<boolean>} Success status
   */
  clearAuth: async () => {
    try {
      await clearAuthData();
      return true;
    } catch (error) {
      console.error('Failed to clear auth:', error);
      return false;
    }
  },

  /**
   * Gets current auth status
   * @returns {Promise<Object>} Auth status
   */
  getAuthStatus: async () => {
    const authData = await getAuthData();
    const isAuthenticated = !!(authData?.token && !isTokenExpired(authData.token));
    
    return {
      isAuthenticated,
      user: authData?.user || null,
      token: authData?.token || null,
      expiresAt: authData?.expiresAt || null,
    };
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
      return {
        status: 'healthy',
        response: response.data,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: formatError(error),
        timestamp: Date.now(),
      };
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
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress, progressEvent);
        }
      },
    });
  },

  // Configuration access
  config: CONFIG,
  getBaseUrl,
};

// Add event listener for auth failures (optional)
if (typeof window !== 'undefined') {
  window.addEventListener('auth:failure', (event) => {
    console.warn('Authentication failed:', event.detail.error);
    // Could trigger a redirect to login page here
  });
}

export { API };
export default API;