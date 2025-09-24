// auth/authCache.js
import { CacheFactory } from '../path/to/your/CacheFactory';

// Create a dedicated auth cache instance
export const authCache = CacheFactory({
  type: 'local', // Use localStorage for persistent auth
  prefix: 'auth_',
  enableLogging: process.env.NODE_ENV === 'development',
  fallbackToMemory: true
});

// Auth utility functions
export const authUtils = {
  // Save authentication data
  saveAuth: async (authData) => {
    try {
      await authCache.set('token', authData.token);
      await authCache.set('user', authData.user);
      await authCache.set('refreshToken', authData.refreshToken);
      await authCache.set('expiresAt', authData.expiresAt || Date.now() + (24 * 60 * 60 * 1000)); // 24 hours default
      return true;
    } catch (error) {
      console.error('Failed to save auth data:', error);
      return false;
    }
  },

  // Get authentication data
  getAuth: async () => {
    try {
      const [token, user, refreshToken, expiresAt] = await Promise.all([
        authCache.get('token'),
        authCache.get('user'),
        authCache.get('refreshToken'),
        authCache.get('expiresAt')
      ]);

      if (!token || !user) return null;

      return {
        token,
        user,
        refreshToken,
        expiresAt
      };
    } catch (error) {
      console.error('Failed to get auth data:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: async () => {
    try {
      const expiresAt = await authCache.get('expiresAt');
      if (!expiresAt) return true;
      return Date.now() > expiresAt;
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true;
    }
  },

  // Clear all auth data
  clearAuth: async () => {
    try {
      await authCache.bulk.remove(['token', 'user', 'refreshToken', 'expiresAt']);
      return true;
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const authData = await authUtils.getAuth();
      if (!authData || !authData.token) return false;
      
      const isExpired = await authUtils.isTokenExpired();
      if (isExpired) {
        await authUtils.clearAuth();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  }
};

// components/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../auth/authCache';
import { setUser } from '../store/userSlice'; // Adjust path as needed

export const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual login API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const authData = await response.json();
      
      // Save auth data using CacheFactory
      const saved = await authUtils.saveAuth({
        token: authData.token,
        user: authData.user,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt
      });

      if (saved) {
        // Update Redux store
        dispatch(setUser({ 
          data: { 
            user: authData.user 
          } 
        }));
        
        // Redirect to dashboard or intended page
        navigate('/dashboard', { replace: true });
      } else {
        setError('Failed to save authentication data');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authUtils.clearAuth();
    dispatch(setUser({ data: { user: null } }));
    navigate('/login', { replace: true });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// components/PrivateRoutes.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authUtils } from '../auth/authCache';
import { setUser } from '../store/userSlice';

export const PrivateRoutes = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userState = useSelector(state => state.user.data.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authUtils.isAuthenticated();
        
        if (authenticated && !userState) {
          // Load user data from cache if not in Redux store
          const authData = await authUtils.getAuth();
          if (authData?.user) {
            dispatch(setUser({ 
              data: { 
                user: authData.user 
              } 
            }));
          }
        }
        
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, userState]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// hooks/useAuth.js - Custom hook for auth operations
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authUtils } from '../auth/authCache';
import { setUser } from '../store/userSlice';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user.data.user);

  // Initialize auth state from cache
  useEffect(() => {
    const initAuth = async () => {
      if (!userState) {
        const authData = await authUtils.getAuth();
        if (authData?.user) {
          dispatch(setUser({ 
            data: { 
              user: authData.user 
            } 
          }));
        }
      }
    };

    initAuth();
  }, [dispatch, userState]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Your login logic here
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const authData = await response.json();
      
      await authUtils.saveAuth(authData);
      dispatch(setUser({ data: { user: authData.user } }));
      
      return { success: true, data: authData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authUtils.clearAuth();
      dispatch(setUser({ data: { user: null } }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = async () => {
    return await authUtils.isAuthenticated();
  };

  return {
    user: userState,
    loading,
    login,
    logout,
    isAuthenticated
  };
};