import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { User } from "../features/user/slice";
import BannerSub from "../components/Banner/BannerSub";
import { store } from "../features/store";

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
  const [formData, setFormData] = useState({ email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: userState, success: loginSuccess, loading, error } = useSelector(state => state.user);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = new FormData();
    const formErrors = validateForm(formData.email, formData.password);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    loginData.set("email", formData.email.trim());
    loginData.set("password", formData.password);
      
    dispatch(User.login(loginData));
  
  };
  /*
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const loginData = new FormData();
    const formErrors = validateForm(formData.email, formData.password);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    loginData.set("email", formData.email.trim());
    loginData.set("password", formData.password);
      
    dispatch(User.login(loginData));
  
  }, [formData, dispatch]);
  */
/*
  useEffect(() => {
    if (userState?.token) {
      store.local.set("auth", userState);
      navigate("/profile", { replace: true });
    }
  }, [userState, navigate]);
  
  // Check if user is already logged in
  useEffect(() => {
    const existingAuth = store.local.get("auth");
    if (userState?.token) {
      navigate("/profile", { replace: true });
    }
  }, [userState]);
 */
    useEffect(() => {
    if (loginSuccess) {
      store.local.set("auth", userState);
      navigate("/profile", { replace: true });
    }
    if (error) {
      setErrors({ general: error.message || "Login failed. Please try again." });
    }
  }, []);
  
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