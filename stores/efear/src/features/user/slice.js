// features/users/userSlice.js
import { FeatureFactory, API } from '@feardread/feature-factory';
import UserService from "./service";


const userReducers = {
  // Set current user
  setCurrentUser: (state, action) => {
    state.currentUser = action.payload;
    state.isAuthenticated = !!action.payload;
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
  operations: {
    fetch: false,
    fetchOne: false,
    search: false,
    create: false,
    update: false,
    patch: false,
    delete: false,
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
  clearCurrentUser,
  setToken,
  clearToken,
  setRememberMe,
  updateUserProfile,
  setUserPreferences,
} = slice.actions;

// Export async actions
export const {
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
  updateAvatar,
} = User;

// Enhanced login thunk with token storage
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(login(credentials));
    
    if (login.fulfilled.match(result)) {
      const { token, user, rememberMe } = result.payload;
      
      // Store token in API utility
      API.setAuth(token, user);
      
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
  }
};

// Enhanced logout thunk
export const logoutUser = () => async (dispatch) => {
  try {
    await dispatch(logout());
    
    // Clear auth from API utility
    API.clearAuth();
    
    // Clear user state
    dispatch(clearCurrentUser());
    dispatch(clearToken());
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear local state even if API call fails
    API.clearAuth();
    dispatch(clearCurrentUser());
    dispatch(clearToken());
    
    return { success: true };
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
// Async operation status selectors
export const selectOperationStatus = (state, operation) => 
  state.users.async?.operations?.[operation] || {
    loading: false,
    success: false,
    error: null,
    lastRun: null,
  };

export const selectLoginStatus = (state) => selectOperationStatus(state, 'login');
export const selectRegisterStatus = (state) => selectOperationStatus(state, 'register');

export default slice;