'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/features/auth/authApi';
import { T } from '@/components/styles';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import FacebookAuthButton from '@/components/auth/FacebookAuthButton';
import { AuthLeftPanel, REGISTER_FEATURES } from '@/components/auth/AuthLeftPanel';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
  'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'Brazil',
  'Mexico', 'South Africa', 'Dubai',
];

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const calcStrength = (pw: string): PasswordStrength => {
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  agreeToTerms: boolean;
}

type ValidationErrors = Partial<Record<keyof FormData, string>>;

/**
 * Converted from Register.jsx.
 *
 * Key changes:
 *  - `registerUser` thunk → `useRegisterMutation()`.
 *  - On success, still redirects to /login (matches original behavior — the
 *    account is created but not auto-authenticated). The success message
 *    that used to travel via React Router's `location.state` now travels as
 *    a `?message=` search param, read by LoginForm.
 *  - Facebook button now uses the same `<FacebookAuthButton />` used on the
 *    login page instead of an inline `handleFacebook` dispatch, since Google
 *    already got its own dedicated component in the original code — this
 *    just makes both providers consistent.
 */
export function RegisterForm() {
  const router = useRouter();
  const [registerUser, { isLoading, error: mutationError }] = useRegisterMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'United States',
    agreeToTerms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: '', color: '' });

  const error = (mutationError as any)?.data?.message ?? null;

  useEffect(() => {
    setStrength(formData.password ? calcStrength(formData.password) : { score: 0, label: '', color: '' });
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors: ValidationErrors = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser({
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        country: formData.country,
      }).unwrap();

      const params = new URLSearchParams({ message: 'Account created! Please sign in.' });
      router.push(`/login?${params.toString()}`);
    } catch {
      // error state comes from the mutation hook itself
    }
  };

  const pwMatch = Boolean(formData.confirmPassword) && formData.password === formData.confirmPassword;

  return (
    <>
      <div className="auth-page">
        <AuthLeftPanel
          ghostLabel="JOIN"
          heading={
            <>
              Join The
              <br />
              <span>Collector&apos;s</span>
              <br />
              Guild.
            </>
          }
          subtext="Create an account and get early access to new arrivals, exclusive deals, and the quiet satisfaction of knowing your pull list is being handled by people who genuinely care."
          features={REGISTER_FEATURES}
          footLabel="Already part of the stash"
          stats={[
            { value: '1000+', label: 'Titles' },
            { value: 'NM', label: 'Quality' },
            { value: '24/7', label: 'Support' },
          ]}
        />

        <main className="auth-right">
          <div className="auth-form-wrap ct-form-panel">
            <span className="auth-form-eyebrow">New here?</span>
            <h1 className="auth-form-title">
              Create <span>Account</span>
            </h1>
            <p className="auth-form-sub">
              Already have an account? <Link href="/login">Sign in here →</Link>
            </p>
            <br />

            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
              </div>
            )}

            <div className="auth-socials">
              <GoogleAuthButton />
              <FacebookAuthButton />
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or register with email</span>
              <div className="auth-divider-line" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field-row" style={{ marginBottom: '1.1rem' }}>
                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="rg-first" className="auth-label">
                    First Name <span className="auth-label-req">*</span>
                  </label>
                  <input
                    id="rg-first"
                    type="text"
                    name="firstName"
                    className={`auth-input${validationErrors.firstName ? ' error' : ''}`}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="given-name"
                  />
                  {validationErrors.firstName && <div className="auth-field-error">{validationErrors.firstName}</div>}
                </div>
                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="rg-last" className="auth-label">
                    Last Name <span className="auth-label-req">*</span>
                  </label>
                  <input
                    id="rg-last"
                    type="text"
                    name="lastName"
                    className={`auth-input${validationErrors.lastName ? ' error' : ''}`}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="family-name"
                  />
                  {validationErrors.lastName && <div className="auth-field-error">{validationErrors.lastName}</div>}
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="rg-email" className="auth-label">
                  Email Address <span className="auth-label-req">*</span>
                </label>
                <input
                  id="rg-email"
                  type="email"
                  name="email"
                  className={`auth-input${validationErrors.email ? ' error' : ''}`}
                  placeholder="example@user.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {validationErrors.email && <div className="auth-field-error">{validationErrors.email}</div>}
              </div>

              <div className="auth-field">
                <label htmlFor="rg-pw" className="auth-label">
                  Password <span className="auth-label-req">*</span>
                </label>
                <div className="auth-pw-wrap">
                  <input
                    id="rg-pw"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className={`auth-input${validationErrors.password ? ' error' : ''}`}
                    placeholder="Choose a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPw((p) => !p)} disabled={isLoading}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>

                {formData.password && (
                  <div className="auth-pw-strength">
                    <div className="auth-pw-bars">
                      {[1, 2, 3, 4, 5].map((n) => (
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
                <p className="auth-pw-hint">Use 8+ characters with letters, numbers &amp; symbols</p>
              </div>

              <div className="auth-field">
                <label htmlFor="rg-confirm-pw" className="auth-label">
                  Confirm Password <span className="auth-label-req">*</span>
                  {pwMatch && <span style={{ color: T.teal, marginLeft: '.5rem' }}>✓ Match</span>}
                </label>
                <div className="auth-pw-wrap">
                  <input
                    id="rg-confirm-pw"
                    type={showConfirmPw ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`auth-input${validationErrors.confirmPassword ? ' error' : ''}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowConfirmPw((p) => !p)}
                    disabled={isLoading}
                  >
                    {showConfirmPw ? '🙈' : '👁'}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="auth-field-error">{validationErrors.confirmPassword}</div>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="rg-country" className="auth-label">
                  Country <span className="auth-label-req">*</span>
                </label>
                <select
                  id="rg-country"
                  name="country"
                  className={`auth-select${validationErrors.country ? ' error' : ''}`}
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {validationErrors.country && <div className="auth-field-error">{validationErrors.country}</div>}
              </div>

              <div className="auth-field">
                <div
                  className="auth-check-row"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, agreeToTerms: !prev.agreeToTerms }));
                    if (validationErrors.agreeToTerms) {
                      setValidationErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
                    }
                  }}
                >
                  <div
                    className={`auth-check-box${formData.agreeToTerms ? ' checked' : ''}${
                      validationErrors.agreeToTerms ? ' error' : ''
                    }`}
                  />
                  <span className="auth-check-label">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" onClick={(e) => e.stopPropagation()}>
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" onClick={(e) => e.stopPropagation()}>
                      Privacy Policy
                    </Link>
                    <span style={{ color: T.red }}> *</span>
                  </span>
                </div>
                {validationErrors.agreeToTerms && (
                  <div className="auth-field-error" style={{ marginTop: '.45rem' }}>
                    {validationErrors.agreeToTerms}
                  </div>
                )}
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="auth-spinner" /> Creating Account...
                  </>
                ) : (
                  <>✦ &nbsp; Create Account</>
                )}
              </button>
            </form>

            <div className="auth-form-foot">
              By signing up you agree to receive marketing emails. You can unsubscribe any time.
              <br />
              <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </main>
      </div>

      <div className="auth-animated-border" />
    </>
  );
}

export default RegisterForm;