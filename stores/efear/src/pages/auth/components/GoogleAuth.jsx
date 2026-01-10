import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import {
  loginWithGoogle
} from "../../../features/user/slice";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "770636390-0080vi5ejigk8s5mbuaikgn9j0qb129n.apps.googleusercontent.com";
const API_BASE_URL = 'http://localhost:4000/fear/api/auth';

function AuthComponent() {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('google auth response = ', credentialResponse);
    setLoading(true);
    setError(null);

    dispatch(loginWithGoogle(credentialResponse));
    /*
    Promise.resolve(fetch(`${API_BASE_URL}/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        credential: credentialResponse.credential
      })
    }))
      .then((response) => {
        const data = response.json();
        console.log('google auth response = ', response);
        // Set user state
        if (data.data.token) {
          localStorage.setItem('authToken', data.data.token);
        }

        setUser(data.data.user);
        setError(null);
      })
      .catch((err) => {

        setError(err.message || 'Authentication failed. Please try again.');
        console.error('Google auth error:', err);

      })
        */
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      localStorage.removeItem('authToken');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (user) {
    return (
      <>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              {user.avatar && (
                <div className="mb-4">
                  <img
                    src={user.avatar}
                    alt={user.displayName || user.firstName}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-100"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600 mb-1">
                {user.displayName || `${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span> {user.role}
                </div>
                {user.lastLoginAt && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Last login:</span>{' '}
                    {new Date(user.lastLoginAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <button
        className="btn my-4 shadow-sm btn-light"
        disabled={loading} >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
        />
      </button>
    </>
  );
}

export default function GoogleAuth() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthComponent />
    </GoogleOAuthProvider>
  );
}