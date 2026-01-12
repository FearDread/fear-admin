import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import AuthLayout from "./layouts/Auth";
import AdminLayout from "./layouts/Admin";
import routes from "./router/routes";
import "./assets/css/App.css";


const isLoggedIn = false;
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

const ProtectedRoute = ({ children }) => {
  //const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  //const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const AppNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const { isLoggedIn } = useSelector((state) => state.auth);

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

function App() {
  return (
    <BrowserRouter>
      <AppNavigator />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Auth routes - redirect to dashboard if already logged in */}
                    <Route path="/auth" exact element={<AuthLayout />}>
            {routes.auth.map((route) => (
              <Route key={route.path} path={route.path} element={<AuthRoute>{route.element}</AuthRoute>} />
            ))}
          </Route>

          {/* Protected admin routes */}
          <Route path="/admin" exact element={<AdminLayout />}>
            {routes.admin.map((route) => (
              <Route key={route.path} path={route.path} element={<ProtectedRoute>{route.element}</ProtectedRoute>} />
            ))}
          </Route>
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