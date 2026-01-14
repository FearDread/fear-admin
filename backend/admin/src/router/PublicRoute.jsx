// contexts/routes/PublicRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserLoading } from '../features/user/slice';

/**
 * PublicRoute Component
 * For routes that should be accessible to everyone
 * Can optionally redirect authenticated users away from auth pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.restricted - If true, authenticated users will be redirected
 * @param {string} props.redirectTo - Path to redirect authenticated users (default: /)
 */
export const PublicRoute = ({ 
  children, 
  restricted = false,
  redirectTo = '/' 
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);

  // Don't redirect while checking authentication
  if (loading) {
    return children;
  }

  // If route is restricted (like login/register) and user is authenticated
  if (restricted && isAuthenticated) {
    // Get the intended destination from location state, or use default
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render the route
  return children;
};

export default PublicRoute;