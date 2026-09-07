'use client';

/**
 * DashboardView.tsx
 *
 * Converted from Dashboard.jsx (AccountDashboard). The auth-redirect
 * `useEffect` that used to live here now lives once in `AccountClient.tsx`,
 * so this component can assume `currentUser` is present. `useNavigate` was
 * otherwise unused for anything but that redirect, so it's gone entirely —
 * one of the "dead useNavigate() declaration" bug patterns called out in
 * past sessions.
 */

import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { selectCurrentUser, selectUserLoading, selectLastLoginAt } from '@/features/user/slice';
import AccountSidebar from './AccountSidebar';
import { T, dashStyles } from '../styles';

export const DashboardView = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectUserLoading);
    const lastLoginAt = useAppSelector(selectLastLoginAt);

    if (loading || !currentUser) {
        return (
            <>
                <style>{dashStyles}</style>
                <div className="dash-loading">
                    <div className="dash-loading-spinner" />
                    <span className="dash-loading-label">Loading account…</span>
                </div>
            </>
        );
    }

    const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const sidebarProps = { currentUser, userFullName, lastLoginAt };

    const STATS = [
        { icon: '📦', label: 'Total Orders', val: currentUser.orderCount || 0, accent: T.red },
        { icon: '❤️', label: 'Wishlist Items', val: currentUser.wishlistCount || 0, accent: T.orange },
        { icon: '📍', label: 'Saved Addresses', val: currentUser.addressCount || 0, accent: T.teal },
    ];

    const INFO = [
        { label: 'Email', val: currentUser.email },
        { label: 'Phone', val: currentUser.phone || null, empty: 'Not provided' },
        { label: 'Country', val: currentUser.country || null, empty: 'Not specified' },
        {
            label: 'Member Since',
            val: currentUser.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                : null,
            empty: 'N/A',
        },
    ];

    const ACTIONS = [
        { icon: '🛍️', label: 'Continue Shopping', to: '/shop', primary: true },
        { icon: '📋', label: 'View Orders', to: '/account/orders' },
        { icon: '✏️', label: 'Edit Profile', to: '/account/details' },
        { icon: '📍', label: 'Addresses', to: '/account/addresses' },
    ];

    return (
        <>
            <style>{dashStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="dash-page">
                {/* ── HERO ── */}
                <section className="dash-hero">
                    <div className="dash-hero-stripe" />
                    <div className="dash-hero-ghost" aria-hidden>
                        ACCOUNT
                    </div>
                    <div className="dash-hero-inner">
                        <div className="dash-breadcrumb">
                            <Link href="/" className="dash-bc-link">
                                Home
                            </Link>
                            <span className="dash-bc-sep">✦</span>
                            <span className="dash-bc-current">Dashboard</span>
                        </div>
                        <span className="dash-eyebrow">My Account</span>
                        <h1 className="dash-hero-title">
                            Hey, <span>{currentUser.firstName || userFullName}</span>
                        </h1>
                    </div>
                </section>

                {/* ── MAIN LAYOUT ── */}
                <div className="dash-layout">
                    <AccountSidebar {...sidebarProps} />

                    <main>
                        {/* Welcome banner */}
                        <div className="dash-welcome">
                            <span className="dash-welcome-icon">👋</span>
                            <div>
                                <h2 className="dash-welcome-title">
                                    Welcome back, <span>{currentUser.firstName || userFullName}</span>!
                                </h2>
                                <p className="dash-welcome-sub">
                                    Good to see you again. From here you can view your{' '}
                                    <Link href="/account/orders">recent orders</Link>, manage your{' '}
                                    <Link href="/account/addresses">shipping and billing addresses</Link>, and{' '}
                                    <Link href="/account/details">edit your password and account details</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="dash-stats">
                            {STATS.map((s) => (
                                <div key={s.label} className="dash-stat-card" style={{ ['--stat-accent' as string]: s.accent }}>
                                    <span className="dash-stat-icon">{s.icon}</span>
                                    <span className="dash-stat-val">{s.val}</span>
                                    <span className="dash-stat-label">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quick actions */}
                        <div className="dash-section-head">
                            <h3 className="dash-section-title">Quick Actions</h3>
                            <div className="dash-section-line" />
                        </div>
                        <div className="dash-actions">
                            {ACTIONS.map((a) => (
                                <Link key={a.to} href={a.to} className={`dash-action-btn${a.primary ? ' primary' : ''}`}>
                                    <span className="dash-action-btn-icon">{a.icon}</span>
                                    {a.label}
                                </Link>
                            ))}
                        </div>

                        {/* Account information */}
                        <div className="dash-section-head">
                            <h3 className="dash-section-title">Account Information</h3>
                            <div className="dash-section-line" />
                        </div>
                        <div className="dash-info-grid">
                            {INFO.map((item) => (
                                <div key={item.label} className="dash-info-cell">
                                    <span className="dash-info-label">{item.label}</span>
                                    <span className={`dash-info-val${!item.val ? ' dash-info-empty' : ''}`}>
                                        {item.val || item.empty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>

                <div className="dash-animated-border" />
            </div>
        </>
    );
};

export default DashboardView;