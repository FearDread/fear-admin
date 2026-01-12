import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";

/**
 * Loading Fallback Component
 */
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading...</p>
    </div>
  </div>
);

/**
 * 404 Not Found Page
 */
const NotFound = () => (
  <div className="container">
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  </div>
);

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Auth Route Component
 * Redirects to dashboard if user is already authenticated
 */
const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * App Navigation Logic Component
 * Handles automatic redirects based on auth state
 */
const AppNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Auth Status:", isLoggedIn);
    console.log("Current Path:", location.pathname);

    // If user just logged in and is on auth page, redirect to dashboard
    if (isLoggedIn && location.pathname.startsWith('/auth')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AppNavigator />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route 
            path="/auth/*" 
            element={
              <AuthRoute>
                <AuthLayout />
              </AuthRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<NotFound />} />
          
          {/* 404 Not Found - catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;