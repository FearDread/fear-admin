
// components/PrivateRoutes.jsx - Updated PrivateRoutes component
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authUtils } from '../features/user/auth';
import { User } from '../features/user/slice';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <span className="ms-3">Verifying authentication...</span>
  </div>
);

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
            dispatch(User.setUser(authData));
          }
        }
        
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        // Clear any corrupted auth data
        await authUtils.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, userState]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

