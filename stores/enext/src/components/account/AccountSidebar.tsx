'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentUser } from '@/lib/redux/slices/authSlice';
import { useLogoutMutation } from '@/lib/redux/api/authApi';
import { avatarUrl, fullName, initials, timeAgo } from '@/lib/account/helpers';

const MENU_ITEMS = [
    { label: 'Dashboard', path: '/account/dashboard', icon: '⊞' },
    { label: 'Orders', path: '/account/orders', icon: '📦' },
    { label: 'Addresses', path: '/account/addresses', icon: '📍' },
    { label: 'Payment Methods', path: '/account/payment-methods', icon: '💳' },
    { label: 'Account Details', path: '/account/details', icon: '👤' },
] as const;

// Module scope on purpose — declaring this inside AccountSidebar would remount it every render.
function LogoutModal({
    name,
    busy,
    onCancel,
    onConfirm,
}: {
    name: string;
    busy: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div
            className="acct-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acct-logout-title"
            onClick={(e) => e.target === e.currentTarget && !busy && onCancel()}
        >
            <div className="acct-modal">
                <div className="acct-modal-head">
                    <h3 className="acct-modal-title" id="acct-logout-title">Log out</h3>
                    <button className="acct-modal-close" onClick={onCancel} disabled={busy} aria-label="Close">✕</button>
                </div>
                <div className="acct-modal-body">
                    Log out of <strong>{name}</strong>? Your cart stays saved to your account.
                </div>
                <div className="acct-modal-foot">
                    <button className="acct-btn acct-btn--ghost" onClick={onCancel} disabled={busy}>Stay signed in</button>
                    <button className="acct-btn" onClick={onConfirm} disabled={busy}>
                        {busy ? (<><span className="acct-spinner" /> Logging out…</>) : 'Log out'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AccountSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const currentUser = useAppSelector(selectCurrentUser);
    const [logout, { isLoading: loggingOut }] = useLogoutMutation();
    const [showModal, setShowModal] = useState(false);

    const name = fullName(currentUser);
    const avatar = avatarUrl(currentUser);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            router.push('/login?message=' + encodeURIComponent('You have been logged out successfully'));
        } catch {
            // logout's onQueryStarted resets local auth state in `finally`; still leave the account area.
            router.push('/login');
        } finally {
            setShowModal(false);
        }
    };

    return (
        <>
            <aside className="acct-sb" aria-label="Account navigation">
                <div className="acct-sb-profile">
                    <div className="acct-avatar">
                        {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt={name} />
                        ) : (
                            <div className="acct-avatar-initials">{initials(currentUser)}</div>
                        )}
                        <span className="acct-avatar-dot" title="Signed in" />
                    </div>
                    <h2 className="acct-sb-name">{name}</h2>
                    <p className="acct-sb-email">{currentUser?.email}</p>
                    {currentUser?.lastLoginAt && (
                        <div className="acct-sb-login"><b>●</b>Last login {timeAgo(currentUser.lastLoginAt)}</div>
                    )}
                </div>

                <nav className="acct-nav">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            prefetch={false}
                            className={`acct-nav-item${pathname === item.path ? ' active' : ''}`}
                            aria-current={pathname === item.path ? 'page' : undefined}
                        >
                            <span className="acct-nav-left">
                                <span className="acct-nav-icon" aria-hidden="true">{item.icon}</span>
                                {item.label}
                            </span>
                            <span className="acct-nav-arrow" aria-hidden="true">→</span>
                        </Link>
                    ))}
                    <div className="acct-nav-divider" />
                    <button className="acct-logout" onClick={() => setShowModal(true)}>
                        <span>⏻&nbsp; Logout</span>
                    </button>
                </nav>
            </aside>

            {showModal && (
                <LogoutModal
                    name={currentUser?.firstName || name}
                    busy={loggingOut}
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleLogout}
                />
            )}
        </>
    );
}