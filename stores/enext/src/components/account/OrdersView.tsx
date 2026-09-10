O'use client';

/**
 * OrdersView.tsx
 *
 * Converted from Orders.jsx (AccountOrders). Notable changes:
 *
 *   - `fetchOrders` / `fetchOrdersWithFilters` / `cancelOrder` thunks →
 *     `ordersApi` (`useGetOrdersQuery`, `useGetOrdersWithFiltersQuery`,
 *     `useCancelOrderMutation`), matching the RTK Query pattern used
 *     everywhere else in the app instead of hand-rolled thunks.
 *   - `setCurrentOrder` (a Redux write just to stash the clicked order before
 *     navigating) is gone — the order id is passed straight through the URL
 *     instead, and the destination page reads it via RTK Query's cache/params.
 *   - Dead `logoutUser` import removed (it was imported but never called in
 *     the original file).
 *   - The auth-redirect `useEffect` is gone — handled once in
 *     `AccountClient.tsx`.
 *
 * NOTE: `/orders/[id]` (order detail) and its "Pay" flow into
 * `/checkout/payment` are outside the scope of this pass — checkout pages
 * are still stubbed per the migration tracker. The links below point at the
 * right URLs so wiring them up later is a page-only change.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    useGetOrdersQuery,
    useGetOrdersWithFiltersQuery,
    useCancelOrderMutation,
    type Order,
} from '@/features/api/ordersApi';
import { useCurrentUser } from '@/features/api/authApi';
import AccountSidebar from './AccountSidebar';
import { T, orderStyles } from '../styles';

const STATUS_ACCENT: Record<string, string> = {
    completed: '#2a9d8f',
    delivered: '#2a9d8f',
    shipped: '#4dabf7',
    processing: '#f4a261',
    pending: 'rgba(255,255,255,0.32)',
    failed: '#e63946',
    cancelled: '#444',
};
const STATUS_FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'failed'];

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');
const itemCount = (o: Order) => (!o.items?.length ? 0 : o.items.reduce((s, i) => s + (i.quantity || 0), 0));
const canCancel = (o: Order) => ['pending', 'processing'].includes(o.status?.toLowerCase());
const canPay = (o: Order) => ['failed', 'pending'].includes(o.status?.toLowerCase());

export function OrdersView() {
    const router = useRouter();
    const { currentUser } = useCurrentUser();
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const isFiltered = statusFilter !== 'all';

    const { data: allOrders = [], isLoading: loadingAll, error: allError } = useGetOrdersQuery(
        { sort: '-orderDate' },
        { skip: isFiltered }
    );
    const { data: filteredOrders = [], isLoading: loadingFiltered, error: filteredError } = useGetOrdersWithFiltersQuery(
        { status: statusFilter, sort: '-orderDate' },
        { skip: !isFiltered }
    );
    const [cancelOrder] = useCancelOrderMutation();

    const orders = isFiltered ? filteredOrders : allOrders;
    const loading = isFiltered ? loadingFiltered : loadingAll;
    const error = isFiltered ? filteredError : allError;

    const totalOrderValue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeCount = allOrders.filter((o) => ['pending', 'processing'].includes(o.status?.toLowerCase())).length;

    const sorted = [...orders].sort(
        (a, b) => new Date(b.orderDate || b.createdAt || 0).getTime() - new Date(a.orderDate || a.createdAt || 0).getTime()
    );

    const handleView = (order: Order) => router.push(`/orders/${order.id}`);
    const handlePay = (order: Order) => router.push(`/checkout/payment?orderId=${order.id}`);

    const handleCancel = async (orderId: string) => {
        if (!window.confirm('Cancel this order?')) return;
        setCancellingId(orderId);
        try {
            await cancelOrder({ orderId, reason: 'Customer requested cancellation' }).unwrap();
        } catch (err: any) {
            alert(err?.data?.message || 'Failed to cancel order');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <>
            <style>{orderStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />
            <div className="op">
                {/* HERO */}
                <section className="oh">
                    <div className="oh-stripe" />
                    <div className="oh-ghost" aria-hidden>
                        ORDERS
                    </div>
                    <div className="oh-inner">
                        <div className="oh-bc">
                            <Link href="/" className="oh-bc a">
                                Home
                            </Link>
                            <span className="oh-bc-sep">✦</span>
                            <Link href="/dashboard">Account</Link>
                            <span className="oh-bc-sep">✦</span>
                            <span className="oh-bc-cur">My Orders</span>
                        </div>
                        <span className="oh-eyebrow">My Account</span>
                        <h1 className="oh-title">
                            My <span>Orders</span>
                        </h1>
                    </div>
                </section>

                {/* LAYOUT */}
                <div className="ol">
                    <AccountSidebar currentUser={currentUser} userFullName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : undefined} />
                    <main>
                        {/* Stats */}
                        <div className="os">
                            {[
                                { val: allOrders.length, lbl: 'Total Orders', sa: T.red },
                                { val: `$${totalOrderValue.toFixed(2)}`, lbl: 'Total Spent', sa: T.orange },
                                { val: activeCount, lbl: 'Active Orders', sa: T.teal },
                            ].map((s) => (
                                <div key={s.lbl} className="os-item" style={{ ['--sa' as string]: s.sa }}>
                                    <span className="os-val">{s.val}</span>
                                    <span className="os-lbl">{s.lbl}</span>
                                </div>
                            ))}
                        </div>

                        {/* Toolbar */}
                        <div className="otb">
                            <h2 className="otb-title">
                                Order History
                                {isFiltered && (
                                    <span style={{ color: T.red, fontFamily: "'Space Mono',monospace", fontSize: '.7rem', marginLeft: '.75rem' }}>
                                        {' '}
                                        — {statusFilter}
                                    </span>
                                )}
                            </h2>
                            <button className={`otb-btn${showFilters ? ' act' : ''}`} onClick={() => setShowFilters((s) => !s)}>
                                ▼ Filter{isFiltered && ` (${statusFilter})`}
                            </button>
                        </div>

                        {/* Filter drawer */}
                        {showFilters && (
                            <div className="ofd">
                                <div>
                                    <span className="ofd-lbl">Status</span>
                                    <select className="ofd-sel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        {STATUS_FILTERS.map((s) => (
                                            <option key={s} value={s}>
                                                {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isFiltered && (
                                    <button className="ofd-clr" onClick={() => setStatusFilter('all')}>
                                        ✕ Clear
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="o-err">
                                <span>⚠</span>
                                <span style={{ flex: 1 }}>Something went wrong loading your orders. Please try again.</span>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="o-ldg">
                                <div className="o-ldg-spin" />
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && sorted.length === 0 && (
                            <div className="o-empty">
                                <span className="o-empty-icon">📭</span>
                                <h3 className="o-empty-title">No orders found</h3>
                                <p className="o-empty-sub">
                                    {isFiltered ? `No ${statusFilter} orders. Try a different filter.` : "You haven't placed any orders yet."}
                                </p>
                                {!isFiltered ? (
                                    <Link href="/shop" className="o-btn-primary">
                                        🛍️ Browse Products
                                    </Link>
                                ) : (
                                    <button className="o-btn-primary" onClick={() => setStatusFilter('all')}>
                                        View All Orders
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Order cards */}
                        {!loading &&
                            sorted.map((order) => {
                                const sk = order.status?.toLowerCase() || 'pending';
                                const sc = STATUS_ACCENT[sk] || T.textDim;
                                const slbl = (order.status?.charAt(0).toUpperCase() + order.status?.slice(1)) || 'Pending';
                                const ic = itemCount(order);
                                return (
                                    <div key={order.id} className="oc" style={{ ['--sc' as string]: sc }}>
                                        <div className="oc-head">
                                            <span className="oc-num">
                                                Order <span>#{order.orderNumber || order.id}</span>
                                            </span>
                                            <div className="oc-pill">
                                                <span className="oc-dot" />
                                                {slbl}
                                            </div>
                                        </div>
                                        <div className="oc-body">
                                            <div>
                                                <span className="oc-fl">Date</span>
                                                <span className="oc-fv">{fmtDate(order.orderDate || order.createdAt)}</span>
                                            </div>
                                            <div>
                                                <span className="oc-fl">Total</span>
                                                <span className="oc-fv" style={{ color: T.orange }}>
                                                    ${(order.total || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="oc-fl">Items</span>
                                                <span className="oc-fv">
                                                    {ic} item{ic !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="oc-actions">
                                                <button className="ob ob-v" onClick={() => handleView(order)}>
                                                    View →
                                                </button>
                                                {canPay(order) && (
                                                    <button className="ob ob-p" onClick={() => handlePay(order)}>
                                                        💳 Pay
                                                    </button>
                                                )}
                                                {canCancel(order) && (
                                                    <button className="ob ob-x" onClick={() => handleCancel(order.id)} disabled={cancellingId === order.id}>
                                                        {cancellingId === order.id ? (
                                                            <>
                                                                <div className="o-spin" /> Cancelling…
                                                            </>
                                                        ) : (
                                                            '✕ Cancel'
                                                        )}
                                                    </button>
                                                )}
                                                {order.trackingNumber && (
                                                    <button className="ob ob-t" onClick={() => window.open(`/track/${order.trackingNumber}`, '_blank')}>
                                                        📡 Track
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </main>
                </div>

                <div className="o-ab" />
            </div>
        </>
    );
}

export default OrdersView;