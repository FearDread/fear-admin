import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserLoading } from '../features/user/slice';

/**
 * Loading component for auth check
 */
const AuthLoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Checking authentication...</span>
      </div>
      <p className="mt-3 text-muted">Verifying credentials...</p>
    </div>
  </div>
);

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: /login)
 * @param {Array<string>} props.allowedRoles - Array of roles that can access this route
 */
const PrivateRoute = ({ 
  children, 
  redirectTo = '/login',
  allowedRoles = null 
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const currentUser = useSelector(state => state.users.currentUser);

  // Show loading while checking authentication
  if (loading) {
    return <AuthLoadingFallback />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role - redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated (and has required role if specified)
  return children;
};

export default PrivateRoute;


