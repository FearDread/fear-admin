import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthBackground from "../../components/animated/AuthBackground";
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, MIN_PASSWORD_SCORE, calculatePasswordStrength } from "../../utils/password";

const API_BASE = '/fear/api/password';
const GENERIC_ERROR = 'Something went wrong. Please try again.';

// Resolves to { ok, status, message, data } and never throws, so callers only branch on the result.
const request = async (path, { method = 'GET', body } = {}) => {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            credentials: 'include',
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, message: json.message, data: json.data };
    } catch (err) {
        return { ok: false, status: 0, message: GENERIC_ERROR };
    }
};

const Spinner = ({ text }) => (
    <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {text}
    </>
);

// Same card the Login and Register pages use
const AuthCard = ({ footer, children }) => (
    <>
        <AuthBackground />
        <div className="card card-authentication1 mx-auto my-5" style={{ top: '100px' }}>
            <div className="card-body">
                <div className="card-content p-2">
                    <div className="text-center fear-logo">
                        <img src="/assets/images/fear-logo/3.png" alt="FEAR" />
                    </div>
                    <div className="card-title text-uppercase text-center py-3"></div>
                    {children}
                </div>
            </div>
            <div className="card-footer text-center py-3">
                <p className="text-warning mb-0">{footer}</p>
            </div>
        </div>
    </>
);

const BackToSignIn = ({ children = 'Sign In here' }) => <Link to="/auth/login"> {children}</Link>;

/* -------------------------------------------------------------------------
   Step 1 (/reset-password): ask for the account email
   ---------------------------------------------------------------------- */

const RequestResetForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = email.trim().toLowerCase();

        if (!value) return setError('Email is required');
        if (!EMAIL_PATTERN.test(value)) return setError('Email is invalid');

        setSubmitting(true);
        const res = await request('/forgot-password', { method: 'POST', body: { email: value } });
        setSubmitting(false);

        // The API answers 404 for an unknown email. Show the same confirmation as for a real one, so this
        // page can't be used to find out which addresses have accounts.
        if (res.ok || res.status === 404) setSent(true);
        else setError(res.message || GENERIC_ERROR);
    };

    return (
        <AuthCard footer={<>Remembered it? <BackToSignIn /></>}>
            {sent ? (
                <div className="text-center">
                    <p className="text-success">
                        <i className="bx bx-check-circle mr-1"></i>
                        If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way. It expires in 10 minutes.
                    </p>
                    <Link to="/auth/login" className="btn btn-light btn-block">
                        <i className="bx bxs-lock-open"></i> Back to Sign in
                    </Link>
                    <button type="button" className="btn btn-link btn-block mt-2" onClick={() => setSent(false)}>
                        Didn&apos;t get it? Try again
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <p className="text-center">Enter the email for your account and we&apos;ll send you a link to reset your password.</p>
                    <div className="form-group">
                        <label htmlFor="inputEmailAddress" className="sr-only">Email Address</label>
                        <div className="position-relative has-icon-right">
                            <input
                                type="email"
                                className={`form-control input-shadow ${error ? 'is-invalid' : ''}`}
                                id="inputEmailAddress"
                                name="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={handleChange}
                                disabled={submitting}
                                autoComplete="email"
                            />
                            {error && <div className="invalid-feedback">{error}</div>}
                            <div className="form-control-position">
                                <i className="icon-envelope-open"></i>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-light btn-block" disabled={submitting}>
                        {submitting ? <Spinner text="Sending..." /> : <><i className="bx bx-envelope"></i> Send reset link</>}
                    </button>
                </form>
            )}
        </AuthCard>
    );
};

/* -------------------------------------------------------------------------
   Step 2 (/reset-password/:token): choose a new password
   ---------------------------------------------------------------------- */

