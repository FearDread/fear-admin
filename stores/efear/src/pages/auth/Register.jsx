// pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  register,
  loginWithGoogle,
  loginWithFacebook,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  clearError,
} from '../../features/user/slice';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // Local form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'United States',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  // Country list
  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'India',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Japan',
    'China',
    'Brazil',
    'Mexico',
    'South Africa',
    'Dubai',
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [formData.password]);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'danger' },
      { score: 2, label: 'Weak', color: 'warning' },
      { score: 3, label: 'Fair', color: 'info' },
      { score: 4, label: 'Good', color: 'primary' },
      { score: 5, label: 'Strong', color: 'success' },
    ];

    return strengths[score];
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak. Use a stronger password';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Country validation
    if (!formData.country) {
      errors.country = 'Please select a country';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms & Conditions';
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

    // Prepare registration data
    const registrationData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      country: formData.country,
    };

    // Dispatch register action
    const result = await dispatch(register(registrationData));

    if (register.fulfilled.match(result)) {
      // Registration successful
      console.log('Registration successful');
      
      // Redirect to login with success message
      navigate('/login', {
        state: {
          message: 'Registration successful! Please sign in with your credentials.',
        },
      });
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      const result = await dispatch(loginWithGoogle());
      if (loginWithGoogle.fulfilled.match(result)) {
        console.log('Google signup successful');
      }
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  // Handle Facebook signup
  const handleFacebookSignup = async () => {
    try {
      const result = await dispatch(loginWithFacebook());
      if (loginWithFacebook.fulfilled.match(result)) {
        console.log('Facebook signup successful');
      }
    } catch (error) {
      console.error('Facebook signup error:', error);
    }
  };

  return (
    <>
      <section className="py-0 py-lg-5">
        <div className="container">
          <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
            <div className="row row-cols-1 row-cols-lg-1 row-cols-xl-2">
              <div className="col mx-auto">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="border p-4 rounded">
                      <div className="text-center">
                        <h3>Sign Up</h3>
                        <p>
                          Already have an account?{' '}
                          <Link to="/login">Sign in here</Link>
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

                      {/* Social Signup Buttons */}
                      <div className="d-grid">
                        <button 
                          className="btn my-4 shadow-sm btn-light"
                          onClick={handleGoogleSignup}
                          disabled={loading}
                        >
                          <span className="d-flex justify-content-center align-items-center">
                            <img 
                              className="me-2" 
                              src="assets/images/icons/search.svg" 
                              width="16" 
                              alt="Google" 
                            />
                            <span>Sign Up with Google</span>
                          </span>
                        </button>
                        <button 
                          className="btn btn-light"
                          onClick={handleFacebookSignup}
                          disabled={loading}
                        >
                          <i className="bx bxl-facebook"></i>
                          Sign Up with Facebook
                        </button>
                      </div>

                      <div className="login-separater text-center mb-4">
                        <span>OR SIGN UP WITH EMAIL</span>
                        <hr />
                      </div>

                      {/* Registration Form */}
                      <div className="form-body">
                        <form className="row g-3" onSubmit={handleSubmit} noValidate>
                          {/* First Name */}
                          <div className="col-sm-6">
                            <label htmlFor="inputFirstName" className="form-label">
                              First Name <span className="text-danger">*</span>
                            </label>
                            <input 
                              type="text" 
                              className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                              id="inputFirstName"
                              name="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={loading}
                              autoComplete="given-name"
                            />
                            {validationErrors.firstName && (
                              <div className="invalid-feedback">
                                {validationErrors.firstName}
                              </div>
                            )}
                          </div>

                          {/* Last Name */}
                          <div className="col-sm-6">
                            <label htmlFor="inputLastName" className="form-label">
                              Last Name <span className="text-danger">*</span>
                            </label>
                            <input 
                              type="text" 
                              className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                              id="inputLastName"
                              name="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={loading}
                              autoComplete="family-name"
                            />
                            {validationErrors.lastName && (
                              <div className="invalid-feedback">
                                {validationErrors.lastName}
                              </div>
                            )}
                          </div>

                          {/* Email */}
                          <div className="col-12">
                            <label htmlFor="inputEmailAddress" className="form-label">
                              Email Address <span className="text-danger">*</span>
                            </label>
                            <input 
                              type="email" 
                              className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                              id="inputEmailAddress"
                              name="email"
                              placeholder="example@user.com"
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

                          {/* Password */}
                          <div className="col-12">
                            <label htmlFor="inputChoosePassword" className="form-label">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input 
                                type={showPassword ? "text" : "password"}
                                className={`form-control border-end-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                id="inputChoosePassword"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                              />
                              <button 
                                type="button"
                                className="input-group-text bg-transparent"
                                onClick={() => togglePasswordVisibility('password')}
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
                            
                            {/* Password Strength Indicator */}
                            {formData.password && passwordStrength.label && (
                              <div className="mt-2">
                                <div className="progress" style={{ height: '5px' }}>
                                  <div 
                                    className={`progress-bar bg-${passwordStrength.color}`}
                                    role="progressbar"
                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    aria-valuenow={passwordStrength.score}
                                    aria-valuemin="0"
                                    aria-valuemax="5"
                                  ></div>
                                </div>
                                <small className={`text-${passwordStrength.color}`}>
                                  Password Strength: {passwordStrength.label}
                                </small>
                              </div>
                            )}
                            <small className="text-muted">
                              Use 8+ characters with a mix of letters, numbers & symbols
                            </small>
                          </div>

                          {/* Confirm Password */}
                          <div className="col-12">
                            <label htmlFor="inputConfirmPassword" className="form-label">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input 
                                type={showConfirmPassword ? "text" : "password"}
                                className={`form-control border-end-0 ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                id="inputConfirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                              />
                              <button 
                                type="button"
                                className="input-group-text bg-transparent"
                                onClick={() => togglePasswordVisibility('confirm')}
                                disabled={loading}
                              >
                                <i className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'}`}></i>
                              </button>
                              {validationErrors.confirmPassword && (
                                <div className="invalid-feedback d-block">
                                  {validationErrors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Country */}
                          <div className="col-12">
                            <label htmlFor="inputSelectCountry" className="form-label">
                              Country <span className="text-danger">*</span>
                            </label>
                            <select 
                              className={`form-select ${validationErrors.country ? 'is-invalid' : ''}`}
                              id="inputSelectCountry"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              disabled={loading}
                            >
                              <option value="">Select Country</option>
                              {countries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                            {validationErrors.country && (
                              <div className="invalid-feedback">
                                {validationErrors.country}
                              </div>
                            )}
                          </div>

                          {/* Terms and Conditions */}
                          <div className="col-12">
                            <div className="form-check form-switch">
                              <input 
                                className={`form-check-input ${validationErrors.agreeToTerms ? 'is-invalid' : ''}`}
                                type="checkbox"
                                id="flexSwitchCheckChecked"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                disabled={loading}
                              />
                              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                I read and agree to{' '}
                                <Link to="/terms" target="_blank">Terms & Conditions</Link>
                                {' '}and{' '}
                                <Link to="/privacy" target="_blank">Privacy Policy</Link>
                                <span className="text-danger"> *</span>
                              </label>
                              {validationErrors.agreeToTerms && (
                                <div className="invalid-feedback d-block">
                                  {validationErrors.agreeToTerms}
                                </div>
                              )}
                            </div>
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
                                    Creating Account...
                                  </>
                                ) : (
                                  <>
                                    <i className='bx bx-user'></i>
                                    Sign up
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* Additional Info */}
                      <div className="text-center mt-4">
                        <p className="mb-0">
                          <small className="text-muted">
                            By signing up, you agree to receive marketing emails and updates.
                            You can unsubscribe at any time.
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

export default Register;