import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  selectCurrentUser, 
  selectIsAuthenticated,
  selectUserFullName,
  logoutUser,
  setUserPreferences,
  selectUserPreferences
} from '../../features/user/slice';

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userFullName = useSelector(selectUserFullName);
  const preferences = useSelector(selectUserPreferences);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const userProfileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messagesRef.current && !messagesRef.current.contains(event.target) &&
        notificationsRef.current && !notificationsRef.current.contains(event.target) &&
        languageRef.current && !languageRef.current.contains(event.target) &&
        userProfileRef.current && !userProfileRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleLogout = async () => {
    closeDropdown();
    const result = await dispatch(logoutUser());
    if (result.success) {
      navigate('/auth/login');
    }
  };

  const handleLanguageChange = (language) => {
    dispatch(setUserPreferences({ language }));
    closeDropdown();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const getUserAvatar = () => {
    const tempAvatar = '/assets/images/avatars/avatar-1.png';
    //return currentUser?.avatar ? currentUser?.avatar.secure_url : '/assets/images/avatars/avatar-1.png';
    return tempAvatar;
  };

  const getUserEmail = () => {
    return currentUser?.email || 'user@example.com';
  };

  return (
    <>
      <header className="topbar-nav">
        <nav className="navbar navbar-expand fixed-top">
          <ul className="navbar-nav mr-auto align-items-center">
            <li className="nav-item">
              <button 
                className="nav-link toggle-menu btn btn-link" 
                onClick={onToggleSidebar}
                type="button"
              >
                <i className="icon-menu menu-icon"></i>
              </button>
            </li>
            <li className="nav-item">
              <form className="search-bar" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-link btn-search-mag">
                  <i className="icon-magnifier"></i>
                </button>
              </form>
            </li>
          </ul>
          
          <ul className="navbar-nav align-items-center right-nav-link">
            {/* Messages Dropdown */}
            <li className={`nav-item dropdown-lg ${activeDropdown === 'messages' ? 'show' : ''}`} ref={messagesRef}>
              <button
                className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect btn btn-link"
                onClick={() => toggleDropdown('messages')}
                type="button"
              >
                <i className="fa fa-envelope-open-o"></i>
                <span className="badge badge-pill badge-primary">3</span>
              </button>
              <div className={`dropdown-menu dropdown-menu-right ${activeDropdown === 'messages' ? 'show' : ''}`}>
                <div className="dropdown-header">
                  <h6 className="mb-0">Messages</h6>
                  <span className="badge badge-primary">3 New</span>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/messages/1" className="dropdown-item" onClick={closeDropdown}>
                  <div className="media">
                    <img src="https://via.placeholder.com/40x40" className="mr-3 rounded-circle" alt="user" />
                    <div className="media-body">
                      <h6 className="mt-0">John Doe</h6>
                      <p className="mb-0 text-muted">New message received...</p>
                    </div>
                  </div>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/messages" className="dropdown-item text-center" onClick={closeDropdown}>
                  View All Messages
                </Link>
              </div>
            </li>
            
            {/* Notifications Dropdown */}
            <li className={`nav-item dropdown-lg ${activeDropdown === 'notifications' ? 'show' : ''}`} ref={notificationsRef}>
              <button
                className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect btn btn-link"
                onClick={() => toggleDropdown('notifications')}
                type="button"
              >
                <i className="fa fa-bell-o"></i>
                <span className="badge badge-pill badge-danger">5</span>
              </button>
              <div className={`dropdown-menu dropdown-menu-right ${activeDropdown === 'notifications' ? 'show' : ''}`}>
                <div className="dropdown-header">
                  <h6 className="mb-0">Notifications</h6>
                  <span className="badge badge-danger">5 New</span>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/notifications/1" className="dropdown-item" onClick={closeDropdown}>
                  <div className="media">
                    <i className="fa fa-info-circle text-info mr-3"></i>
                    <div className="media-body">
                      <h6 className="mt-0">System Update</h6>
                      <p className="mb-0 text-muted">New version available</p>
                    </div>
                  </div>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/notifications" className="dropdown-item text-center" onClick={closeDropdown}>
                  View All Notifications
                </Link>
              </div>
            </li>
            
            {/* Language Dropdown */}
            <li className={`nav-item language ${activeDropdown === 'language' ? 'show' : ''}`} ref={languageRef}>
              <button
                className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect btn btn-link"
                onClick={() => toggleDropdown('language')}
                type="button"
              >
                <i className="fa fa-flag"></i>
              </button>
              <ul className={`dropdown-menu dropdown-menu-right ${activeDropdown === 'language' ? 'show' : ''}`}>
                <li 
                  className={`dropdown-item ${preferences.language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                  role="button"
                >
                  <i className="flag-icon flag-icon-gb mr-2"></i> English
                </li>
                <li 
                  className={`dropdown-item ${preferences.language === 'fr' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('fr')}
                  role="button"
                >
                  <i className="flag-icon flag-icon-fr mr-2"></i> French
                </li>
                <li 
                  className={`dropdown-item ${preferences.language === 'cn' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('cn')}
                  role="button"
                >
                  <i className="flag-icon flag-icon-cn mr-2"></i> Chinese
                </li>
                <li 
                  className={`dropdown-item ${preferences.language === 'de' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('de')}
                  role="button"
                >
                  <i className="flag-icon flag-icon-de mr-2"></i> German
                </li>
              </ul>
            </li>
            
            {/* User Profile Dropdown */}
            {isAuthenticated ? (
              <li className={`nav-item ${activeDropdown === 'userProfile' ? 'show' : ''}`} ref={userProfileRef}>
                <button
                  className="nav-link dropdown-toggle dropdown-toggle-nocaret btn btn-link"
                  onClick={() => toggleDropdown('userProfile')}
                  type="button"
                >
                  <span className="user-profile">
                    <img 
                      src={getUserAvatar()} 
                      className="img-circle" 
                      alt="user avatar" 
                    />
                  </span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-right ${activeDropdown === 'userProfile' ? 'show' : ''}`}>
                  <li className="dropdown-item user-details">
                    <Link to="/admin/profile" onClick={closeDropdown}>
                      <div className="media">
                        <div className="avatar">
                          <img 
                            className="align-self-start mr-3" 
                            src={getUserAvatar()} 
                            alt="user avatar" 
                          />
                        </div>
                        <div className="media-body">
                          <h6 className="mt-2 user-title">{userFullName}</h6>
                          <p className="user-subtitle">{getUserEmail()}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li className="dropdown-item">
                    <NavLink to="/inbox" onClick={closeDropdown}>
                      <i className="icon-envelope mr-2"></i> Inbox
                    </NavLink>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li className="dropdown-item">
                    <NavLink to="/account" onClick={closeDropdown}>
                      <i className="icon-wallet mr-2"></i> Account
                    </NavLink>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li className="dropdown-item">
                    <NavLink to="/settings" onClick={closeDropdown}>
                      <i className="icon-settings mr-2"></i> Settings
                    </NavLink>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li className="dropdown-item">
                    <button 
                      className="btn btn-link text-left w-100 p-0" 
                      onClick={handleLogout}
                      type="button"
                    >
                      <i className="icon-power mr-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/auth/login" className="nav-link">
                  <i className="icon-login mr-2"></i> Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;