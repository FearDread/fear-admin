'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/lib/redux/api/authApi';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

/**
 * Converted from GoogleAuth.jsx.
 *
 * Key changes from the CRA version:
 *  - Dropped the manual localStorage token handling (`Storage.save`,
 *    `setToken`) — auth is cookie-session based now, so the server sets an
 *    httpOnly cookie and the client only needs the returned `user` object.
 *  - Dropped the "already signed in" card UI that duplicated account-page
 *    concerns; this component's only job is the sign-in button. Show the
 *    signed-in state via the header/account UI instead.
 *  - `GOOGLE_CLIENT_ID` now comes from `NEXT_PUBLIC_GOOGLE_CLIENT_ID` rather
 *    than being hardcoded in source.
 */
function GoogleAuthButton() {
  const router = useRouter();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    if (!credentialResponse.credential) {
      setError('Google did not return a credential. Please try again.');
      return;
    }
    try {
      await googleLogin({ credential: credentialResponse.credential }).unwrap();
      router.push('/account/dashboard');
    } catch (err: any) {
      setError(err?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div className="auth-social-google">
      {error && (
        <div className="auth-alert error" style={{ marginBottom: '0.75rem' }}>
          <span className="auth-alert-icon">⚠</span>
          <span style={{ flex: 1 }}>{error}</span>
        </div>
      )}

      <button className="auth-social-btn" disabled={isLoading} type="button">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
        />
      </button>
    </div>
  );
}

export default function GoogleAuth() {
  if (!GOOGLE_CLIENT_ID) {
    // Fail loudly in dev rather than silently rendering a broken button.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set — Google sign-in will not work.');
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleAuthButton />
    </GoogleOAuthProvider>
  );
}