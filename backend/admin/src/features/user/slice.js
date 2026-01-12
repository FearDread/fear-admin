// features/users/userSlice.js
import { FeatureFactory, API } from '@feardread/feature-factory';
import UserService from "./service";
import Storage, { saveUserToStorage, clearUserStorage } from '../storage';


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

/**
 * Create the user feature factory
 */
const userFactory = FeatureFactory('users', userReducers);

export const { slice, asyncActions: User } = userFactory.create({
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

// Export all actions
export const {
  // Common reducers
  setData,
  setLoading,
  setSuccess,
  setError,
  clearError,
  resetState,
  updateMetadata,
  // Custom user reducers
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

// Export async actions
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

// Enhanced login thunk with token storage and persistence
export const loginUser = (credentials, rememberMe = false) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(login(credentials));
    
    if (login.fulfilled.match(result)) {
      const { token, user } = result.payload.data;
      
      // Calculate token expiry (default 7 days for remember me, 24 hours otherwise)
      const expiryHours = rememberMe ? 24 * 7 : 24;
      const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
      

      API.setAuth(token, user);
      Storage.save(user, token, rememberMe, expiresAt);
      
      // Update state
      dispatch(setToken(token));
      dispatch(setCurrentUser(user));
      dispatch(setRememberMe(rememberMe));
      dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));
      
      return { success: true, user };
    } else {
      throw new Error(result.error?.message || 'Login failed');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Enhanced logout thunk with storage cleanup
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    await dispatch(logout());
    
    // Clear auth from API utility
    API.clearAuth();
    
    // Clear persistent storage
    clearUserStorage();
    
    // Clear user state
    dispatch(clearCurrentUser());
    dispatch(clearToken());
    dispatch(setRememberMe(false));
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear local state and storage even if API call fails
    API.clearAuth();
    clearUserStorage();
    dispatch(clearCurrentUser());
    dispatch(clearToken());
    dispatch(setRememberMe(false));
    
    return { success: true };
  } finally {
    dispatch(setLoading(false));
  }
};

// Update profile with storage sync
export const updateUserProfileWithStorage = (updates) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(updateProfile(updates));
    
    if (updateProfile.fulfilled.match(result)) {
      const updatedUser = result.payload.data;
      
      // Update state
      dispatch(updateUserProfile(updatedUser));
      
      // Sync with storage
      const state = getState();
      const { token, rememberMe } = state.users;
      
      if (token && updatedUser) {
        const expiryHours = rememberMe ? 24 * 7 : 24;
        const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
        saveUserToStorage(updatedUser, token, rememberMe, expiresAt);
      }
      
      return { success: true, user: updatedUser };
    } else {
      throw new Error(result.error?.message || 'Profile update failed');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Register with auto-login and storage
export const registerUser = (userData, rememberMe = false) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(register(userData));
    
    if (register.fulfilled.match(result)) {
      const { token, user } = result.payload.data;
      
      // Calculate token expiry
      const expiryHours = rememberMe ? 24 * 7 : 24;
      const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
      
      // Store token in API utility
      API.setAuth(token, user);
      
      // Save to persistent storage
      saveUserToStorage(user, token, rememberMe, expiresAt);
      
      // Update state
      dispatch(setToken(token));
      dispatch(setCurrentUser(user));
      dispatch(setRememberMe(rememberMe));
      dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));
      
      return { success: true, user };
    } else {
      throw new Error(result.error?.message || 'Registration failed');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
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
export const selectUserFullName = (state) => {
  const user = state.users.currentUser;
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
};

export default slice;