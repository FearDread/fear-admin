'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVerifyResetTokenQuery, useResetPasswordMutation } from '@/lib/redux/api/authApi';

interface ResetPasswordFormProps {
  token: string;
}

/**
 * Converted from ResetPassword.jsx.
 *
 * Key changes:
 *  - Direct `axios.get`/`axios.post` calls → `useVerifyResetTokenQuery(token)`
 *    (runs automatically on mount, same as the original `useEffect`) and
 *    `useResetPasswordMutation()`.
 *  - Routes rebased from `/api/users/verify-reset-token/:token` and
 *    `/api/users/reset-password/:token` onto `/fear/api/auth/...` to match
 *    the apiSlice's relative `baseUrl` + this feature's `authApi` naming —
 *    confirm the real Express route names match once the backend is checked.
 *  - `useParams` (react-router) → the dynamic segment is now read server-side
 *    in `page.tsx` and passed down as a prop, since `useParams` from
 *    `next/navigation` returns different shapes and this keeps the token
 *    available even before hydration.
 *  - On successful reset, redirects to `/login?message=...` instead of
 *    passing a `location.state` object (no equivalent in the App Router).
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const { data: tokenCheck, isLoading: isVerifying, isError: tokenInvalid } = useVerifyResetTokenQuery(token);
  const [resetPassword, { isLoading: isSubmitting, error: mutationError }] = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const serverError = (mutationError as any)?.data?.message ?? null;
  const error = localError || serverError;

  useEffect(() => {
    if (tokenInvalid) {
      const timer = setTimeout(() => router.push('/forgot-password'), 3000);
      return () => clearTimeout(timer);
    }
  }, [tokenInvalid, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      const params = new URLSearchParams({ message: 'Password reset successfully. Please login.' });
      router.push(`/login?${params.toString()}`);
    } catch {
      // error surfaced via `mutationError` above
    }
  };

  if (isVerifying) {
    return <div>Verifying reset link...</div>;
  }

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Forgot Password</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href="/">
                      <i className="bx bx-home-alt"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Reset Password
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="authentication-forgot d-flex align-items-center justify-content-center">
            <div className="card forgot-box">
              <div className="card-body">
                <div className="p-4 rounded border">
                  <div className="text-center">
                    <img src="/assets/images/icons/forgot-2.png" width={120} alt="Forgot Password" />
                  </div>

                  <h4 className="mt-5 font-weight-bold">Forgot Password?</h4>
                  <p>Enter your registered email ID to reset the password</p>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {tokenInvalid ? 'Invalid or expired reset link' : error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>

                    <input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={tokenInvalid || isSubmitting}
                      required
                    />

                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={tokenInvalid || isSubmitting}
                      required
                    />

                    <button type="submit" disabled={tokenInvalid || isSubmitting}>
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPasswordForm;