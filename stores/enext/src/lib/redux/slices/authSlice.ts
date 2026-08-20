import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Placeholder — replace with the real shape once features/user/slice is converted.
export interface User {
  firstName?: string;
  [key: string]: unknown;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export default authSlice.reducer;