import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  setRememberMe,
  selectRememberMe,
  clearError,
  setCurrentUser,
  setIsAuthenticated
} from '../../features/user/slice';
import Spotlight from "../../components/animated/SpotLight";


export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
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
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
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
    if (!validateForm()) return;

    // Dispatch login action
    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
      rememberMe: localRememberMe,
    }));

    if (result.success) {
      dispatch(setRememberMe(localRememberMe));
      dispatch(setCurrentUser(result.user));
      dispatch(setIsAuthenticated(true));

      console.log('Login successful');
      //navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <>
      <Spotlight />

      <div className="card card-authentication1 mx-auto my-5">
        <div className="card-body">
          <div className="card-content p-2">
            <div className="text-center fear-logo">
              <img src="/assets/images/fear-logo/3.png" alt="FEAR" />
            </div>
            <div className="card-title text-uppercase text-center py-3"></div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputUsername" className="sr-only">Username</label>
                <div className="position-relative has-icon-right">
                  <input
                    type="email"
                    className={`form-control input-shadow ${validationErrors.email ? 'is-invalid' : ''}`}
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
                  <div className="form-control-position">
                    <i className="icon-user"></i>
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
                  <div className="form-control-position">
                    <i className="icon-lock"></i>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <div className="icheck-material-white">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="user-checkbox"
                      defaultChecked={localRememberMe}
                      onChange={handleRememberMeChange}
                      disabled={loading}
                    />
                    <label htmlFor="user-checkbox">Remember me</label>
                  </div>
                </div>
                <div className="form-group col-6 text-right">
                  <Link to="/reset-password">Reset Password</Link>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-light btn-block"
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
              <div className="text-center mt-3">Sign In With</div>
              <div className="form-row mt-4">
                <div className="form-group mb-0 col-6">
                  <button type="button" className="btn btn-light btn-block"><i className="fa fa-facebook-square"></i> Facebook</button>
                </div>
                <div className="form-group mb-0 col-6 text-right">

                  <button type="button" className="btn btn-light btn-block"><i className="fa fa-twitter-square"></i> Twitter</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card-footer text-center py-3">
          <p className="text-warning mb-0">Do not have an account? <Link to="/auth/register"> Sign Up here</Link></p>
        </div>
      </div>

    </>
  );
}

export default Login;
