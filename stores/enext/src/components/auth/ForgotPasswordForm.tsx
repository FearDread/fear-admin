'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForgotPasswordMutation } from '@/lib/redux/api/authApi';
import { AuthLeftPanel, RECOVERY_FEATURES } from '@/components/auth/AuthLeftPanel';

const RESEND_SECONDS = 60;

/**
 * Anti-enumeration: the UI shows the same "check your inbox" state whether or
 * not the email exists. A 404 from the backend is treated as success; only
 * real failures (network / 5xx / 429) surface as errors.
 */
export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [serverError, setServerError] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = (address: string) => {
    setServerError('');

    return forgotPassword({ email: address })
      .unwrap()
      .then(() => true)
      .catch((err: unknown) => {
        const status = (err as { status?: number })?.status;
        if (status === 404) return true; // unknown email looks identical to success
        setServerError(
          status === 429
            ? 'Too many requests. Please wait a few minutes and try again.'
            : 'We could not send the email right now. Please try again.',
        );
        return false;
      })
      .then((ok) => {
        if (!ok) return;
        setSentTo(address);
        setCooldown(RESEND_SECONDS);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return setFieldError('Email is required');
    if (!/\S+@\S+\.\S+/.test(value)) return setFieldError('Email is invalid');
    setFieldError('');
    send(value);
  };

  return (
    <>
      <div className="auth-page">
        <AuthLeftPanel
          ghostLabel="HELP"
          heading={
            <>
              Locked
              <br />
              <span>Out?</span>
            </>
          }
          subtext="It happens to the best collectors. Enter your email and we'll send a link to get you back to your stash."
          features={RECOVERY_FEATURES}
          footLabel="Need a human?"
          stats={[
            { value: '24/7', label: 'Support' },
            { value: '30', label: 'Day Returns' },
            { value: 'NM', label: 'Quality' },
          ]}
        />

        <main className="auth-right">
          <div className="auth-form-wrap ct-form-panel">
            {sentTo ? (
              <>
                <span className="auth-form-eyebrow">Email sent</span>
                <h1 className="auth-form-title">
                  Check Your <span>Inbox</span>
                </h1>
                <div className="auth-alert success" role="status" style={{ marginTop: '1.25rem' }}>
                  <span className="auth-alert-icon">✓</span>
                  <span>
                    If an account exists for <strong>{sentTo}</strong>, a reset link is on its way. Check your spam
                    folder if it doesn&apos;t show up within a few minutes.
                  </span>
                </div>

                {serverError && (
                  <div className="auth-alert error" role="alert">
                    <span className="auth-alert-icon">⚠</span>
                    <span style={{ flex: 1 }}>{serverError}</span>
                  </div>
                )}

                <button
                  type="button"
                  className="auth-submit"
                  disabled={isLoading || cooldown > 0}
                  onClick={() => send(sentTo)}
                >
                  {isLoading ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
                </button>

                <div className="auth-form-foot">
                  Wrong address?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSentTo(null);
                      setCooldown(0);
                    }}
                  >
                    Use a different email
                  </a>
                  <br />
                  <Link href="/login">← Back to Sign In</Link>
                </div>
              </>
            ) : (
              <>
                <span className="auth-form-eyebrow">Account recovery</span>
                <h1 className="auth-form-title">
                  Forgot <span>Password?</span>
                </h1>
                <p className="auth-form-sub">
                  Remembered it? <Link href="/login">Sign in →</Link>
                </p>
                <br />

                {serverError && (
                  <div className="auth-alert error" role="alert">
                    <span className="auth-alert-icon">⚠</span>
                    <span style={{ flex: 1 }}>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="auth-field">
                    <label htmlFor="fp-email" className="auth-label">
                      Email Address <span className="auth-label-req">*</span>
                    </label>
                    <input
                      id="fp-email"
                      type="email"
                      className={`auth-input${fieldError ? ' error' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldError) setFieldError('');
                      }}
                      disabled={isLoading}
                      autoComplete="email"
                      autoFocus
                    />
                    {fieldError && <div className="auth-field-error">{fieldError}</div>}
                  </div>

                  <button type="submit" className="auth-submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="auth-spinner" /> Sending…
                      </>
                    ) : (
                      <>✉ &nbsp; Send Reset Link</>
                    )}
                  </button>
                </form>

                <div className="auth-form-foot">
                  <Link href="/register">Create an account</Link> · <Link href="/contact">Contact support</Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <div className="auth-animated-border" />
    </>
  );
}

export default ForgotPasswordForm;
