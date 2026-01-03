import React, { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dispatch } from "../../../features/store";
import {
  logoutUser,
} from '../../../features/user/slice';

export const AccountSidebar = (props) => {
    const { currentUser, userFullName, lastLoginAt } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const isActiveMenuItem = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await dispatch(logoutUser());
            navigate('/login', {
                state: { message: 'You have been logged out successfully' }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
    };
    // Format last login date
    const formatLastLogin = (dateString) => {
        if (!dateString) return 'Recently';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString();
    };

    // Menu items configuration
    const menuItems = [
        {
            label: 'Dashboard',
            path: '/account/dashboard',
            icon: 'bx-tachometer',
            active: true,
        },
        {
            label: 'Orders',
            path: '/account/orders',
            icon: 'bx-cart-alt',
            badge: currentUser?.orderCount || 0,
        },
        {
            label: 'Addresses',
            path: '/account/addresses',
            icon: 'bx-home-smile',
        },
        {
            label: 'Payment Methods',
            path: '/account/payment-methods',
            icon: 'bx-credit-card',
        },
        {
            label: 'Account Details',
            path: '/account/details',
            icon: 'bx-user-circle',
        },
    ];

    return (
        <>
            <div className="col-lg-4">
                <div className="card shadow-none mb-3 mb-lg-0">
                    <div className="card-body">
                        {/* User Info Card */}
                        <div className="text-center mb-4 pb-4 border-bottom">
                            <div className="mb-3">
                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={userFullName}
                                        className="rounded-circle"
                                        width="80"
                                        height="80"
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                                        style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                                    >
                                        {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                                    </div>
                                )}
                            </div>
                            <h5 className="mb-1">{userFullName}</h5>
                            <p className="text-muted small mb-1">{currentUser.email}</p>
                            {lastLoginAt && (
                                <small className="text-muted">
                                    Last login: {formatLastLogin(lastLoginAt)}
                                </small>
                            )}
                        </div>

                        {/* Navigation Menu */}
                        <div className="list-group list-group-flush">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`list-group-item d-flex justify-content-between align-items-center ${isActiveMenuItem(item.path) ? 'active' : 'bg-transparent'
                                        }`}
                                >
                                    <span>
                                        {item.label}
                                        {item.badge > 0 && (
                                            <span className="badge bg-danger rounded-pill ms-2">
                                                {item.badge}
                                            </span>
                                        )}
                                    </span>
                                    <i className={`bx ${item.icon} fs-5`}></i>
                                </Link>
                            ))}

                            {/* Logout Button */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-danger"
                                style={{ cursor: 'pointer', border: 'none' }}
                            >
                                <span>Logout</span>
                                <i className='bx bx-log-out fs-5'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Logout</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowLogoutModal(false)}
                                    disabled={loggingOut}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowLogoutModal(false)}
                                    disabled={loggingOut}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <i className='bx bx-log-out me-2'></i>
                                            Logout
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AccountSidebar;