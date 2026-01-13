import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserError,
  selectUserSuccess,
  selectUserLoading,
  selectCurrentUser,
  clearError,
  registerUser,
  loginWithGoogle,
  loginWithFacebook,
} from "../../features/user/slice";
import Spotlight from "../../components/animated/SpotLight";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  const currentUser = useSelector(selectCurrentUser);

  // Local form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    password: '',
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

    if (!formData.fullName.trim()) {
      errors.fullName = 'First name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'First name must be at least 2 characters';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak. Use a stronger password';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms & Conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log('invalid form =', formData);
      return;
    }

    const registrationData = {
      displayName: formData.fullName.trim(),
      firstName: formData.fullName.split(' ')[0].trim(),
      lastName: formData.fullName.split(' ')[1].trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };
    console.log('form =', registrationData);
    const result = await dispatch(registerUser(registrationData));

    if (result.success) {
      console.log('Registration successful', result);
      navigate('/admin/dashboard', {
        state: {
          user: result.user
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  return (
    <>
      <Spotlight />
      <div className="container">
        <div className="row">

          <div className="card card-authentication1 mx-auto my-4">
            <div className="card-body">
              <div className="card-content p-2">
                <div className="text-center fear-logo">
                  <img src="/assets/images/fear-logo/3.png" alt="FEAR" />
                </div>
                <div className="card-title text-uppercase text-center py-3"></div>
                <div className="form-body">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                      <label htmlFor="exampleInputName" className="sr-only">Name</label>
                      <div className="position-relative has-icon-right">
                        <input
                          type="text"
                          className={`form-control input-shadow ${validationErrors.fullName ? 'is-invalid' : ''}`}
                          id="inputFullName"
                          name="fullName"
                          placeholder="Enter Your Name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={loading}
                          autoComplete="given-name"
                        />
                        <div className="form-control-position">
                          <i className="icon-user"></i>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmailId" className="sr-only">Email ID</label>
                      <div className="position-relative has-icon-right">

                        <input
                          type="email"
                          className={`form-control input-shadow ${validationErrors.email ? 'is-invalid' : ''}`}
                          id="inputEmailAddress"
                          name="email"
                          placeholder="Enter Your Email ID"
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
                        <div className="form-control-position">
                          <i className="icon-envelope-open"></i>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword" className="sr-only">Password</label>
                      <div className="position-relative has-icon-right">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control input-shadow ${validationErrors.password ? 'is-invalid' : ''}`}
                          id="inputChoosePassword"
                          name="password"
                          placeholder="Choose a strong Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={loading}
                          autoComplete="password"
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
                        <div className="form-control-position">
                          <i className="icon-lock"></i>
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
                    </div>
                    <div className="form-group">
                      <div className="icheck-material-white">
                        <input
                          className={`form-check-input`}
                          type="checkbox"
                          id="user-checkbox"
                          name="agreeToTerms"
                          defaultChecked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="user-checkbox">
                          I agree to {' '}

                          <Link to="/terms" target="_blank">Terms & Conditions</Link>
                          <span className="text-danger"> *</span>
                        </label>
                        {validationErrors.agreeToTerms && (
                          <div className="invalid-feedback d-block">
                            {validationErrors.agreeToTerms}
                          </div>
                        )}

                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-light btn-block waves-effect waves-light"
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
                    <div className="text-center mt-3">Sign Up With</div>
                    <div className="form-row mt-4">
                      <div className="form-group mb-0 col-6">
                        <button type="button" onClick={handleFacebookSignup} className="btn btn-light btn-block"><i className="fa fa-facebook-square"></i> Facebook</button>
                      </div>
                      <div className="form-group mb-0 col-6 text-right">
                        <button type="button" onClick={handleGoogleSignup} className="btn btn-light btn-block"><i className="fa fa-google-square"></i> Google</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="card-footer text-center py-3">
              <p className="text-warning mb-0">Already have an account? <Link to="/auth/login"> Sign In here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
