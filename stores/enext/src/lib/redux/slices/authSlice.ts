/**
 * features/auth/authSlice.ts
 *
 * ⚠️ REBUILD, NOT A DIFF. The real `authSlice` already exists in the project
 * (referenced throughout Login.jsx, Register.jsx, GoogleAuth.jsx as
 * '../../features/user/slice') but its source was never uploaded to this
 * conversation. Merge this against the real file rather than overwriting it —
 * in particular, keep whatever extra state/reducers the real slice already
 * has for cart/wishlist/etc. if it's a combined "user" slice rather than a
 * dedicated "auth" slice.
 *
 * Per project convention: this is a *plain* slice (no async thunks). Session
 * state is populated by `authApi`'s `onQueryStarted` handlers, not by thunks
 * making requests here. Auth itself is cookie-session based — no token is
 * stored in Redux or localStorage.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  error: string | null;
  /** True while we're checking the session cookie on initial load (see AuthHydrator). */
  isHydrating: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  rememberMe: false,
  error: null,
  isHydrating: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state, action: PayloadAction<boolean>) {

    },
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setRememberMe(state, action: PayloadAction<boolean>) {
      state.rememberMe = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setHydrating(state, action: PayloadAction<boolean>) {
      state.isHydrating = action.payload;
    },
    resetAuthState() {
      return initialState;
    },
  },
});

export const {
  logout,
  setCurrentUser,
  setIsAuthenticated,
  setRememberMe,
  setAuthError,
  clearError,
  setHydrating,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectRememberMe = (state: RootState) => state.auth.rememberMe;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthHydrating = (state: RootState) => state.auth.isHydrating;

/**
 * Back-compat aliases so callers can still import selectUserLoading /
 * selectUserError / selectUserSuccess by their old CRA names if other
 * not-yet-converted files still reference them. Prefer the RTK Query
 * `isLoading` / `isSuccess` flags returned by the mutation hooks directly —
 * these aliases just point error state through for the transition period.
 */
export const selectUserError = selectAuthError;