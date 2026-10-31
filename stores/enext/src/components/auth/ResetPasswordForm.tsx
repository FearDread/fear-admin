'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVerifyResetTokenQuery, useResetPasswordMutation } from '@/lib/redux/api/authApi';
import { AuthLeftPanel, RECOVERY_FEATURES } from '@/components/auth/AuthLeftPanel';
import { calcStrength } from '@/lib/auth/passwordStrength';
import { T } from '@/components/styles';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const { data: tokenCheck, isLoading: isVerifying, isError } = useVerifyResetTokenQuery(token);
  const [resetPassword, { isLoading: isSubmitting, error: mutationError }] = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const strength = useMemo(() => calcStrength(password), [password]);
  const tokenInvalid = isError || tokenCheck?.valid === false;
  const serverError = (mutationError as { data?: { message?: string } } | undefined)?.data?.message ?? null;
  const match = Boolean(confirm) && password === confirm;

  const validate = () => {
    const e: typeof errors = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    else if (strength.score < 3) e.password = 'Password is too weak';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await resetPassword({ token, password }).unwrap();
      const params = new URLSearchParams({ message: 'Password reset successfully. Please sign in.' });
      router.replace(`/login?${params.toString()}`);
    } catch {
      // surfaced via mutationError
    }
  };

  return (
    <>
      <div className="auth-page">
        <AuthLeftPanel
          ghostLabel="RESET"
          heading={
            <>
              Fresh
              <br />
              <span>Start.</span>
            </>
          }
          subtext="Pick a strong password you haven't used elsewhere, and you'll be back to hunting back issues in no time."
          features={RECOVERY_FEATURES}
          footLabel="Password tips"
          stats={[
            { value: '8+', label: 'Characters' },
            { value: 'Aa1', label: 'Mixed' },
            { value: '!@#', label: 'Symbols' },
          ]}
        />

        <main className="auth-right">
          <div className="auth-form-wrap ct-form-panel">
            {isVerifying ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div className="auth-spinner" style={{ margin: '0 auto 1rem' }} />
                <span className="auth-form-eyebrow">Verifying reset link…</span>
              </div>
            ) : tokenInvalid ? (
              <>
                <span className="auth-form-eyebrow">Link problem</span>
                <h1 className="auth-form-title">
                  Link <span>Expired</span>
                </h1>
                <div className="auth-alert error" role="alert" style={{ marginTop: '1.25rem' }}>
                  <span className="auth-alert-icon">⚠</span>
                  <span>This reset link is invalid or has expired. Reset links can only be used once.</span>
                </div>
                <Link href="/forgot-password" className="auth-submit" style={{ textDecoration: 'none' }}>
                  Request a New Link
                </Link>
                <div className="auth-form-foot">
                  <Link href="/login">← Back to Sign In</Link>
                </div>
              </>
            ) : (
              <>
                <span className="auth-form-eyebrow">Account recovery</span>
                <h1 className="auth-form-title">
                  New <span>Password</span>
                </h1>
                <br />

                {serverError && (
                  <div className="auth-alert error" role="alert">
                    <span className="auth-alert-icon">⚠</span>
                    <span style={{ flex: 1 }}>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="auth-field">
                    <label htmlFor="rp-pw" className="auth-label">
                      New Password <span className="auth-label-req">*</span>
                    </label>
                    <div className="auth-pw-wrap">
                      <input
                        id="rp-pw"
                        type={showPw ? 'text' : 'password'}
                        className={`auth-input${errors.password ? ' error' : ''}`}
                        placeholder="Choose a strong password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                        }}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="auth-pw-toggle"
                        onClick={() => setShowPw((s) => !s)}
                        disabled={isSubmitting}
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? '🙈' : '👁'}
                      </button>
                    </div>
                    {password && (
                      <div className="auth-pw-strength">
                        <div className="auth-pw-bars">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className="auth-pw-bar"
                              style={strength.score >= n ? { background: strength.color } : {}}
                            />
                          ))}
                        </div>
                        <span className="auth-pw-label" style={{ color: strength.color }}>
                          Strength: {strength.label}
                        </span>
                      </div>
                    )}
                    {errors.password && <div className="auth-field-error">{errors.password}</div>}
                    <p className="auth-pw-hint">Use 8+ characters with letters, numbers &amp; symbols</p>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="rp-confirm" className="auth-label">
                      Confirm Password <span className="auth-label-req">*</span>
                      {match && <span style={{ color: T.teal, marginLeft: '.5rem' }}>✓ Match</span>}
                    </label>
                    <input
                      id="rp-confirm"
                      type={showPw ? 'text' : 'password'}
                      className={`auth-input${errors.confirm ? ' error' : ''}`}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
                      }}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    {errors.confirm && <div className="auth-field-error">{errors.confirm}</div>}
                  </div>

                  <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="auth-spinner" /> Resetting…
                      </>
                    ) : (
                      <>🔑 &nbsp; Reset Password</>
                    )}
                  </button>
                </form>

                <div className="auth-form-foot">
                  <Link href="/login">← Back to Sign In</Link>
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

export default ResetPasswordForm;
