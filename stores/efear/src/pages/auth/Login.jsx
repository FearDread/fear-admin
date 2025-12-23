// pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { dispatch } from "../../features/store";
import {
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  selectLoginStatus,
  setRememberMe,
  selectRememberMe,
  clearError,
} from '../../features/user/slice';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const loginStatus = useSelector(selectLoginStatus);
  const rememberMe = useSelector(selectRememberMe);

  // Local form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localRememberMe, setLocalRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect path after login (from location state or default to home)
  const from = location.state?.from?.pathname !== '/login' || '/account/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle remember me toggle
  const handleRememberMeChange = (e) => {
    setLocalRememberMe(e.target.checked);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Dispatch login action
    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
      rememberMe: localRememberMe,
    }));

    if (result.success) {
      // Store remember me preference
      dispatch(setRememberMe(localRememberMe));
      
      // Navigation is handled by useEffect when isAuthenticated changes
      console.log('Login successful');
      navigate('/account/dashboard', { replace: true });
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await dispatch(loginWithGoogle());
      if (loginWithGoogle.fulfilled.match(result)) {
        console.log('Google login successful');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    try {
      const result = await dispatch(loginWithFacebook());
      if (loginWithFacebook.fulfilled.match(result)) {
        console.log('Facebook login successful');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
            <div className="row row-cols-1 row-cols-xl-2">
              <div className="col mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="border p-4 rounded">
                      <div className="text-center">
                        <h3>Sign in</h3>
                        <p>
                          Don't have an account yet?{' '}
                          <Link to="/register">Sign up here</Link>
                        </p>
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                          <i className='bx bx-error-circle me-2'></i>
                          {error}
                          <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => dispatch(clearError())}
                          ></button>
                        </div>
                      )}

                      {/* Success message if coming from registration */}
                      {location.state?.message && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                          <i className='bx bx-check-circle me-2'></i>
                          {location.state.message}
                          <button 
                            type="button" 
                            className="btn-close"
                          ></button>
                        </div>
                      )}

                      {/* Social Login Buttons */}
                      <div className="d-grid">
                        <button 
                          className="btn my-4 shadow-sm btn-light" 
                          onClick={handleGoogleLogin}
                          disabled={loading}
                        >
                          <span className="d-flex justify-content-center align-items-center">
                            <img 
                              className="me-2" 
                              src="assets/images/icons/search.svg" 
                              width="16" 
                              alt="Google" 
                            />
                            <span>Sign in with Google</span>
                          </span>
                        </button>
                        <button 
                          className="btn btn-light"
                          onClick={handleFacebookLogin}
                          disabled={loading}
                        >
                          <i className="bx bxl-facebook"></i>
                          Sign in with Facebook
                        </button>
                      </div>

                      <div className="login-separater text-center mb-4">
                        <span>OR SIGN IN WITH EMAIL</span>
                        <hr />
                      </div>

                      {/* Login Form */}
                      <div className="form-body">
                        <form className="row g-3" onSubmit={handleSubmit}>
                          {/* Email Field */}
                          <div className="col-12">
                            <label htmlFor="inputEmailAddress" className="form-label">
                              Email Address
                            </label>
                            <input 
                              type="email" 
                              className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                              id="inputEmailAddress" 
                              name="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={loading}
                              autoComplete="email"
                            />
                            {validationErrors.email && (
                              <div className="invalid-feedback">
                                {validationErrors.email}
                              </div>
                            )}
                          </div>

                          {/* Password Field */}
                          <div className="col-12">
                            <label htmlFor="inputChoosePassword" className="form-label">
                              Enter Password
                            </label>
                            <div className="input-group" id="show_hide_password">
                              <input 
                                type={showPassword ? "text" : "password"}
                                className={`form-control border-end-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                id="inputChoosePassword"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="current-password"
                              />
                              <button 
                                type="button"
                                className="input-group-text bg-transparent"
                                onClick={togglePasswordVisibility}
                                disabled={loading}
                              >
                                <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                              </button>
                              {validationErrors.password && (
                                <div className="invalid-feedback d-block">
                                  {validationErrors.password}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Remember Me and Forgot Password */}
                          <div className="col-md-6">
                            <div className="form-check form-switch">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="flexSwitchCheckChecked"
                                checked={localRememberMe}
                                onChange={handleRememberMeChange}
                                disabled={loading}
                              />
                              <label 
                                className="form-check-label" 
                                htmlFor="flexSwitchCheckChecked"
                              >
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 text-end">
                            <Link to="/forgot-password">Forgot Password?</Link>
                          </div>

                          {/* Submit Button */}
                          <div className="col-12">
                            <div className="d-grid">
                              <button 
                                type="submit" 
                                className="btn btn-light"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <span 
                                      className="spinner-border spinner-border-sm me-2" 
                                      role="status" 
                                      aria-hidden="true"
                                    ></span>
                                    Signing in...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bxs-lock-open"></i>
                                    Sign in
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* Additional Links */}
                      <div className="text-center mt-4">
                        <p className="mb-0">
                          <small className="text-muted">
                            By signing in, you agree to our{' '}
                            <Link to="/terms">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy">Privacy Policy</Link>
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;