'use client';

import { useState } from 'react';

/**
 * ⚠️ RECONSTRUCTED, NOT CONVERTED — the uploaded FacebookAuth.jsx was an
 * empty file, so there was no source to migrate. This is a best-effort
 * rebuild inferred from how Login.jsx / Register.jsx called Facebook auth:
 * both just did `dispatch(loginWithFacebook())` with **no arguments** (unlike
 * Google, which passed a `credentialResponse` from the JS SDK). That,
 * combined with no Facebook SDK package in package.json, points to a
 * redirect-based OAuth flow (e.g. Passport's `passport-facebook` strategy on
 * the Express side) rather than the Facebook JS SDK.
 *
 * This component redirects the browser to the Express backend's Facebook
 * OAuth entry point. The backend is expected to complete the OAuth
 * handshake, establish the session cookie, then redirect back to
 * `redirectTo`. Replace the URL below once you confirm the real route name
 * (`/auth/facebook` is a guess following the `/auth/google` sibling route
 * used by GoogleAuthButton's `googleLogin` mutation).
 *
 * If the real implementation does use the Facebook JS SDK instead, this
 * should be swapped for a client-side `FB.login()` call that then POSTs the
 * resulting `accessToken`/`userID` to `useFacebookLoginMutation` — that
 * mutation already exists in `authApi.ts` and expects exactly those fields.
 */
interface FacebookAuthButtonProps {
  redirectTo?: string;
}

export default function FacebookAuthButton({ redirectTo = '/account/dashboard' }: FacebookAuthButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    const params = new URLSearchParams({ redirect: redirectTo });
    window.location.href = `/fear/api/auth/facebook?${params.toString()}`;
  };

  return (
    <button
      type="button"
      className="auth-social-btn"
      onClick={handleClick}
      disabled={isRedirecting}
    >
      <span className="auth-social-icon">𝒇</span>
      {isRedirecting ? 'Redirecting…' : 'Continue with Facebook'}
    </button>
  );
}