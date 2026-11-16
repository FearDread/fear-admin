import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectUserLoading, clearError, registerUser, loginWithGoogle, loginWithFacebook } from "../../features/user/slice";
import AuthBackground from "../../components/animated/AuthBackground";
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, MIN_PASSWORD_SCORE, calculatePasswordStrength } from "../../utils/password";


// "Mary Jane Watson" -> first "Mary", last "Jane Watson". A single name gives an empty last name.
const splitName = (fullName) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return { firstName: parts[0] || '', lastName: parts.slice(1).join(' '), displayName: parts.join(' ') };
};

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectUserLoading);
    // const error = useSelector(selectUserError);
    // const success = useSelector(selectUserSuccess);
    // const currentUser = useSelector(selectCurrentUser);

    // Local form state: the keys match the inputs, and only some of them are sent to the API
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

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
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        const { displayName } = splitName(formData.fullName);
        const email = formData.email.trim();

        if (!displayName) {
            errors.fullName = 'Name is required';
        } else if (displayName.length < 2) {
            errors.fullName = 'Name must be at least 2 characters';
        }

        if (!email) {
            errors.email = 'Email is required';
        } else if (!EMAIL_PATTERN.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
            errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        } else if (passwordStrength.score < MIN_PASSWORD_SCORE) {
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
        if (!validateForm()) return;

        // Only what the API's register endpoint reads. agreeToTerms stays client-side, and no role is
        // sent (the server assigns it).
        const { firstName, lastName, displayName } = splitName(formData.fullName);
        const registrationData = {
            displayName,
            firstName,
            lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
        };

        // dispatch() resolves to the action, not to the API response, so check it with fulfilled.match
        const result = await dispatch(registerUser(registrationData));

        if (registerUser.fulfilled.match(result)) {
            navigate('/', { replace: true });
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

    return (
        <>
            <AuthBackground />
            <div className="container">
                <div className="row">

                    <div className="card card-authentication1 mx-auto my-4" style={{ top: '100px' }} >
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
                                                    autoComplete="name"
                                                />
                                                {validationErrors.fullName && (
                                                    <div className="invalid-feedback">
                                                        {validationErrors.fullName}
                                                    </div>
                                                )}
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
                                                    autoComplete="new-password"
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
                                                    checked={formData.agreeToTerms}
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