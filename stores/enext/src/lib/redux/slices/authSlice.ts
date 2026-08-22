import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';


export interface User {
  _id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // Tracks whether the initial getCurrentUser() session check has
  // resolved yet, so route guards / layout code can tell "not logged in"
  // apart from "haven't checked yet" on first paint.
  status: 'idle' | 'checking' | 'ready';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'ready';
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'ready';
    },
    // For profile-edit flows that only touch a subset of fields and don't
    // want to round-trip through login/getCurrentUser to update the store.
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    authCheckStarted(state) {
      state.status = 'checking';
    },
  },
});

export const { setCredentials, logout, updateUser, authCheckStarted } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;