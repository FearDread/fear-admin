// features/users/userSlice.js
import { FeatureFactory, API } from '@feardread/feature-factory';
import UserService from "./service";
import Storage, { saveUserToStorage, clearUserStorage } from '../storage';

/**
 * The backend wraps results as { success, message, result: {...}, data: {...} }.
 * Depending on how ThunkFactory resolves, the thunk payload is either that whole
 * body or already the inner object, so accept both.
 */
const extractData = (payload) => payload?.data ?? payload?.result ?? payload ?? {};

const thunkError = (result, fallback) => {
    const p = result?.payload;
    if (typeof p === 'string' && p) return p;
    return p?.message || result?.error?.message || fallback;
};

const expiryFor = (rememberMe) =>
    new Date(Date.now() + (rememberMe ? 24 * 7 : 24) * 60 * 60 * 1000).toISOString();

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

    setViewMode: (state, action) => {
        state.viewMode = action.payload || 'list';
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
const userFactory = FeatureFactory('user', userReducers);

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
    setFilters,
    clearFilters,
    setSearchTerm,
    setSorting,
    setViewMode,
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
    fetch: fetchUsers,
    fetchOne: fetchUser,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    create: createUser,
    delete: deleteUser,
    update: updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getCurrentUser,
    updateProfile,
    updatePreferences,
    unlinkGoogle,
    changePassword,
} = User;

// Enhanced login thunk with token storage and persistence
export const loginUser = (credentials, rememberMe = false) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const result = await dispatch(login(credentials));

        if (login.fulfilled.match(result)) {
            const { token, user } = extractData(result.payload);
            const expiresAt = expiryFor(rememberMe);

            API.setAuth(token, user);
            Storage.save(user, token, rememberMe, expiresAt);

            // Update state
            dispatch(setToken(token));
            dispatch(setCurrentUser(user));
            dispatch(setRememberMe(rememberMe));
            dispatch(updateMetadata({ lastLoginAt: new Date().toISOString() }));

            return { success: true, user };
        } else {
            throw new Error(thunkError(result, 'Login failed'));
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
            const updatedUser = extractData(result.payload).user;

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
            throw new Error(thunkError(result, 'Profile update failed'));
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
            const { token, user } = extractData(result.payload);

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
            throw new Error(thunkError(result, 'Registration failed'));
        }
    } catch (error) {
        dispatch(setError(error.message));
        return { success: false, error: error.message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Load the signed-in user from the server (GET /auth/me) and sync the store
export const fetchCurrentUser = () => async (dispatch) => {
    const result = await dispatch(getCurrentUser());

    if (getCurrentUser.fulfilled.match(result)) {
        const user = extractData(result.payload).user;
        if (user) dispatch(setCurrentUser(user));
        return { success: true, user };
    }
    return { success: false, error: thunkError(result, 'Could not load your account') };
};

// Change password (PUT /password/update-password)
export const changeUserPassword = ({ currentPassword, newPassword }) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const result = await dispatch(changePassword({ currentPassword, newPassword }));

        if (changePassword.fulfilled.match(result)) {
            return { success: true, message: result.payload?.message || 'Password updated' };
        }
        return { success: false, error: thunkError(result, 'Could not update password') };
    } finally {
        dispatch(setLoading(false));
    }
};

// Save preferences (PUT /auth/update-preferences) and mirror them onto currentUser
export const saveUserPreferences = (prefs) => async (dispatch) => {
    const result = await dispatch(updatePreferences(prefs));

    if (updatePreferences.fulfilled.match(result)) {
        const preferences = extractData(result.payload).preferences;
        if (preferences) dispatch(updateUserProfile({ preferences }));
        return { success: true, preferences };
    }
    return { success: false, error: thunkError(result, 'Could not save preferences') };
};

// Disconnect Google (DELETE /auth/google/unlink)
export const unlinkGoogleAccount = () => async (dispatch) => {
    const result = await dispatch(unlinkGoogle());

    if (unlinkGoogle.fulfilled.match(result)) {
        const user = extractData(result.payload).user;
        if (user) dispatch(setCurrentUser(user));
        return { success: true };
    }
    return { success: false, error: thunkError(result, 'Could not disconnect Google') };
};

// Export selectors
export const selectAllUsers = (state) => state.users.data;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectIsAuthenticated = (state) => state.users.isAuthenticated;
export const selectUserToken = (state) => state.users.token;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserError = (state) => state.users.error;
export const selectFilters = (state) => state.users.filtering?.filters || {};
export const selectSearchTerm = (state) => state.users.filtering?.searchTerm || '';
export const selectUserSuccess = (state) => state.users.success;
export const selectRememberMe = (state) => state.users.rememberMe;
export const selectUserPreferences = (state) => state.users.preferences;
export const selectLastLoginAt = (state) => state.users.lastLoginAt;
export const selectUserFullName = (state) => {
    const user = state.users.currentUser;
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
};
export const selectViewMode = (state) => state.users.viewMode || 'list';


export default slice;