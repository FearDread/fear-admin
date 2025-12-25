import { API } from "@feardread/feature-factory";

const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKEN: 'auth_token',
  REMEMBER_ME: 'auth_remember',
  EXPIRES_AT: 'auth_expires',
};

/**
 * Load user from localStorage
 */
export const loadUserFromStorage = () => {
  try {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    
    const userStr = storage.getItem(STORAGE_KEYS.USER);
    const token = storage.getItem(STORAGE_KEYS.TOKEN);
    const expiresAt = storage.getItem(STORAGE_KEYS.EXPIRES_AT);
    
    if (userStr && token) {
      // Check if token is expired
      if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        if (expiryDate < new Date()) {
          // Token expired, clear storage
          clearUserStorage();
          return null;
        }
      }
      
      const user = JSON.parse(userStr);
      
      // Set auth in API
      API.setAuth(token, user);
      
      return {
        currentUser: user,
        token,
        isAuthenticated: true,
        rememberMe,
      };
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
  }
  return null;
};

/**
 * Save user to storage
 */
export const saveUserToStorage = (user, token, rememberMe = false, expiresAt = null) => {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    storage.setItem(STORAGE_KEYS.TOKEN, token);
    
    if (expiresAt) {
      storage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
    }
    
    // Always store remember me preference in localStorage
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
    
    // Set auth in API
    API.setAuth(token, user);
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

/**
 * Clear user from storage
 */
export const clearUserStorage = () => {
  try {
    // Clear from both storages
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(STORAGE_KEYS.USER);
      storage.removeItem(STORAGE_KEYS.TOKEN);
      storage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    });
    
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    
    // Clear API auth
    API.clearAuth();
  } catch (error) {
    console.error('Error clearing user storage:', error);
  }
};

export default {
  save: saveUserToStorage,
  load: loadUserFromStorage,
  clear: clearUserStorage
}