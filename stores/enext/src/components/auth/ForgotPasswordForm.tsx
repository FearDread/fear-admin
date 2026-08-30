'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@/features/auth/authApi';

/**
 * Converted from ForgotPassword.jsx.
 *
 * Key changes:
 *  - `forgotPassword` thunk (+ selectUserLoading/selectUserError/selectUserSuccess
 *    selectors from the old `user/slice`) → `useForgotPasswordMutation()`,
 *    which exposes `isLoading` / `isSuccess` / `error` directly — no separate
 *    Redux selectors needed for this page's own request state.
 *  - `useNavigate` → `useRouter`; the `setTimeout` redirect to /login is kept
 *    as-is (matches original UX of an auto-redirect after showing the
 *    "email sent" confirmation).
 *  - Image path given leading `/` per project convention
 *    (`/assets/images/icons/forgot-2.png`).
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { isLoading, error: mutationError, isSuccess }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const error = (mutationError as any)?.data?.message ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await forgotPassword({ email }).unwrap();
      setSubmitted(true);
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch {
      // error surfaced via the mutation hook's `error` above
    }
  };

  useEffect(() => {
    // No-op placeholder retained from the original effect that cleared
    // errors on success — RTK Query resets `error` automatically on a new
    // request, so there's nothing to dispatch here anymore.
  }, [isSuccess]);

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

                  {!submitted ? (
                    <>
                      <h4 className="mt-5 font-weight-bold">Forgot Password?</h4>
                      <p>Enter your registered email ID to reset the password</p>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="my-4">
                          <label className="form-label">Email id</label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="example@user.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                          />
                        </div>

                        <div className="d-grid gap-2">
                          <button type="submit" className="btn btn-dark btn-ecomm" disabled={isLoading || !email}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Sending...
                              </>
                            ) : (
                              'Send'
                            )}
                          </button>

                          <Link href="/login" className="btn btn-light btn-ecomm">
                            <i className="bx bx-arrow-back me-1"></i>Back to Login
                          </Link>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="alert alert-success mt-4" role="alert">
                        <i className="bx bx-check-circle fs-1"></i>
                        <h5 className="mt-3">Email Sent Successfully!</h5>
                        <p>
                          We&apos;ve sent password reset instructions to <strong>{email}</strong>. Please check your
                          inbox and follow the link to reset your password.
                        </p>
                        <p className="text-muted small">Redirecting to login in 5 seconds...</p>
                      </div>

                      <Link href="/login" className="btn btn-light btn-ecomm mt-3">
                        <i className="bx bx-arrow-back me-1"></i>Back to Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgotPasswordForm;