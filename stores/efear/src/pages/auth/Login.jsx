// pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { dispatch } from '../../features/store';
import {
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  setRememberMe,
  selectRememberMe,
  clearError,
  setCurrentUser,
  setIsAuthenticated,
} from '../../features/user/slice';
import GoogleAuth from './components/GoogleAuth';
import { T, authStyles } from '../../components/styles';

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────────*/
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading         = useSelector(selectUserLoading);
  const error           = useSelector(selectUserError);

  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [localRemember, setLocalRemember] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated]);
  useEffect(() => { dispatch(clearError()); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email)                               errors.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))    errors.email    = 'Email is invalid';
    if (!formData.password)                            errors.password = 'Password is required';
    else if (formData.password.length < 6)             errors.password = 'Password must be at least 6 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser({
      email: formData.email, password: formData.password, rememberMe: localRemember,
    }));
    if (result.success) {
      dispatch(setRememberMe(localRemember));
      dispatch(setCurrentUser(result.user));
      dispatch(setIsAuthenticated(true));
      navigate('/account/dashboard', { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    try { await dispatch(loginWithGoogle()); } catch (err) { console.error(err); }
  };
  const handleFacebookLogin = async () => {
    try { await dispatch(loginWithFacebook()); } catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{authStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      <div className="auth-page">

        {/* ── LEFT BRAND PANEL ── */}
        <aside className="auth-left">
          <div className="auth-left-stripe" />
          <span className="auth-left-ghost" aria-hidden="true">LOGIN</span>
          <div className="auth-left-inner">
            <Link to="/" className="auth-left-logo">e<span>Fear</span></Link>

            <h2 className="auth-left-heading">
              Your Stash<br /><span>Awaits.</span>
            </h2>
            <p className="auth-left-sub">
              Comics bagged and boarded. E-books ready to download. Cards waiting to be graded. Log in before someone else snags that book you've been eyeing.
            </p>

            <div className="auth-features">
              {[
                { icon: '📦', title: 'Free Shipping',    desc: 'On all orders over $49. No tricks, no asterisks.', accent: T.red    },
                { icon: '🧤', title: 'Mint Condition',   desc: 'Every comic arrives bagged, boarded, near-mint.',  accent: T.orange },
                { icon: '🔄', title: '30-Day Returns',   desc: "Regret your choices? So do we. Send it back.",     accent: T.teal   },
                { icon: '💬', title: '24/7 Support',     desc: "We can't sleep either. Send us a message.",        accent: T.red    },
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
              <div className="auth-left-foot-label">By the numbers</div>
              <div className="auth-stat-row">
                {[['1000+','Titles'], ['NM','Quality'], ['30','Day Returns']].map(([v, l]) => (
                  <div key={l}>
                    <span className="auth-stat-val">{v}</span>
                    <span className="auth-stat-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT FORM PANEL ── */}
        <main className="auth-right">
          <div className="auth-form-wrap">
            <span className="auth-form-eyebrow">Welcome back</span>
            <h1 className="auth-form-title">Sign <span>In</span></h1>
            <p className="auth-form-sub">
              Don't have an account? <Link to="/register">Create one here →</Link>
            </p>

            {/* Redux error alert */}
            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button className="auth-alert-close" onClick={() => dispatch(clearError())}>✕</button>
              </div>
            )}

            {/* Success from registration redirect */}
            {location.state?.message && (
              <div className="auth-alert success">
                <span className="auth-alert-icon">✓</span>
                <span>{location.state.message}</span>
              </div>
            )}

            {/* Social login */}
            <div className="auth-socials">
              <GoogleAuth />
              <button className="auth-social-btn" onClick={handleFacebookLogin} disabled={loading}>
                <span className="auth-social-icon">𝒇</span>
                Continue with Facebook
              </button>
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or sign in with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="auth-field">
                <label htmlFor="lg-email" className="auth-label">Email Address <span className="auth-label-req">*</span></label>
                <input
                  id="lg-email" type="email" name="email"
                  className={`auth-input${validationErrors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
                {validationErrors.email && <div className="auth-field-error">{validationErrors.email}</div>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="lg-password" className="auth-label">Password <span className="auth-label-req">*</span></label>
                <div className="auth-pw-wrap">
                  <input
                    id="lg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`auth-input${validationErrors.password ? ' error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button" className="auth-pw-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    disabled={loading}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {validationErrors.password && <div className="auth-field-error">{validationErrors.password}</div>}
              </div>

              {/* Remember me + Forgot */}
              <div className="auth-remember-row">
                <div
                  className="auth-check-row"
                  onClick={() => setLocalRemember(r => !r)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div className={`auth-check-box${localRemember ? ' checked' : ''}`} />
                  <span className="auth-check-label">Remember me</span>
                </div>
                <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Signing In...</>
                  : <>🔓 &nbsp; Sign In</>
                }
              </button>
            </form>

            <div className="auth-form-foot">
              By signing in you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </div>
          </div>
        </main>
      </div>

      {/* Animated bottom border */}
      <div className="auth-animated-border" />
    </>
  );
};

export default Login;