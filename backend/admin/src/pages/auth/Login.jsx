import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectIsAuthenticated, selectUserLoading, setRememberMe, clearError } from '../../features/user/slice';
import AuthBackground from "../../components/animated/AuthBackground";
import { EMAIL_PATTERN } from "../../utils/password";


export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redux selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectUserLoading);
    //const error = useSelector(selectUserError);
    //const rememberMe = useSelector(selectRememberMe);

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

    // Validate form. The password is only checked for presence: its rules are enforced when it is
    // created, and a length check here would lock out accounts that predate them.
    const validateForm = () => {
        const errors = {};
        const email = formData.email.trim();

        if (!email) {
            errors.email = 'Email is required';
        } else if (!EMAIL_PATTERN.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // dispatch() resolves to the action, not to the API response, so check it with fulfilled.match
        const result = await dispatch(loginUser({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            rememberMe: localRememberMe,
        }));

        if (loginUser.fulfilled.match(result)) {
            dispatch(setRememberMe(localRememberMe));
        }
    };

    return (
        <>
            <AuthBackground />
            <div className="card card-authentication1 mx-auto my-5" style={{ top: '100px' }} >
                <div className="card-body">
                    <div className="card-content p-2">
                        <div className="text-center fear-logo">
                            <img src="/assets/images/fear-logo/3.png" alt="FEAR" />
                        </div>
                        <div className="card-title text-uppercase text-center py-3"></div>

                        <form onSubmit={handleSubmit} noValidate>
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

                                    {validationErrors.password && (
                                        <div className="invalid-feedback d-block">
                                            {validationErrors.password}
                                        </div>
                                    )}
                                    <div className="form-control-position">
      
                                            <i
                                               onClick={togglePasswordVisibility}
                                               disabled={loading}
                                               className={`icon-eye bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>


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
                                            checked={localRememberMe}
                                            onChange={handleRememberMeChange}
                                            disabled={loading}
                                        />
                                        <label htmlFor="user-checkbox">Remember me</label>
                                    </div>
                                </div>
                                <div className="form-group col-6 text-right">
                                    <Link to="/auth/reset-password">Reset Password</Link>
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