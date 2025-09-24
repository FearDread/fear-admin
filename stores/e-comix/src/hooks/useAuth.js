// hooks/useAuth.js - Custom hook for auth operations
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../auth/authCache';
import { User } from '../features/user/slice';


export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user.data.user);

  // Initialize auth state from cache
  useEffect(() => {
    const initAuth = async () => {
      if (!userState) {
        const authData = await authUtils.getAuth();
        if (authData?.user) {
          dispatch(User.setUser(authData));
        }
      }
    };

    initAuth();
  }, [dispatch, userState]);

  const logout = async () => {
    setLoading(true);
    try {
      // Clear cache
      await authUtils.clearAuth();
      
      // Clear Redux state
      dispatch(User.clearUser());
      
      // Navigate to login
      navigate('/login', { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    return await authUtils.isAuthenticated();
  };

  return {
    user: userState,
    loading,
    logout,
    checkAuthStatus,
    isAuthenticated: !!userState
  };
};