/**
 * features/user/slice.js  —  React Native version
 *
 * Converted from the original FeatureFactory-based web slice.
 * All FeatureFactory / ThunkFactory usage is preserved exactly.
 *
 * React Native delta (vs web version):
 *   ✦ Storage  → our AsyncStorage-backed storage.js (same call signatures)
 *   ✦ API      → @feardread/feature-factory API singleton (unchanged;
 *                its CacheFactory auto-uses memory fallback in RN, which is
 *                correct — our Storage layer handles AsyncStorage persistence)
 *   ✦ sendRegister dispatch in registerUser thunk is preserved as-is
 *   ✦ No other changes — FeatureFactory, ThunkFactory, and all thunk logic
 *     are platform-agnostic
 */

import { FeatureFactory } from '@feardread/feature-factory';
import UserService              from './service';
import Storage, { saveUserToStorage, clearUserStorage } from '../storage';
import { sendRegister }         from '../mail/slice';

// ── Sync reducers (passed to FeatureFactory) ──────────────────────────────────
const userReducers = {
  setCurrentUser(state, action) {
    state.currentUser     = action.payload;
    state.isAuthenticated = !!action.payload;
  },

  setIsAuthenticated(state, action) {
    state.isAuthenticated = action.payload;
  },

  clearCurrentUser(state) {
    state.currentUser     = null;
    state.isAuthenticated = false;
    state.token           = null;
  },

  setToken(state, action) {
    state.token = action.payload;
  },

  clearToken(state) {
    state.token = null;
  },

  setRememberMe(state, action) {
    state.rememberMe = action.payload;
  },

  updateUserProfile(state, action) {
    if (state.currentUser) {
      state.currentUser = { ...state.currentUser, ...action.payload };
    }
  },

  setUserPreferences(state, action) {
    state.preferences = { ...state.preferences, ...action.payload };
  },

  /**
   * Called by store.js on cold-start:
   *   store.dispatch(restoreUser(storedAuth))
   * storedAuth shape from Storage.load():
   *   { currentUser, token, isAuthenticated, rememberMe, expiresAt }
   */
  restoreUser(state, action) {
    const { currentUser, token, isAuthenticated, rememberMe } = action.payload;
    state.currentUser     = currentUser;
    state.token           = token;
    state.isAuthenticated = isAuthenticated;
    state.rememberMe      = rememberMe;
  },
};

// ── FeatureFactory — creates the slice + async actions ────────────────────────
export const { slice, asyncActions: User } = FeatureFactory('users', userReducers).create({
  service: UserService,
  stateOptions: {
    includeEntityState: true,
    includeMetadata:    true,
    customFields: {
      currentUser:     null,
      isAuthenticated: false,
      token:           null,
      rememberMe:      false,
      preferences: {
        language:      'en',
        notifications: true,
      },
      loginAttempts: 0,
      lastLoginAt:   null,
    },
  },
  includeCommonReducers: true,
});

// ── Named action exports ───────────────────────────────────────────────────────
export const {
  setData,
  setLoading,
  setSuccess,
  setError,
  clearError,
  resetState,
  updateMetadata,
  setCurrentUser,
  setIsAuthenticated,
  clearCurrentUser,
  setToken,
  clearToken,
  setRememberMe,
  updateUserProfile,
  setUserPreferences,
  restoreUser,
} = slice.actions;

// ── Async action exports (from UserService via ThunkFactory) ──────────────────
export const {
  fetchOne:        fetchUser,
  login,
  loginWithGoogle,
  loginWithFacebook,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  changePassword,
  updateUser,
  updateAvatar,
} = User;

// ── Thunk: loginUser ───────────────────────────────────────────────────────────
/**
 * Full login flow:
 *   1. Calls POST /auth/login via ThunkFactory
 *   2. On success: sets API auth headers, persists session to AsyncStorage,
 *      updates Redux state
 *   3. On failure: sets error in Redux state
 */
export const loginUser = (credentials, rememberMe = false) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(login(credentials))
    .then((result) => {
      if (login.fulfilled.match(result)) {
        const { token, user } = result.payload.data;

        const expiryHours = rememberMe ? 24 * 7 : 24;
        const expiresAt   = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

        // API.setAuth stores in the package's in-memory cache (no-op for RN
        // persistence, but keeps FeatureFactory's auth header injection working)
        //API.setAuth(token, user);

        // Storage.save writes to AsyncStorage for cross-restart persistence
        Storage.save(user, token, rememberMe, expiresAt);

        dispatch(setToken(token));
        dispatch(setCurrentUser(user));
        dispatch(setRememberMe(rememberMe));
        dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));

        return { success: true, user };
      } else {
        throw new Error(result.error?.message || 'Login failed');
      }
    })
    .catch((error) => {
      dispatch(setError(error.message));
      return { success: false, error: error.message };
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

// ── Thunk: logoutUser ──────────────────────────────────────────────────────────
export const logoutUser = () => (dispatch) => {
  dispatch(setLoading(true));

  const clearLocalState = () => {
    //API.clearAuth();
    clearUserStorage();          // wipes AsyncStorage
    dispatch(clearCurrentUser());
    dispatch(clearToken());
    dispatch(setRememberMe(false));
  };

  return dispatch(logout())
    .then(() => {
      clearLocalState();
      return { success: true };
    })
    .catch((error) => {
      console.error('Logout error:', error);
      // Always clear local state even if server call fails
      clearLocalState();
      return { success: true };
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

// ── Thunk: updateUserProfileWithStorage ───────────────────────────────────────
export const updateUserProfileWithStorage = (updates) => (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(updateProfile(updates))
    .then((result) => {
      if (updateProfile.fulfilled.match(result)) {
        const updatedUser          = result.payload.data;
        const { token, rememberMe } = getState().users;

        dispatch(updateUserProfile(updatedUser));

        if (token && updatedUser) {
          const expiryHours = rememberMe ? 24 * 7 : 24;
          const expiresAt   = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
          saveUserToStorage(updatedUser, token, rememberMe, expiresAt);
        }

        return { success: true, user: updatedUser };
      } else {
        throw new Error(result.error?.message || 'Profile update failed');
      }
    })
    .catch((error) => {
      dispatch(setError(error.message));
      return { success: false, error: error.message };
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

// ── Thunk: registerUser ────────────────────────────────────────────────────────
export const registerUser = (userData, rememberMe = false) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(register(userData))
    .then((result) => {
      const { token, user } = result.payload.data;

      const expiryHours = rememberMe ? 24 * 7 : 24;
      const expiresAt   = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

      //API.setAuth(token, user);
      saveUserToStorage(user, token, rememberMe, expiresAt);

      dispatch(setToken(token));
      dispatch(setCurrentUser(user));
      dispatch(setRememberMe(rememberMe));
      dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));

      // Trigger welcome email via mail slice
      dispatch(sendRegister({ $email: userData.email, data: userData }));

      return { success: true, user };
    })
    .catch((error) => {
      dispatch(setError(error.message));
      return { success: false, error: error.message };
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectCurrentUser     = (state) => state.users.currentUser;
export const selectIsAuthenticated = (state) => state.users.isAuthenticated;
export const selectUserToken       = (state) => state.users.token;
export const selectUserLoading     = (state) => state.users.loading;
export const selectUserError       = (state) => state.users.error;
export const selectUserSuccess     = (state) => state.users.success;
export const selectRememberMe      = (state) => state.users.rememberMe;
export const selectUserPreferences = (state) => state.users.preferences;
export const selectLastLoginAt     = (state) => state.users.lastLoginAt;

export default slice;