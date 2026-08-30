'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useLoginMutation } from '@/features/auth/authApi';
import {
  selectIsAuthenticated,
  selectAuthError,
  selectRememberMe,
  setRememberMe,
  clearError,
} from '@/lib/redux/slices/authSlice';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import FacebookAuthButton from '@/components/auth/FacebookAuthButton';
import { AuthLeftPanel, LOGIN_FEATURES } from '@/components/auth/AuthLeftPanel';

interface ValidationErrors {
  email?: string;
  password?: string;
}

/**
 * Converted from Login.jsx.
 *
 * Key changes:
 *  - `loginUser` thunk → `useLoginMutation()`. Success/failure syncing of
 *    `currentUser` / `isAuthenticated` now happens inside authApi's
 *    `onQueryStarted`, so this component only needs to call `.unwrap()` and
 *    navigate.
 *  - `useNavigate`/`useLocation` (react-router) → `useRouter`/`useSearchParams`
 *    (next/navigation). React Router's `location.state.from` pattern has no
 *    direct App Router equivalent, so the "redirect back to where the user
 *    came from" behavior is now driven by a `?from=` search param instead
 *    (see the redirect in middleware/PrivateRoute's Next.js replacement).
 *  - The `location.state?.message` success banner (used after a password
 *    reset) is now read from `?message=` instead, since route state doesn't
 *    exist in the App Router.
 *  - `<Link to>` → `<Link href>`.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);
  const rememberMe = useSelector(selectRememberMe);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [localRemember, setLocalRemember] = useState(rememberMe);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const from = searchParams.get('from') || '/';
  const successMessage = searchParams.get('message');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors: ValidationErrors = {};
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: localRemember,
      }).unwrap();

      dispatch(setRememberMe(localRemember));
      router.replace('/account/dashboard');
    } catch {
      // authApi's onQueryStarted already populated the error in state
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.replace(from);
  }, [isAuthenticated, from, router]);

  useEffect(() => {
    dispatch(clearError());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="auth-page">
        <AuthLeftPanel
          ghostLabel="LOGIN"
          heading={
            <>
              Your Stash
              <br />
              <span>Awaits.</span>
            </>
          }
          subtext="Comics bagged and boarded. E-books ready to download. Cards waiting to be graded. Log in before someone else snags that book you've been eyeing."
          features={LOGIN_FEATURES}
          footLabel="By the numbers"
          stats={[
            { value: '1000+', label: 'Titles' },
            { value: 'NM', label: 'Quality' },
            { value: '30', label: 'Day Returns' },
          ]}
        />

        <main className="auth-right">
          <div className="auth-form-wrap ct-form-panel">
            <span className="auth-form-eyebrow">Welcome back</span>
            <h1 className="auth-form-title">
              Sign <span>In</span>
            </h1>
            <p className="auth-form-sub">
              Don&apos;t have an account? <Link href="/register">Create one here →</Link>
            </p>

            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button className="auth-alert-close" onClick={() => dispatch(clearError())}>
                  ✕
                </button>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert success">
                <span className="auth-alert-icon">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            <div className="auth-socials">
              <GoogleAuthButton />
              <FacebookAuthButton />
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or sign in with email</span>
              <div className="auth-divider-line" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="lg-email" className="auth-label">
                  Email Address <span className="auth-label-req">*</span>
                </label>
                <input
                  id="lg-email"
                  type="email"
                  name="email"
                  className={`auth-input${validationErrors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {validationErrors.email && <div className="auth-field-error">{validationErrors.email}</div>}
              </div>

              <div className="auth-field">
                <label htmlFor="lg-password" className="auth-label">
                  Password <span className="auth-label-req">*</span>
                </label>
                <div className="auth-pw-wrap">
                  <input
                    id="lg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`auth-input${validationErrors.password ? ' error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    disabled={isLoading}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {validationErrors.password && <div className="auth-field-error">{validationErrors.password}</div>}
              </div>

              <div className="auth-remember-row">
                <div
                  className="auth-check-row"
                  onClick={() => setLocalRemember((r) => !r)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div className={`auth-check-box${localRemember ? ' checked' : ''}`} />
                  <span className="auth-check-label">Remember me</span>
                </div>
                <Link href="/forgot-password" className="auth-forgot">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="auth-spinner" /> Signing In...
                  </>
                ) : (
                  <>🔓 &nbsp; Sign In</>
                )}
              </button>
            </form>

            <div className="auth-form-foot">
              By signing in you agree to our <Link href="/terms">Terms of Service</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </div>
          </div>
        </main>
      </div>

      <div className="auth-animated-border" />
    </>
  );
}

export default LoginForm;