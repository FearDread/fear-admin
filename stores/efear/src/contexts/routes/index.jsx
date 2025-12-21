// contexts/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserLoading } from '../../features/users/userSlice';

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


// contexts/routes/PublicRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserLoading } from '../../features/users/userSlice';

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


// contexts/routes/RoleRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectUserRole,
  selectUserLoading 
} from '../../features/users/userSlice';

/**
 * RoleRoute Component
 * Protects routes based on user roles
 * More specific than PrivateRoute for role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array<string>} props.allowedRoles - Roles that can access this route
 * @param {string} props.redirectTo - Where to redirect if access denied
 */
export const RoleRoute = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/unauthorized'
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const loading = useSelector(selectUserLoading);

  // Show loading while checking
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role access
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};


// contexts/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/users/userSlice';

/**
 * AdminRoute Component
 * Shortcut for admin-only routes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


// contexts/routes/GuestRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/users/userSlice';

/**
 * GuestRoute Component
 * For routes that should ONLY be accessible to non-authenticated users
 * Example: Login, Register pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.redirectTo - Where to send authenticated users
 */
export const GuestRoute = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};


// contexts/routes/index.js
/**
 * Export all route guards from a single file
 */
export { default as PrivateRoute } from './PrivateRoute';
export { default as PublicRoute } from './PublicRoute';
export { RoleRoute } from './RoleRoute';
export { AdminRoute } from './AdminRoute';
export { GuestRoute } from './GuestRoute';


// Example Unauthorized Page
// pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className='bx bx-lock-alt display-1 text-danger'></i>
          <h1 className="display-4 fw-bold mt-3">Access Denied</h1>
          <p className="fs-5 text-muted">
            You don't have permission to access this page.
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-secondary me-2"
            >
              Go Back
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-primary"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;