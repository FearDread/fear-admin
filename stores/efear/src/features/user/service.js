import { ThunkFactory } from '@feardread/feature-factory';

export const UserService = {
  // Login with email and password
  login: ThunkFactory.custom('auth', 'login', {
    method: 'POST',
  }),
  
  // Login with Google
  loginWithGoogle: ThunkFactory.custom('auth', 'google', {
    method: 'POST',
  }),
  
  // Login with Facebook
  loginWithFacebook: ThunkFactory.custom('auth', 'facebook', {
    method: 'POST',
  }),
  
  // Register new user
  register: ThunkFactory.custom('auth', 'register', {
    method: 'POST',
  }),
  
  // Logout
  logout: ThunkFactory.custom('auth', 'logout', {
    method: 'POST',
  }),
  
  // Forgot password
  forgotPassword: ThunkFactory.custom('password', 'forgot-password', {
    method: 'GET',
  }),
  
  // Reset password
  resetPassword: ThunkFactory.custom('password', 'reset-password', {
    method: 'POST',
  }),
  
  // Verify email
  verifyEmail: ThunkFactory.custom('auth', 'verify-email', {
    method: 'POST',
  }),
  
  // Get current user profile
  getCurrentUser: ThunkFactory.custom('users', 'me', {
    method: 'GET',
  }),
  
  // Update user profile
  updateProfile: ThunkFactory.custom('users', 'profile', {
    method: 'PUT',
  }),
  
  // Change password
  changePassword: ThunkFactory.custom('users', 'change-password', {
    method: 'POST',
  }),
  
  // Update avatar
  updateAvatar: ThunkFactory.custom('users', 'avatar', {
    method: 'POST',
  }),
};

export default UserService;