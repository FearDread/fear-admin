import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import AuthLayout from "./layouts/Auth";
import AdminLayout from "./layouts/Admin";
import routes from "./router/Routes";
import {
  selectIsAuthenticated,
  selectCurrentUser
} from "./features/user/slice";
import { PrivateRoute } from "./router/PrivateRoute";
import { PublicRoute } from "./router/PublicRoute";

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

const AppNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    console.log("Auth Status:", isAuthenticated);
    console.log("Current Path:", location.pathname);

  }, [isAuthenticated, location.pathname]);

  return null;
};

export const App = () => {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
    
      <AppNavigator />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to={(isAuthenticated) ? "/admin/dashboard" : "/auth/login"} replace />} />
          
          {/* Auth routes - redirect to dashboard if already logged in */}
           <Route path="/auth" exact element={<AuthLayout />}>
            {routes.auth.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Protected admin routes */}
          <Route path="/admin" exact element={<AdminLayout />} >
            {routes.admin.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}
          </Route>

          
          {/* 404 Not Found - catch all unmatched routes */}
        { <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />}
        </Routes>
      </Suspense>
      </>
  );
}

export default App;