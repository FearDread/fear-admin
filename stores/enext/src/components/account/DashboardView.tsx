'use client';

import { useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentUser } from '@/lib/redux/slices/authSlice';
import { useGetOrdersQuery } from '@/lib/redux/api/ordersApi';
import { useGetWishlistQuery } from '@/lib/redux/api/wishlistApi';
import { useGetAddressesQuery } from '@/lib/redux/api/addressesApi';
import { fullName, formatDate, formatMoney } from '@/lib/account/helpers';
import { byNewest, capitalize, STATUS_COLOR, toOrderView } from '@/lib/account/orders';
import { T } from './styles';

const ACTIONS = [
    { icon: '🛍️', label: 'Continue Shopping', to: '/shop', primary: true },
    { icon: '📋', label: 'View Orders', to: '/account/orders' },
    { icon: '❤️', label: 'Wishlist', to: '/wishlist' },
    { icon: '✏️', label: 'Edit Profile', to: '/account/details' },
    { icon: '📍', label: 'Addresses', to: '/account/addresses' },
];

export default function DashboardView() {
    const currentUser = useAppSelector(selectCurrentUser);

    // Counts come from the same RTK Query caches the other pages use, so they're
    // always in sync with what those pages show (the old version read
    // orderCount/wishlistCount/addressCount off the user record, which the
    // session endpoint doesn't return).
    const { data: orders, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery({ sort: '-orderDate' });
    const { data: wishlist, isLoading: wishLoading, isError: wishError } = useGetWishlistQuery();
    const { data: addresses, isLoading: addrLoading, isError: addrError } = useGetAddressesQuery();

    const recent = useMemo(() => (orders ?? []).map(toOrderView).sort(byNewest).slice(0, 3), [orders]);

    if (!currentUser) return null;
    const name = currentUser.firstName || fullName(currentUser);

    const stat = (loading: boolean, failed: boolean, count?: number) => (loading ? '…' : failed ? '—' : (count ?? 0));
    const STATS = [
        { icon: '📦', label: 'Total Orders', val: stat(ordersLoading, ordersError, orders?.length), accent: T.red },
        { icon: '❤️', label: 'Wishlist Items', val: stat(wishLoading, wishError, wishlist?.length), accent: T.orange },
        { icon: '📍', label: 'Saved Addresses', val: stat(addrLoading, addrError, addresses?.length), accent: T.teal },
    ];

    const INFO = [
        { label: 'Email', val: currentUser.email },
        { label: 'Phone', val: currentUser.phone, empty: 'Not provided' },
        { label: 'Country', val: currentUser.country, empty: 'Not specified' },
        {
            label: 'Member Since',
            val: currentUser.createdAt ? formatDate(currentUser.createdAt, { year: 'numeric', month: 'long', day: 'numeric' }) : null,
            empty: 'N/A',
        },
    ];

    return (
        <>
            <div className="acct-welcome">
                <span aria-hidden="true" style={{ fontSize: '1.5rem' }}>👋</span>
                <div>
                    <h2>Welcome back, <span>{name}</span></h2>
                    <p>
                        Check your <Link href="/account/orders">recent orders</Link>, manage your{' '}
                        <Link href="/account/addresses">shipping and billing addresses</Link>, or{' '}
                        <Link href="/account/details">update your password and details</Link>.
                    </p>
                </div>
            </div>

            <div className="acct-stats">
                {STATS.map((s) => (
                    <div key={s.label} className="acct-stat" style={{ '--sa': s.accent } as CSSProperties}>
                        <span aria-hidden="true" style={{ fontSize: '1.3rem', display: 'block', marginBottom: '.5rem' }}>{s.icon}</span>
                        <span className="acct-stat-val">{s.val}</span>
                        <span className="acct-stat-lbl">{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="acct-section-head"><h3>Quick Actions</h3><i /></div>
            <div className="acct-actions">
                {ACTIONS.map((a) => (
                    <Link key={a.to} href={a.to} className={`acct-btn acct-btn--sm${a.primary ? '' : ' acct-btn--ghost'}`}>
                        <span aria-hidden="true">{a.icon}</span> {a.label}
                    </Link>
                ))}
            </div>

            <div className="acct-section-head"><h3>Recent Orders</h3><i /></div>
            {ordersLoading ? (
                <><div className="acct-skel" /><div className="acct-skel" /></>
            ) : recent.length === 0 ? (
                <div className="acct-empty" style={{ marginBottom: '2rem' }}>
                    <span className="acct-empty-icon" aria-hidden="true">📭</span>
                    <h3>{ordersError ? 'Orders unavailable' : 'No orders yet'}</h3>
                    <p>{ordersError ? "We couldn't load your orders. Try again shortly." : 'Your first order will show up here.'}</p>
                    {!ordersError && <Link href="/shop" className="acct-btn">Browse the shop</Link>}
                </div>
            ) : (
                <div style={{ marginBottom: '2rem' }}>
                    {recent.map((o) => (
                        <Link
                            key={o.id}
                            href="/account/orders"
                            className="acct-order"
                            style={{ '--c': STATUS_COLOR[o.status] ?? T.border, display: 'block', textDecoration: 'none' } as CSSProperties}
                        >
                            <div className="acct-order-body" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                <div><span className="acct-fl">Order</span><span className="acct-fv">#{o.number}</span></div>
                                <div><span className="acct-fl">Date</span><span className="acct-fv">{formatDate(o.date)}</span></div>
                                <div><span className="acct-fl">Total</span><span className="acct-fv">{formatMoney(o.total)}</span></div>
                                <div><span className="acct-pill">{capitalize(o.status)}</span></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="acct-section-head"><h3>Account Information</h3><i /></div>
            <div className="acct-info-grid">
                {INFO.map((item) => (
                    <div key={item.label} className="acct-info-cell">
                        <span className="acct-info-lbl">{item.label}</span>
                        <span className={`acct-info-val${item.val ? '' : ' empty'}`}>{item.val || item.empty}</span>
                    </div>
                ))}
            </div>
        </>
    );
}