const SetNewPasswordForm = ({ token }) => {
    // checking -> valid | invalid (expired or unknown token) | error (couldn't reach the API)
    const [tokenStatus, setTokenStatus] = useState('checking');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

    // Check the link up front, so someone with an expired one isn't asked to type a password first
    useEffect(() => {
        let cancelled = false;
        setTokenStatus('checking');

        request(`/verify-reset-token/${encodeURIComponent(token)}`).then((res) => {
            if (cancelled) return;
            if (res.ok) {
                setMaskedEmail(res.data?.email || '');
                setTokenStatus('valid');
            } else {
                setTokenStatus(res.status === 400 ? 'invalid' : 'error');
            }
        });

        return () => { cancelled = true; };
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
            errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        } else if (passwordStrength.score < MIN_PASSWORD_SCORE) {
            errors.password = 'Password is too weak. Use a stronger password';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        // Only the password goes to the API: the token is in the URL, and the confirmation stays client-side
        const res = await request(`/reset-password/${encodeURIComponent(token)}`, { method: 'POST', body: { password: formData.password } });
        setSubmitting(false);

        if (res.ok) return setDone(true);
        // The link expired while the form was open
        if (res.status === 400 && /token/i.test(res.message || '')) return setTokenStatus('invalid');
        setValidationErrors({ password: res.message || GENERIC_ERROR });
    };

    const footer = <>Back to <BackToSignIn>Sign In</BackToSignIn></>;

    if (tokenStatus === 'checking') {
        return (
            <AuthCard footer={footer}>
                <p className="text-center"><Spinner text="Verifying your link..." /></p>
            </AuthCard>
        );
    }

    if (tokenStatus === 'invalid' || tokenStatus === 'error') {
        return (
            <AuthCard footer={footer}>
                <div className="text-center">
                    <p className="text-danger">
                        {tokenStatus === 'invalid'
                            ? 'This reset link is invalid or has expired.'
                            : 'We could not check this link. Please try again.'}
                    </p>
                    {tokenStatus === 'invalid' ? (
                        <Link to="/reset-password" className="btn btn-light btn-block">
                            <i className="bx bx-envelope"></i> Request a new link
                        </Link>
                    ) : (
                        <button type="button" className="btn btn-light btn-block" onClick={() => window.location.reload()}>
                            <i className="bx bx-refresh"></i> Try again
                        </button>
                    )}
                </div>
            </AuthCard>
        );
    }

    if (done) {
        return (
            <AuthCard footer={footer}>
                <div className="text-center">
                    <p className="text-success">
                        <i className="bx bx-check-circle mr-1"></i>
                        Your password has been reset. You can sign in with it now.
                    </p>
                    <Link to="/auth/login" className="btn btn-light btn-block">
                        <i className="bx bxs-lock-open"></i> Sign in
                    </Link>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard footer={footer}>
            <form onSubmit={handleSubmit} noValidate>
                <p className="text-center">
                    Choose a new password{maskedEmail && <> for <strong>{maskedEmail}</strong></>}.
                </p>
                <div className="form-group">
                    <label htmlFor="inputNewPassword" className="sr-only">New Password</label>
                    <div className="position-relative has-icon-right">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`form-control input-shadow ${validationErrors.password ? 'is-invalid' : ''}`}
                            id="inputNewPassword"
                            name="password"
                            placeholder="New Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={submitting}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="input-group-text bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                            disabled={submitting}
                        >
                            <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                        </button>
                        {validationErrors.password && (
                            <div className="invalid-feedback d-block">{validationErrors.password}</div>
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
                    <label htmlFor="inputConfirmPassword" className="sr-only">Confirm Password</label>
                    <div className="position-relative has-icon-right">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`form-control input-shadow ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                            id="inputConfirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={submitting}
                            autoComplete="new-password"
                        />
                        {validationErrors.confirmPassword && (
                            <div className="invalid-feedback d-block">{validationErrors.confirmPassword}</div>
                        )}
                        <div className="form-control-position">
                            <i className="icon-lock"></i>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-light btn-block" disabled={submitting}>
                    {submitting ? <Spinner text="Resetting..." /> : <><i className="bx bxs-lock-open"></i> Reset password</>}
                </button>
            </form>
        </AuthCard>
    );
};

/**
 * Password recovery. Mount it on both routes:
 *   /reset-password          ask for the account email
 *   /reset-password/:token   the link from the email: choose a new password
 */
export const ResetPassword = () => {
    const { token } = useParams();
    return token ? <SetNewPasswordForm token={token} /> : <RequestResetForm />;
};

export default ResetPassword;