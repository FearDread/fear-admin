import { ThunkFactory } from '@feardread/feature-factory';

export const UserService = {
  login:            ThunkFactory.custom('auth',     'login',           { method: 'POST' }),
  loginWithGoogle:  ThunkFactory.custom('auth',     'google',          { method: 'POST' }),
  loginWithFacebook:ThunkFactory.custom('auth',     'facebook',        { method: 'POST' }),
  register:         ThunkFactory.custom('auth',     'register',        { method: 'POST' }),
  logout:           ThunkFactory.custom('auth',     'logout',          { method: 'POST' }),
  forgotPassword:   ThunkFactory.custom('password', 'forgot-password', { method: 'GET'  }),
  resetPassword:    ThunkFactory.custom('password', 'reset-password',  { method: 'POST' }),
  verifyEmail:      ThunkFactory.custom('auth',     'verify-email',    { method: 'POST' }),
  getCurrentUser:   ThunkFactory.custom('users',    'me',              { method: 'GET'  }),
  updateProfile:    ThunkFactory.custom('users',    'profile',         { method: 'PUT'  }),
  changePassword:   ThunkFactory.custom('users',    'change-password', { method: 'POST' }),
  updateAvatar:     ThunkFactory.custom('users',    'avatar',          { method: 'POST' }),
};

export default UserService;