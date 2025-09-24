// auth/authCache.js
import { CacheFactory } from "@feardread/feature-factory";
import { store } from "../store";

// Create a dedicated auth cache instance
export const authCache = CacheFactory({
  type: 'local',
  prefix: 'auth_',
});

// Alternative: Use existing store cache
// export const authCache = store.local;

// Auth utility functions
export const authUtils = {
  // Save authentication data
  saveAuth: (authData) => {
    try {
      const dataToSave = {
        token: authData.token,
        user: authData.user,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt || Date.now() + (24 * 60 * 60 * 1000), // 24 hours default
        loginTime: Date.now()
      };

      // Save as a single auth object
      const success = authCache.set('auth', dataToSave);
      
      if (success) {
        console.log('Auth data saved successfully');
        return true;
      } else {
        console.error('Failed to save auth data');
        return false;
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
      return false;
    }
  },

  // Get authentication data
  getAuth: () => {
    try {
      const authData = authCache.get('auth');
      console.log('auth data = ', authData);
      
      if (!authData || !authData.token || !authData.user) {
        return null;
      }
      
      return authData;
    } catch (error) {
      console.error('Failed to get auth data:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    try {
      const authData = authCache.get('auth');
      
      if (!authData || !authData.expiresAt) {
        return true;
      }
      
      return Date.now() > authData.expiresAt;
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true;
    }
  },

  // Clear all auth data
  clearAuth: () => {
    try {
      const success = authCache.clear();
      
      if (success) {
        console.log('Auth data cleared successfully');
        return true;
      } else {
        console.error('Failed to clear auth data');
        return false;
      }
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    try {
      const authData = authUtils.getAuth();
      
      if (!authData || !authData.token) {
        return false;
      }
      
      const isExpired = authUtils.isTokenExpired();
      
      if (isExpired) {
        authUtils.clearAuth();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  },

  // Get specific auth property
  getAuthProperty: (property) => {
    try {
      const authData = authCache.get('auth');
      return authData ? authData[property] : null;
    } catch (error) {
      console.error(`Failed to get auth property ${property}:`, error);
      return null;
    }
  },

  // Update specific auth property
  updateAuthProperty: (property, value) => {
    try {
      const authData = authCache.get('auth');
      
      if (!authData) {
        return false;
      }
      
      authData[property] = value;
      return authCache.set('auth', authData);
    } catch (error) {
      console.error(`Failed to update auth property ${property}:`, error);
      return false;
    }
  },

  // Check if auth data exists
  hasAuth: () => {
    try {
      return authCache.has('auth');
    } catch (error) {
      console.error('Failed to check auth existence:', error);
      return false;
    }
  },

  // Get auth cache statistics
  getAuthStats: () => {
    try {
      return authCache.getStats();
    } catch (error) {
      console.error('Failed to get auth cache stats:', error);
      return null;
    }
  },

  // Refresh token helper
  updateToken: (newToken, expiresAt = null) => {
    try {
      const authData = authCache.get('auth');
      
      if (!authData) {
        return false;
      }
      
      authData.token = newToken;
      
      if (expiresAt) {
        authData.expiresAt = expiresAt;
      }
      
      return authCache.set('auth', authData);
    } catch (error) {
      console.error('Failed to update token:', error);
      return false;
    }
  },

  // Get time until token expires
  getTimeUntilExpiry: () => {
    try {
      const authData = authCache.get('auth');
      
      if (!authData || !authData.expiresAt) {
        return 0;
      }
      
      const timeLeft = authData.expiresAt - Date.now();
      return Math.max(0, timeLeft);
    } catch (error) {
      console.error('Failed to get time until expiry:', error);
      return 0;
    }
  },

  // Check if token expires soon (within specified minutes)
  isTokenExpiringSoon: (minutesThreshold = 5) => {
    try {
      const timeLeft = authUtils.getTimeUntilExpiry();
      const thresholdMs = minutesThreshold * 60 * 1000;
      
      return timeLeft > 0 && timeLeft <= thresholdMs;
    } catch (error) {
      console.error('Failed to check if token expiring soon:', error);
      return false;
    }
  }
};