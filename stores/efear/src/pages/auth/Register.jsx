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
import { T } from '../../components/styles';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
  'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'Brazil',
  'Mexico', 'South Africa', 'Dubai',
];

const calcStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', T.red, T.red, T.orange, T.orange, T.teal];
  return { score: s, label: labels[s], color: colors[s] };
};

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '',
    country: 'United States', agreeToTerms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated]);
  useEffect(() => { dispatch(clearError()); }, []);
  useEffect(() => {
    setStrength(formData.password ? calcStrength(formData.password) : { score: 0, label: '', color: '' });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    else if (formData.firstName.trim().length < 2) errors.firstName = 'At least 2 characters';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    else if (formData.lastName.trim().length < 2) errors.lastName = 'At least 2 characters';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Minimum 8 characters';
    else if (strength.score < 3) errors.password = 'Password is too weak';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.country) errors.country = 'Please select a country';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(register({
      displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      country: formData.country,
    }));
    if (register.fulfilled.match(result)) {
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    }
  };

  const handleGoogle = async () => { try { await dispatch(loginWithGoogle()); } catch (e) { } };
  const handleFacebook = async () => { try { await dispatch(loginWithFacebook()); } catch (e) { } };

  const pwMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <>
      <div className="auth-page">
        <aside className="auth-left">
          <div className="auth-left-stripe" />
          <span className="auth-left-ghost" aria-hidden="true">JOIN</span>
          <div className="auth-left-inner">
            <Link to="/" className="auth-left-logo">e<span>Fear</span></Link>
            <h2 className="auth-left-heading">
              Join The<br /><span>Collector's</span><br />Guild.
            </h2>
            <p className="auth-left-sub">
              Create an account and get early access to new arrivals, exclusive deals, and the quiet satisfaction of knowing your pull list is being handled by people who genuinely care.
            </p>

            <div className="auth-features">
              {[
                { icon: '⚡', title: 'Early Access', desc: 'New arrivals and restocks, your inbox first.', accent: T.red },
                { icon: '🏷️', title: 'Member Discounts', desc: 'Subscriber-only pricing on select titles.', accent: T.orange },
                { icon: '📋', title: 'Order Tracking', desc: 'Know exactly where your books are at all times.', accent: T.teal },
                { icon: '🎁', title: 'Wishlist', desc: 'Save items, share lists, get notified on drops.', accent: T.red },
              ].map(f => (
                <div className="auth-feature" key={f.title} style={{ '--feat-accent': f.accent }}>
                  <span className="auth-feature-icon">{f.icon}</span>
                  <div>
                    <p className="auth-feature-title">{f.title}</p>
                    <p className="auth-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-left-foot">
              <div className="auth-left-foot-label">Already part of the stash</div>
              <div className="auth-stat-row">
                {[['1000+', 'Titles'], ['NM', 'Quality'], ['24/7', 'Support']].map(([v, l]) => (
                  <div key={l}>
                    <span className="auth-stat-val">{v}</span>
                    <span className="auth-stat-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="auth-right">
          <div className="auth-form-wrap ct-form-panel">
            <span className="auth-form-eyebrow">New here?</span>
            <h1 className="auth-form-title">Create <span>Account</span></h1>
            <p className="auth-form-sub">
              Already have an account? <Link to="/login">Sign in here →</Link>
            </p>
            <br />
            {/* Error */}
            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button className="auth-alert-close" onClick={() => dispatch(clearError())}>✕</button>
              </div>
            )}

            {/* Social signup */}
            <div className="auth-socials">
              <button className="auth-social-btn" onClick={handleGoogle} disabled={loading}>
                <span className="auth-social-icon">G</span>
                Continue with Google
              </button>
              <button className="auth-social-btn" onClick={handleFacebook} disabled={loading}>
                <span className="auth-social-icon">𝒇</span>
                Continue with Facebook
              </button>
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or register with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* First + Last name */}
              <div className="auth-field-row" style={{ marginBottom: '1.1rem' }}>
                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="rg-first" className="auth-label">First Name <span className="auth-label-req">*</span></label>
                  <input
                    id="rg-first" type="text" name="firstName"
                    className={`auth-input${validationErrors.firstName ? ' error' : ''}`}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="given-name"
                  />
                  {validationErrors.firstName && <div className="auth-field-error">{validationErrors.firstName}</div>}
                </div>
                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="rg-last" className="auth-label">Last Name <span className="auth-label-req">*</span></label>
                  <input
                    id="rg-last" type="text" name="lastName"
                    className={`auth-input${validationErrors.lastName ? ' error' : ''}`}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="family-name"
                  />
                  {validationErrors.lastName && <div className="auth-field-error">{validationErrors.lastName}</div>}
                </div>
              </div>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="rg-email" className="auth-label">Email Address <span className="auth-label-req">*</span></label>
                <input
                  id="rg-email" type="email" name="email"
                  className={`auth-input${validationErrors.email ? ' error' : ''}`}
                  placeholder="example@user.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
                {validationErrors.email && <div className="auth-field-error">{validationErrors.email}</div>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="rg-pw" className="auth-label">Password <span className="auth-label-req">*</span></label>
                <div className="auth-pw-wrap">
                  <input
                    id="rg-pw" type={showPw ? 'text' : 'password'} name="password"
                    className={`auth-input${validationErrors.password ? ' error' : ''}`}
                    placeholder="Choose a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(p => !p)} disabled={loading}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>

                {/* Strength indicator */}
                {formData.password && (
                  <div className="auth-pw-strength">
                    <div className="auth-pw-bars">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className={`auth-pw-bar${strength.score >= n ? ` fill-${n}` : ''}`}
                          style={strength.score >= n ? { background: strength.color } : {}}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <span className="auth-pw-label" style={{ color: strength.color }}>
                        Strength: {strength.label}
                      </span>
                    )}
                  </div>
                )}
                {validationErrors.password && <div className="auth-field-error">{validationErrors.password}</div>}
                <p className="auth-pw-hint">Use 8+ characters with letters, numbers & symbols</p>
              </div>

              {/* Confirm password */}
              <div className="auth-field">
                <label htmlFor="rg-confirm-pw" className="auth-label">
                  Confirm Password <span className="auth-label-req">*</span>
                  {pwMatch && <span style={{ color: T.teal, marginLeft: '.5rem' }}>✓ Match</span>}
                </label>
                <div className="auth-pw-wrap">
                  <input
                    id="rg-confirm-pw" type={showConfirmPw ? 'text' : 'password'} name="confirmPassword"
                    className={`auth-input${validationErrors.confirmPassword ? ' error' : pwMatch ? '' : ''}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowConfirmPw(p => !p)} disabled={loading}>
                    {showConfirmPw ? '🙈' : '👁'}
                  </button>
                </div>
                {validationErrors.confirmPassword && <div className="auth-field-error">{validationErrors.confirmPassword}</div>}
              </div>

              {/* Country */}
              <div className="auth-field">
                <label htmlFor="rg-country" className="auth-label">Country <span className="auth-label-req">*</span></label>
                <select
                  id="rg-country" name="country"
                  className={`auth-select${validationErrors.country ? ' error' : ''}`}
                  value={formData.country}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select your country</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {validationErrors.country && <div className="auth-field-error">{validationErrors.country}</div>}
              </div>

              {/* Terms */}
              <div className="auth-field">
                <div
                  className="auth-check-row"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }));
                    if (validationErrors.agreeToTerms) setValidationErrors(prev => ({ ...prev, agreeToTerms: '' }));
                  }}
                >
                  <div className={`auth-check-box${formData.agreeToTerms ? ' checked' : ''}${validationErrors.agreeToTerms ? ' error' : ''}`} />
                  <span className="auth-check-label">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" onClick={e => e.stopPropagation()}>Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" onClick={e => e.stopPropagation()}>Privacy Policy</Link>
                    <span style={{ color: T.red }}> *</span>
                  </span>
                </div>
                {validationErrors.agreeToTerms && <div className="auth-field-error" style={{ marginTop: '.45rem' }}>{validationErrors.agreeToTerms}</div>}
              </div>

              {/* Submit */}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Creating Account...</>
                  : <>✦ &nbsp; Create Account</>
                }
              </button>
            </form>

            <div className="auth-form-foot">
              By signing up you agree to receive marketing emails. You can unsubscribe any time.<br />
              <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </main>
      </div>

      <div className="auth-animated-border" />
    </>
  );
};

export default Register;