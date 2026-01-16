import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
  updateUserProfileWithStorage,
  changePassword,
  logoutUser,
  clearError,
  setSuccess,
} from '../../features/user/slice';
import AccountSidebar from "./components/AccountSidebar";


export const UserDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName.trim(),
        lastName: currentUser.lastName.trim(),
        displayName: currentUser.displayName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(setSuccess(false));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    const updates = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: formData.displayName,
      email: formData.email,
    };

    const result = await dispatch(updateUserProfileWithStorage(updates));

    if (result.success) {
      dispatch(setSuccess(true));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    const passwordUpdate = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    const result = await dispatch(changePassword(passwordUpdate));

    if (changePassword.fulfilled.match(result)) {
      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditingPassword(false);
      dispatch(setSuccess(true));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await dispatch(logoutUser());
      navigate('/login');
    }
  };

  const sidebarProps = {
    currentUser,
  }

  if (!currentUser) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-4">
        <div className="container">
          <h3 className="d-none">Account</h3>

          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
              <i className='bx bx-check-circle me-2'></i>
              Changes saved successfully!
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => dispatch(setSuccess(false))}
              ></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              <i className='bx bx-error-circle me-2'></i>
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => dispatch(clearError())}
              ></button>
            </div>
          )}

          <div className="card-body bg-dark-2 media-object">
            <div className="card-body">
              <div className="row">

                <AccountSidebar {...sidebarProps} />

                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      {/* Profile Form */}
                      <form onSubmit={handleSubmitProfile} className="row g-3 mb-4">
                        <div className="col-12">
                          <h5 className="mb-3">Profile Information</h5>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          {validationErrors.firstName && (
                            <div className="invalid-feedback">{validationErrors.firstName}</div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          {validationErrors.lastName && (
                            <div className="invalid-feedback">{validationErrors.lastName}</div>
                          )}
                        </div>

                        <div className="col-12">
                          <label className="form-label">Display Name</label>
                          <input
                            type="text"
                            name="displayName"
                            className="form-control"
                            value={formData.displayName}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="This will be how your name is displayed"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          {validationErrors.email && (
                            <div className="invalid-feedback">{validationErrors.email}</div>
                          )}
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-dark btn-ecomm"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              'Save Profile Changes'
                            )}
                          </button>
                        </div>
                      </form>

                      <hr className="my-4" />

                      {/* Password Change Section */}
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Password</h5>
                            {!isEditingPassword && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => setIsEditingPassword(true)}
                              >
                                Change Password
                              </button>
                            )}
                          </div>
                        </div>

                        {isEditingPassword ? (
                          <form onSubmit={handleSubmitPassword} className="row g-3">
                            <div className="col-12">
                              <label className="form-label">Current Password *</label>
                              <div className="input-group">
                                <input
                                  type={showPasswords.current ? 'text' : 'password'}
                                  name="currentPassword"
                                  className={`form-control ${validationErrors.currentPassword ? 'is-invalid' : ''}`}
                                  value={passwordData.currentPassword}
                                  onChange={handlePasswordChange}
                                  disabled={loading}
                                  placeholder="Enter current password"
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => togglePasswordVisibility('current')}
                                >
                                  <i className={`bx ${showPasswords.current ? 'bx-hide' : 'bx-show'}`}></i>
                                </button>
                                {validationErrors.currentPassword && (
                                  <div className="invalid-feedback">{validationErrors.currentPassword}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-12">
                              <label className="form-label">New Password *</label>
                              <div className="input-group">
                                <input
                                  type={showPasswords.new ? 'text' : 'password'}
                                  name="newPassword"
                                  className={`form-control ${validationErrors.newPassword ? 'is-invalid' : ''}`}
                                  value={passwordData.newPassword}
                                  onChange={handlePasswordChange}
                                  disabled={loading}
                                  placeholder="Enter new password"
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => togglePasswordVisibility('new')}
                                >
                                  <i className={`bx ${showPasswords.new ? 'bx-hide' : 'bx-show'}`}></i>
                                </button>
                                {validationErrors.newPassword && (
                                  <div className="invalid-feedback">{validationErrors.newPassword}</div>
                                )}
                              </div>
                              <small className="text-muted">
                                Must be at least 8 characters with uppercase, lowercase, and numbers
                              </small>
                            </div>

                            <div className="col-12">
                              <label className="form-label">Confirm New Password *</label>
                              <div className="input-group">
                                <input
                                  type={showPasswords.confirm ? 'text' : 'password'}
                                  name="confirmPassword"
                                  className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                  value={passwordData.confirmPassword}
                                  onChange={handlePasswordChange}
                                  disabled={loading}
                                  placeholder="Confirm new password"
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => togglePasswordVisibility('confirm')}
                                >
                                  <i className={`bx ${showPasswords.confirm ? 'bx-hide' : 'bx-show'}`}></i>
                                </button>
                                {validationErrors.confirmPassword && (
                                  <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="d-flex gap-2">
                                <button
                                  type="submit"
                                  className="btn btn-dark btn-ecomm"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2"></span>
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Password'
                                  )}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-light btn-ecomm"
                                  onClick={() => {
                                    setIsEditingPassword(false);
                                    setPasswordData({
                                      currentPassword: '',
                                      newPassword: '',
                                      confirmPassword: '',
                                    });
                                    setValidationErrors({});
                                  }}
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="col-12">
                            <p className="text-muted mb-0">
                              <i className='bx bx-lock-alt me-2'></i>
                              Your password is encrypted and secure
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDetails;