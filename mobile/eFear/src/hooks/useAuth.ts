import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import type { RootState, AppDispatch } from '../features/store';
// Import your actual auth actions here, e.g.:
// import { logout } from '../features/auth/authSlice';

/**
 * useAuth
 *
 * Central auth hook – replaces the PrivateRoute / PublicRoute context pair.
 * Use it in any component that needs to know the auth state or trigger
 * navigation guards programmatically.
 *
 * Usage:
 *   const { user, isAuthenticated, signOut, requireAuth } = useAuth();
 */
export function useAuth() {
  const dispatch       = useDispatch<AppDispatch>();
  const router         = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user           = useSelector((s: RootState) => s.auth.user);
  const isLoading      = useSelector((s: RootState) => s.auth.isLoading ?? false);

  /**
   * Redirect to login if not authenticated.
   * Call this inside useEffect for screens that need a soft guard
   * (on top of the layout-level redirect).
   */
  function requireAuth(redirectTo = '/(auth)/login') {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }

  /**
   * Redirect away if already authenticated.
   * Useful for auth screens to avoid re-entry.
   */
  function requireGuest(redirectTo: string = '/(protected)/account/dashboard') {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }

  /** Dispatch logout and navigate to home. */
  async function signOut() {
    // await dispatch(logout());   // ← uncomment when authSlice is ready
    router.replace('/(public)');
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    requireAuth,
    requireGuest,
    signOut,
  };
}