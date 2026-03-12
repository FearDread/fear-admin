// features/users/userSlice.js
import { FeatureFactory, API } from '@feardread/feature-factory';
import UserService from "./service";
import Storage, { saveUserToStorage, clearUserStorage } from '../storage';
import { sendRegister } from '../mail/slice';

const userReducers = {
  // Set current user
  setCurrentUser: (state, action) => {
    state.currentUser = action.payload;
    state.isAuthenticated = !!action.payload;
  },

  setIsAuthenticated: (state, action) => {
    state.isAuthenticated = action.payload;
  },

  // Clear current user (logout)
  clearCurrentUser: (state) => {
    state.currentUser = null;
    state.isAuthenticated = false;
    state.token = null;
  },

  // Set authentication token
  setToken: (state, action) => {
    state.token = action.payload;
  },

  // Clear token
  clearToken: (state) => {
    state.token = null;
  },

  // Set remember me preference
  setRememberMe: (state, action) => {
    state.rememberMe = action.payload;
  },

  // Update user profile
  updateUserProfile: (state, action) => {
    if (state.currentUser) {
      state.currentUser = { ...state.currentUser, ...action.payload };
    }
  },

  // Set user preferences
  setUserPreferences: (state, action) => {
    state.preferences = { ...state.preferences, ...action.payload };
  },

  // Restore user from storage
  restoreUser: (state, action) => {
    const { currentUser, token, isAuthenticated, rememberMe } = action.payload;
    state.currentUser = currentUser;
    state.token = token;
    state.isAuthenticated = isAuthenticated;
    state.rememberMe = rememberMe;
  },
};

export const { slice, asyncActions: User } = FeatureFactory('users', userReducers).create({
  service: UserService,
  stateOptions: {
    includeEntityState: true,
    includeMetadata: true,
    customFields: {
      currentUser: null,
      isAuthenticated: false,
      token: null,
      rememberMe: false,
      preferences: {
        language: 'en',
        notifications: true,
      },
      loginAttempts: 0,
      lastLoginAt: null,
    },
  },
  includeCommonReducers: true,
});

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

export const {
  fetchOne: fetchUser,
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

export const loginUser = (credentials, rememberMe = false) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(login(credentials))
    .then((result) => {
      if (login.fulfilled.match(result)) {
        const { token, user } = result.payload.data;

        const expiryHours = rememberMe ? 24 * 7 : 24;
        const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

        API.setAuth(token, user);
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

// Enhanced logout thunk with storage cleanup
export const logoutUser = () => (dispatch) => {
  dispatch(setLoading(true));

  const clearLocalState = () => {
    API.clearAuth();
    clearUserStorage();
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
      clearLocalState();
      return { success: true };
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

// Update profile with storage sync
export const updateUserProfileWithStorage = (updates) => (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(updateProfile(updates))
    .then((result) => {
      if (updateProfile.fulfilled.match(result)) {
        const updatedUser = result.payload.data;

        dispatch(updateUserProfile(updatedUser));

        const { token, rememberMe } = getState().users;

        if (token && updatedUser) {
          const expiryHours = rememberMe ? 24 * 7 : 24;
          const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
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

// Register with auto-login and storage
export const registerUser = (userData, rememberMe = false) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  return dispatch(register(userData))
    .then((result) => {
      const { token, user } = result.payload.data;

      const expiryHours = rememberMe ? 24 * 7 : 24;
      const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

      API.setAuth(token, user);
      saveUserToStorage(user, token, rememberMe, expiresAt);

      dispatch(setToken(token));
      dispatch(setCurrentUser(user));
      dispatch(setRememberMe(rememberMe));
      dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));

      dispatch(sendRegister({
        $email: userData.email,
        name: userData.firstName + ' ' + userData.lastName,
        data: user
      }));

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
// Export selectors
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectIsAuthenticated = (state) => state.users.isAuthenticated;
export const selectUserToken = (state) => state.users.token;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserError = (state) => state.users.error;
export const selectUserSuccess = (state) => state.users.success;
export const selectRememberMe = (state) => state.users.rememberMe;
export const selectUserPreferences = (state) => state.users.preferences;
export const selectLastLoginAt = (state) => state.users.lastLoginAt;

export default slice;