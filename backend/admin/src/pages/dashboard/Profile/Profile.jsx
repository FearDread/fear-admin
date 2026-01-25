import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  updateUserProfileWithStorage,
  updateAvatar,
  changePassword,
  clearError
} from '../../../features/user/slice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    website: '',
    address: '',
    city: '',
    state: '',
    avatar: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Initialize form data from current user
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        username: currentUser.username || '',
        website: currentUser.website || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        avatar: null
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(clearError());

    // Upload avatar if changed
    if (formData.avatar) {
      const avatarFormData = new FormData();
      avatarFormData.append('avatar', formData.avatar);
      await dispatch(updateAvatar(avatarFormData));
    }

    // Update profile
    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      state: formData.state
    };

    const result = await dispatch(updateUserProfileWithStorage(profileData));
    
    if (result.success) {
      alert('Profile updated successfully!');
      setAvatarPreview(null);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const result = await dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));

    if (result.payload?.success) {
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        username: currentUser.username || '',
        website: currentUser.website || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        avatar: null
      });
      setAvatarPreview(null);
    }
  };

  const getUserAvatar = () => {
    if (avatarPreview) return avatarPreview;
    return currentUser?.avatar || currentUser?.avatarUrl || 'https://via.placeholder.com/110x110';
  };

  const getUserFullName = () => {
    if (!currentUser) return 'Mark Stern';
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email || 'User';
  };

  const skills = currentUser?.skills || [
    { name: 'HTML5', percentage: 65, icon: 'assets/images/timeline/html5.svg' },
    { name: 'Bootstrap 4', percentage: 50, icon: 'assets/images/timeline/bootstrap-4.svg' },
    { name: 'AngularJS', percentage: 70, icon: 'assets/images/timeline/angular-icon.svg' },
    { name: 'React JS', percentage: 35, icon: 'assets/images/timeline/react.svg' }
  ];

  const recentActivities = currentUser?.recentActivities || [
    { user: 'Abby', action: 'joined ACME Project Team', context: 'Collaboration' },
    { user: 'Gary', action: 'deleted My Board1', context: 'Discussions' },
    { user: 'Kensington', action: 'deleted MyBoard3', context: 'Discussions' },
    { user: 'John', action: 'deleted My Board1', context: 'Discussions' },
    { user: 'Skell', action: 'deleted his post Look at Why this is..', context: 'Discussions' }
  ];

  const messages = currentUser?.messages || [
    { time: '3 hrs ago', content: 'Here is your a link to the latest summary report from the..' },
    { time: 'Yesterday', content: 'There has been a request on your account since that was..' },
    { time: '9/10', content: 'Porttitor vitae ultrices quis, dapibus id dolor. Morbi venenatis lacinia rhoncus.' },
    { time: '9/4', content: 'Vestibulum tincidunt ullamcorper eros eget luctus.' },
    { time: '9/4', content: 'Maxamillion ais the fix for tibulum tincidunt ullamcorper eros.' }
  ];

  const badges = currentUser?.badges || ['html5', 'react', 'codeply', 'angularjs', 'css3', 'jquery', 'bootstrap', 'responsive-design'];
  const stats = currentUser?.stats || { followers: 900, forks: 43, views: 245 };

  return (
    <div className="container-fluid">
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <button type="button" className="close" onClick={() => dispatch(clearError())}>&times;</button>
          <div className="alert-icon">
            <i className="icon-close"></i>
          </div>
          <div className="alert-message">
            <span><strong>Error!</strong> {error}</span>
          </div>
        </div>
      )}

      <div className="row mt-3">
        <div className="col-lg-4">
          <div className="card profile-card-2 media-object">
            <div className="card-img-block">
              <img className="img-fluid" src="https://via.placeholder.com/800x500" alt="Card image cap" />
            </div>
            <div className="card-body pt-5">
              <img src={getUserAvatar()} alt="profile-image" className="profile" />
              <h5 className="card-title">{getUserFullName()}</h5>
              <p className="card-text">
                {currentUser?.bio || 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'}
              </p>
              <div className="icon-block">
                {currentUser?.socialLinks?.facebook && (
                  <a href={currentUser.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-facebook bg-facebook text-white"></i>
                  </a>
                )}
                {currentUser?.socialLinks?.twitter && (
                  <a href={currentUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-twitter bg-twitter text-white"></i>
                  </a>
                )}
                {currentUser?.socialLinks?.googlePlus && (
                  <a href={currentUser.socialLinks.googlePlus} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-google-plus bg-google-plus text-white"></i>
                  </a>
                )}
              </div>
            </div>

            <div className="card-body border-top border-light">
              {skills.map((skill, index) => (
                <React.Fragment key={index}>
                  <div className="media align-items-center">
                    <div>
                      <img src={skill.icon} className="skill-img" alt="skill img" />
                    </div>
                    <div className="media-body text-left ml-3">
                      <div className="progress-wrapper">
                        <p>{skill.name} <span className="float-right">{skill.percentage}%</span></p>
                        <div className="progress" style={{ height: '5px' }}>
                          <div className="progress-bar" style={{ width: `${skill.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < skills.length - 1 && <hr />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card media-object">
            <div className="card-body">
              <ul className="nav nav-tabs nav-tabs-primary top-icon nav-justified">
                <li className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                 >
                    <i className="icon-user"></i> <span className="hidden-xs">Profile</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('messages'); }}
                    className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`}
                  >
                    <i className="icon-envelope-open"></i> <span className="hidden-xs">Messages</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('edit'); }}
                    className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  >
                    <i className="icon-note"></i> <span className="hidden-xs">Edit</span>
                  </a>
                </li>
              </ul>

              <div className="tab-content p-3">
                {/* Profile Tab */}
                <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`}>
                  <h5 className="mb-3">User Profile</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>About</h6>
                      <p>{currentUser?.about || 'Web Designer, UI/UX Engineer'}</p>
                      <h6>Hobbies</h6>
                      <p>{currentUser?.hobbies || 'Indie music, skiing and hiking. I love the great outdoors.'}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Recent badges</h6>
                      {badges.map((badge, index) => (
                        <a href="#" key={index} onClick={(e) => e.preventDefault()} className="badge badge-dark badge-pill">
                          {badge}
                        </a>
                      ))}
                      <hr />
                      <span className="badge badge-primary">
                        <i className="fa fa-user"></i> {stats.followers} Followers
                      </span>
                      <span className="badge badge-success">
                        <i className="fa fa-cog"></i> {stats.forks} Forks
                      </span>
                      <span className="badge badge-danger">
                        <i className="fa fa-eye"></i> {stats.views} Views
                      </span>
                    </div>
                    <div className="col-md-12">
                      <h5 className="mt-2 mb-3">
                        <span className="fa fa-clock-o ion-clock float-right"></span> Recent Activity
                      </h5>
                      <div className="table-responsive">
                        <table className="table table-hover table-striped">
                          <tbody>
                            {recentActivities.map((activity, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{activity.user}</strong> {activity.action} in <strong>`{activity.context}`</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Tab */}
                <div className={`tab-pane ${activeTab === 'messages' ? 'active' : ''}`}>
                  <div className="alert alert-info alert-dismissible" role="alert">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <div className="alert-icon">
                      <i className="icon-info"></i>
                    </div>
                    <div className="alert-message">
                      <span><strong>Info!</strong> Lorem Ipsum is simply dummy text.</span>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-striped">
                      <tbody>
                        {messages.map((message, index) => (
                          <tr key={index}>
                            <td>
                              <span className="float-right font-weight-bold">{message.time}</span> {message.content}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit Tab */}
                <div className={`tab-pane ${activeTab === 'edit' ? 'active' : ''}`}>
                  <form onSubmit={handleSaveChanges}>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">First name</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Last name</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Email</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Change profile</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={loading}
                        />
                        {avatarPreview && (
                          <img src={avatarPreview} alt="Avatar preview" className="mt-2" style={{ maxWidth: '100px', borderRadius: '50%' }} />
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Website</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Address</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label"></label>
                      <div className="col-lg-6">
                        <input
                          className="form-control"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          disabled={loading}
                        />
                      </div>
                      <div className="col-lg-3">
                        <input
                          className="form-control"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Username</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label"></label>
                      <div className="col-lg-9">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary ml-2"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </form>

                  <hr className="my-4" />

                  <h5 className="mb-3">Change Password</h5>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Current Password</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">New Password</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label">Confirm New Password</label>
                      <div className="col-lg-9">
                        <input
                          className="form-control"
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-3 col-form-label form-control-label"></label>
                      <div className="col-lg-9">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Updating...' : 'Update Password'}
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