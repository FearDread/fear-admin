import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectUserLoading,
    selectUserError,
    updateUserProfileWithStorage,
    changeUserPassword,
    fetchCurrentUser,
    clearError,
} from '../../../features/user/slice';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB — request body limit on the API is 10 MB, base64 adds ~33%
const MIN_PASSWORD_LENGTH = 8; // matches the User schema

const emptyProfile = {
    firstName: '',
    lastName: '',
    displayName: '',
    mobile: '',
    bio: '',
    website: '',
    city: '',
    state: '',
};

const emptyPasswords = { currentPassword: '', newPassword: '', confirmPassword: '' };

const profileFromUser = (user) => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    mobile: user?.mobile || '',
    bio: user?.bio || '',
    website: user?.website || '',
    city: user?.location?.city || '',
    state: user?.location?.state || '',
});

// avatar is { public_id, secure_url } on the model, but Google sign-in stores a plain URL string
const avatarUrlOf = (user) => {
    const a = user?.avatar;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.secure_url || a.url || '';
};

const initialsOf = (user) => {
    const first = user?.firstName?.[0] || user?.displayName?.[0] || user?.email?.[0] || '?';
    const last = user?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
};

const fullNameOf = (user) => {
    if (!user) return '';
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return name || user.displayName || user.email || 'User';
};

const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
};

