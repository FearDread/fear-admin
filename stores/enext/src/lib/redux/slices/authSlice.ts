/**
 * lib/redux/slices/authSlice.ts
 *
 * Plain slice (no thunks) — session state is populated exclusively by
 * `authApi`'s `onQueryStarted` handlers. Auth itself is a JWT stored in an
 * httpOnly `jwt` cookie set by the FEAR API's auth controller
 * (`response.success` in `backend/.../auth/index.js`); the client never
 * reads or stores the token itself, only the `user` object the cookie
 * implies.
 *
 * `isHydrating` starts `true` and is flipped to `false` exactly once, by
 * `getSession`'s `onQueryStarted` (see authApi.ts), whether that request
 * resolves as "logged in" or "not logged in" (401). Anything that gates
 * rendering on "do we know yet whether the user is logged in" (e.g.
 * AccountClient) should read this rather than a mutation's own
 * `isLoading`.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';
import type { User } from '@/types/user';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
    error: string | null;
    /** True until the initial /auth/me check (AuthHydrator) resolves either way. */
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
        /**
         * Full logout / reset of session state. Dispatched by authApi's
         * `logout` mutation after the server clears the `jwt` cookie.
         * Deliberately does NOT reset `rememberMe` — that's a standing user
         * preference for the login form, not session state.
         */
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setCurrentUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        /**
         * Convenience action for the common "set user + derive isAuthenticated
         * from it in one dispatch" case (login/register/googleLogin success).
         */
        setSession(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
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
    setSession,
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
 * Back-compat alias for older CRA-era imports of `selectUserError`.
 * Prefer the RTK Query `error` field returned by the mutation hooks
 * directly for anything new.
 */
export const selectUserError = selectAuthError;