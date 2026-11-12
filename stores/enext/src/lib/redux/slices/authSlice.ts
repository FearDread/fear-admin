/**
 * lib/redux/slices/authSlice.ts
 *
 * Plain slice (no thunks). Session state is populated by `authApi`'s
 * `onQueryStarted` handlers (and by LoginForm via `setSession`). Auth itself is
 * a JWT in an httpOnly `jwt` cookie set by the FEAR API; the client never
 * reads the token, only the `user` object the cookie implies.
 *
 * `isHydrating` starts `true` and is flipped to `false` by `getSession`
 * (success OR failure), by a successful login, and by logout. Anything that
 * gates rendering on "do we know yet whether the user is logged in"
 * (AccountClient, checkout guards) must read this.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';
import type { User } from '@/types/user';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
    error: string | null;
    /** True until the initial /auth/session check resolves either way. */
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
         * Clears session state (explicit logout, or a 401 on a protected
         * endpoint). Keeps `rememberMe` (a form preference) and marks hydration
         * complete: after a logout we KNOW the user is signed out.
         */
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isHydrating = false;
        },
        setCurrentUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        /**
         * Atomic "set user + derive isAuthenticated + hydration done".
         * Use for login / google / facebook success so no consumer can observe
         * a half-updated state (user set but isAuthenticated still false).
         */
        setSession(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
            state.isHydrating = false;
            if (action.payload) state.error = null;
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
        /**
         * Full reset. Unlike returning `initialState` verbatim, this does NOT
         * put `isHydrating` back to true (no hydrator re-runs after logout, so
         * anything waiting on it would spin forever) and preserves rememberMe.
         */
        resetAuthState(state) {
            return { ...initialState, isHydrating: false, rememberMe: state.rememberMe };
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

/** Back-compat alias for older CRA-era imports. */
export const selectUserError = selectAuthError;