const ProfilePage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);

    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState(emptyProfile);
    const [passwordData, setPasswordData] = useState(emptyPasswords);
    const [avatarPreview, setAvatarPreview] = useState(null); // data URL of a newly chosen image
    const [notice, setNotice] = useState(null); // { type: 'success' | 'danger', text }

    // Make sure we have a fresh copy of the account (the persisted one can be stale)
    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    // Fill the form whenever the stored user changes
    useEffect(() => {
        if (currentUser) setFormData(profileFromUser(currentUser));
    }, [currentUser]);

    const showNotice = useCallback((type, text) => setNotice({ type, text }), []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showNotice('danger', 'Choose an image file (PNG, JPG, GIF or WebP).');
            e.target.value = '';
            return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            showNotice('danger', 'That image is over 2 MB. Choose a smaller one.');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setNotice(null);
        dispatch(clearError());

        const updates = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            displayName: formData.displayName.trim(),
            mobile: formData.mobile.trim(),
            bio: formData.bio,
            website: formData.website.trim(),
            location: { city: formData.city.trim(), state: formData.state.trim() },
        };
        // Sent as a data URL; the API uploads it to Cloudinary and stores { public_id, secure_url }
        if (avatarPreview) updates.avatar = avatarPreview;

        const result = await dispatch(updateUserProfileWithStorage(updates));

        if (result.success) {
            setAvatarPreview(null);
            showNotice('success', 'Profile saved.');
            setActiveTab('profile');
        }
        // failures are already in the store's error state and shown in the alert at the top
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setNotice(null);
        dispatch(clearError());

        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword || !newPassword) {
            showNotice('danger', 'Enter your current password and a new one.');
            return;
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            showNotice('danger', `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            showNotice('danger', 'The new passwords do not match.');
            return;
        }
        if (newPassword === currentPassword) {
            showNotice('danger', 'Choose a password different from your current one.');
            return;
        }

        const result = await dispatch(changeUserPassword({ currentPassword, newPassword }));

        if (result.success) {
            setPasswordData(emptyPasswords);
            showNotice('success', 'Password updated.');
        } else {
            showNotice('danger', result.error);
        }
    };

    const handleCancel = () => {
        setFormData(currentUser ? profileFromUser(currentUser) : emptyProfile);
        setAvatarPreview(null);
        setNotice(null);
    };

    const avatarSrc = avatarPreview || avatarUrlOf(currentUser);
    const location = [currentUser?.location?.city, currentUser?.location?.state].filter(Boolean).join(', ');
    const memberSince = formatDate(currentUser?.createdAt);

    if (!currentUser) {
        return (
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-12">
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <p className="text-muted">{loading ? 'Loading your profile…' : 'Sign in to view your profile.'}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const renderAvatar = (size) =>
        avatarSrc ? (
            <img src={avatarSrc} alt={`${fullNameOf(currentUser)} avatar`} className="profile" />
        ) : (
            <div
                className="profile d-flex align-items-center justify-content-center bg-primary text-white"
                style={{ width: size, height: size, borderRadius: '50%', fontSize: size / 3, fontWeight: 600, margin: '0 auto' }}
                aria-label={`${fullNameOf(currentUser)} avatar`}
            >
                {initialsOf(currentUser)}
            </div>
        );

    return (
        <div className="container-fluid">
            {error && (
                <div className="alert alert-danger alert-dismissible mt-3" role="alert">
                    <button type="button" className="close" aria-label="Dismiss" onClick={() => dispatch(clearError())}>
                        &times;
                    </button>
                    <div className="alert-message">
                        <span>
                            <strong>Error:</strong> {error}
                        </span>
                    </div>
                </div>
            )}

            {notice && (
                <div className={`alert alert-${notice.type} alert-dismissible mt-3`} role="alert">
                    <button type="button" className="close" aria-label="Dismiss" onClick={() => setNotice(null)}>
                        &times;
                    </button>
                    <div className="alert-message">
                        <span>{notice.text}</span>
                    </div>
                </div>
            )}

            <div className="row mt-3">
                {/* Summary card */}
                <div className="col-lg-4">
                    <div className="card profile-card-2 media-object">
                        <div className="card-body pt-4 text-center">
                            {renderAvatar(110)}
                            <h5 className="card-title mt-3">{fullNameOf(currentUser)}</h5>
                            {currentUser.displayName && currentUser.displayName !== fullNameOf(currentUser) && (
                                <p className="text-muted mb-2">@{currentUser.displayName}</p>
                            )}
                            <p className="card-text">{currentUser.bio || 'No bio yet. Add one from the Edit tab.'}</p>
                        </div>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <i className="fa fa-envelope mr-2"></i>
                                {currentUser.email}{' '}
                                {currentUser.emailVerified ? (
                                    <span className="badge badge-success ml-1">Verified</span>
                                ) : (
                                    <span className="badge badge-warning ml-1">Not verified</span>
                                )}
                            </li>
                            {currentUser.mobile && (
                                <li className="list-group-item">
                                    <i className="fa fa-phone mr-2"></i>
                                    {currentUser.mobile}
                                </li>
                            )}
                            {location && (
                                <li className="list-group-item">
                                    <i className="fa fa-map-marker mr-2"></i>
                                    {location}
                                </li>
                            )}
                            {currentUser.website && (
                                <li className="list-group-item">
                                    <i className="fa fa-globe mr-2"></i>
                                    <a href={currentUser.website} target="_blank" rel="noopener noreferrer">
                                        {currentUser.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </li>
                            )}
                            {memberSince && (
                                <li className="list-group-item text-muted">
                                    <i className="fa fa-calendar mr-2"></i>
                                    Member since {memberSince}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Tabs */}
                <div className="col-lg-8">
                    <div className="card media-object">
                        <div className="card-body">
                            <ul className="nav nav-tabs nav-tabs-primary top-icon nav-justified">
                                {[
                                    ['profile', 'icon-user', 'Profile'],
                                    ['edit', 'icon-note', 'Edit profile'],
                                    ['security', 'icon-lock', 'Password'],
                                ].map(([key, icon, label]) => (
                                    <li className="nav-item" key={key}>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setNotice(null);
                                                setActiveTab(key);
                                            }}
                                            className={`nav-link ${activeTab === key ? 'active' : ''}`}
                                        >
                                            <i className={icon}></i> <span className="hidden-xs">{label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content p-3">
                                {/* Profile */}
                                <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`}>
                                    <h5 className="mb-3">About {currentUser.firstName || 'you'}</h5>
                                    <dl className="row">
                                        <dt className="col-sm-3">Name</dt>
                                        <dd className="col-sm-9">{fullNameOf(currentUser)}</dd>

                                        <dt className="col-sm-3">Display name</dt>
                                        <dd className="col-sm-9">{currentUser.displayName || '—'}</dd>

                                        <dt className="col-sm-3">Email</dt>
                                        <dd className="col-sm-9">{currentUser.email}</dd>

                                        <dt className="col-sm-3">Mobile</dt>
                                        <dd className="col-sm-9">{currentUser.mobile || '—'}</dd>

                                        <dt className="col-sm-3">Location</dt>
                                        <dd className="col-sm-9">{location || '—'}</dd>

                                        <dt className="col-sm-3">Website</dt>
                                        <dd className="col-sm-9">{currentUser.website || '—'}</dd>

                                        <dt className="col-sm-3">Bio</dt>
                                        <dd className="col-sm-9">{currentUser.bio || '—'}</dd>
                                    </dl>
                                    <button type="button" className="btn btn-primary" onClick={() => setActiveTab('edit')}>
                                        Edit profile
                                    </button>
                                </div>

                                {/* Edit */}
                                <div className={`tab-pane ${activeTab === 'edit' ? 'active' : ''}`}>
                                    <form onSubmit={handleSaveChanges}>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="firstName">
                                                First name
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="firstName" className="form-control" type="text" name="firstName"
                                                    value={formData.firstName} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="lastName">
                                                Last name
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="lastName" className="form-control" type="text" name="lastName"
                                                    value={formData.lastName} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="displayName">
                                                Display name
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="displayName" className="form-control" type="text" name="displayName"
                                                    value={formData.displayName} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="email">
                                                Email
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="email" className="form-control" type="email" value={currentUser.email || ''} readOnly disabled />
                                                <small className="form-text text-muted">Email is your sign-in and can't be changed here.</small>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="mobile">
                                                Mobile
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="mobile" className="form-control" type="tel" name="mobile"
                                                    value={formData.mobile} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="bio">
                                                Bio
                                            </label>
                                            <div className="col-lg-9">
                                                <textarea id="bio" className="form-control" rows="3" name="bio" maxLength={500}
                                                    value={formData.bio} onChange={handleInputChange} disabled={loading} />
                                                <small className="form-text text-muted">{formData.bio.length}/500</small>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="avatar">
                                                Profile photo
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="avatar" className="form-control" type="file" accept="image/*"
                                                    onChange={handleAvatarChange} disabled={loading} />
                                                <small className="form-text text-muted">PNG, JPG, GIF or WebP, up to 2 MB.</small>
                                                {avatarPreview && (
                                                    <img src={avatarPreview} alt="New avatar preview" className="mt-2"
                                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%' }} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="website">
                                                Website
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="website" className="form-control" type="url" name="website"
                                                    placeholder="https://" value={formData.website} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="city">
                                                Location
                                            </label>
                                            <div className="col-lg-6">
                                                <input id="city" className="form-control" type="text" name="city" placeholder="City"
                                                    value={formData.city} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                            <div className="col-lg-3">
                                                <input className="form-control" type="text" name="state" placeholder="State" aria-label="State"
                                                    value={formData.state} onChange={handleInputChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-lg-9 offset-lg-3">
                                                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ml-2" disabled={loading}>
                                                    {loading ? 'Saving…' : 'Save changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Password */}
                                <div className={`tab-pane ${activeTab === 'security' ? 'active' : ''}`}>
                                    <h5 className="mb-3">Change password</h5>
                                    <form onSubmit={handlePasswordUpdate} autoComplete="off">
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="currentPassword">
                                                Current password
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="currentPassword" className="form-control" type="password" name="currentPassword"
                                                    autoComplete="current-password" value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="newPassword">
                                                New password
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="newPassword" className="form-control" type="password" name="newPassword"
                                                    autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={passwordData.newPassword}
                                                    onChange={handlePasswordChange} disabled={loading} />
                                                <small className="form-text text-muted">At least {MIN_PASSWORD_LENGTH} characters.</small>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label" htmlFor="confirmPassword">
                                                Confirm new password
                                            </label>
                                            <div className="col-lg-9">
                                                <input id="confirmPassword" className="form-control" type="password" name="confirmPassword"
                                                    autoComplete="new-password" value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange} disabled={loading} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-lg-9 offset-lg-3">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                                    {loading ? 'Updating…' : 'Update password'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;