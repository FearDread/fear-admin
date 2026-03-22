import React, { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dispatch } from "../../../features/store";
import { logoutUser } from '../../../features/user/slice';
import { T, sidebarStyles } from "../styles";


const MENU_ITEMS = [
    { label: 'Dashboard',       path: '/account/dashboard',       icon: '⊞' },
    { label: 'Orders',          path: '/account/orders',          icon: '📦' },
    { label: 'Addresses',       path: '/account/addresses',       icon: '📍' },
    { label: 'Payment Methods', path: '/account/payment-methods', icon: '💳' },
    { label: 'Account Details', path: '/account/details',         icon: '👤' },
];

export const AccountSidebar = ({ currentUser, userFullName, lastLoginAt }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut]           = useState(false);

    const isActive = (path) => location.pathname === path;

    const formatLastLogin = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now  = new Date();
        const diffMs    = now - date;
        const diffMins  = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays  = Math.floor(diffMs / 86400000);
        if (diffMins  < 1)  return 'Just now';
        if (diffMins  < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays  < 7)  return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await dispatch(logoutUser());
            navigate('/login', { state: { message: 'You have been logged out successfully' } });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const hasAvatar = currentUser?.avatar && currentUser.avatar.secure_url !== '';

    return (
        <>
            <style>{sidebarStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="accsb-wrap">

                {/* ── Profile section ── */}
                <div className="accsb-profile">
                    <div className="accsb-avatar-ring">
                        {hasAvatar ? (
                            <img
                                className="accsb-avatar-img"
                                src={currentUser.avatar.secure_url}
                                alt={userFullName}
                            />
                        ) : (
                            <div className="accsb-avatar-initials">
                                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                            </div>
                        )}
                        <div className="accsb-online-dot" title="Online" />
                    </div>

                    <h2 className="accsb-name">{userFullName}</h2>
                    <p className="accsb-email">{currentUser?.email}</p>
                    {lastLoginAt && (
                        <div className="accsb-login-badge">
                            <span>●</span> Last login: {formatLastLogin(lastLoginAt)}
                        </div>
                    )}
                </div>

                {/* ── Navigation ── */}
                <nav className="accsb-nav">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`accsb-nav-item${isActive(item.path) ? ' active' : ''}`}
                        >
                            <span className="accsb-nav-left">
                                <span className="accsb-nav-icon">{item.icon}</span>
                                {item.label}
                                {item.badge > 0 && (
                                    <span className="accsb-nav-badge">{item.badge}</span>
                                )}
                            </span>
                            <span className="accsb-nav-arrow">→</span>
                        </Link>
                    ))}

                    <div className="accsb-nav-divider" />

                    <button
                        className="accsb-logout"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                            <span className="accsb-logout-icon">⏻</span>
                            Logout
                        </span>
                        <span style={{ fontSize: '.5rem' }}>→</span>
                    </button>
                </nav>
            </div>

            {/* ── Logout confirmation modal ── */}
            {showLogoutModal && (
                <div
                    className="accsb-modal-overlay"
                    onClick={(e) => e.target === e.currentTarget && !loggingOut && setShowLogoutModal(false)}
                >
                    <div className="accsb-modal">
                        <div className="accsb-modal-head">
                            <h3 className="accsb-modal-title">Confirm Logout</h3>
                            <button
                                className="accsb-modal-close"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={loggingOut}
                            >✕</button>
                        </div>
                        <div className="accsb-modal-body">
                            Are you sure you want to log out, <strong>{currentUser?.firstName || userFullName}</strong>? Any unsaved changes will be lost.
                        </div>
                        <div className="accsb-modal-foot">
                            <button
                                className="accsb-btn-cancel"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={loggingOut}
                            >
                                Stay
                            </button>
                            <button
                                className="accsb-btn-logout"
                                onClick={handleLogout}
                                disabled={loggingOut}
                            >
                                {loggingOut
                                    ? <><div className="accsb-spinner" /> Logging out...</>
                                    : <>⏻ &nbsp; Logout</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountSidebar;