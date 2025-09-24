// components/Login.jsx - Refactored Login Component
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import BannerSub from "../components/Banner/BannerSub";
import { User } from "../features/user/slice";
import { authUtils } from "../features/user/auth";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="spinner-border spinner-border-sm me-2" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

// Form validation helper
const validateForm = (email, password) => {
  const errors = {};
  
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }
  
  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  
  return errors;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  const { success: loginSuccess, loading, error } = useSelector(state => state.user.data);
  const userState = useSelector(state => state.user.data);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        // Use synchronous auth check
        const isAuth = authUtils.isAuthenticated();
        if (isAuth) {
          const authData = authUtils.getAuth();
          if (authData?.user) {
            // Update Redux store with cached user data if needed
            // dispatch(User.setUser(authData));
            navigate("/profile", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setAuthCheckComplete(true);
      }
    };

    checkExistingAuth();
  }, [dispatch, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Clear general error when user interacts with form
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ""
      }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData.email, formData.password);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const loginData = new FormData();
      loginData.set("email", formData.email.trim());
      loginData.set("password", formData.password);
        
      // Dispatch login action
      const result = await dispatch(User.login(loginData));
      
      // Handle the result based on your Redux setup
      if (result.type.endsWith('/fulfilled')) {
        // Login successful - data should be in result.payload
        const authData = result.payload;
        
        // Save to cache synchronously
        const saved = authUtils.saveAuth({
          token: authData.token,
          user: authData.user,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt
        });

        if (saved) {
          console.log('Auth data saved successfully');
          navigate("/profile", { replace: true });
        } else {
          setErrors({ general: "Failed to save authentication data" });
        }
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
   
  // Handle Redux state changes
  useEffect(() => {
    if (loginSuccess) {
      // This effect will run when Redux state indicates success
      try {
        const saved = authUtils.saveAuth({
          token: userState.token,
          user: userState.user,
          refreshToken: userState.refreshToken,
          expiresAt: userState.expiresAt
        });

        if (saved) {
          console.log('Auth data cached successfully');
          navigate("/profile", { replace: true });
        } else {
          setErrors({ general: "Failed to save authentication data" });
        }
      } catch (error) {
        console.error('Error saving auth data:', error);
        setErrors({ general: "Failed to save authentication data" });
      }
    }

    if (error) {
      setErrors({ 
        general: typeof error === 'string' ? error : (error?.message || "Login failed. Please try again.")
      });
      setIsSubmitting(false);
    }
  }, [loginSuccess, userState, error, navigate]);

  // Show loading while checking existing auth
  if (!authCheckComplete) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <LoadingSpinner />
        <span className="ms-2">Checking authentication...</span>
      </div>
    );
  }
  
  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="cart-page-div pt-5 d-inline-block w-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="com-div-md">
                        <h2 className="text-center mb-4">Welcome Back</h2>
                        <p className="text-center text-muted mb-4">
                          Please sign in to your account
                        </p>
                        
                        {/* General Error Message */}
                        {errors.general && (
                          <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {errors.general}
                          </div>
                        )}
                        
                        <div className="login-modal-pn">
                          <div className="cm-select-login">
                            {/* Email Field */}
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">
                                Email Address *
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                autoComplete="email"
                                disabled={isSubmitting || loading}
                              />
                              {errors.email && (
                                <div className="invalid-feedback">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                            
                            {/* Password Field */}
                            <div className="mb-3">
                              <label htmlFor="password" className="form-label">
                                Password *
                              </label>
                              <input
                                id="password"
                                name="password"
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                autoComplete="current-password"
                                disabled={isSubmitting || loading}
                              />
                              {errors.password && (
                                <div className="invalid-feedback">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="btn continue-bn w-100 mt-3"
                            disabled={isSubmitting || loading}
                          >
                            {(isSubmitting || loading) && <LoadingSpinner />}
                            <i className="fas fa-lock me-2"></i>
                            {(isSubmitting || loading) ? 'Signing In...' : 'Sign In'}
                          </button>
                        </div>
                        
                        {/* Additional Links */}
                        <div className="text-center mt-4">
                          <Link 
                            to="/forgot-password" 
                            className="text-decoration-none"
                          >
                            Lost Password?
                          </Link>
                        </div>
                        
                        <div className="text-center mt-3">
                          <span className="text-muted">Don't have an account? </span>
                          <Link 
                            to="/register" 
                            className="text-decoration-none fw-bold"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;